"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearProductDataCache,
  loadProductCatalog,
} from "../utils/dataLoader.js";
import type {
  Product,
  ProductCatalog,
  ProductCategory,
} from "../data/productTypes";

type ProductsContextValue = {
  products: Product[];
  categories: ProductCategory[];
  loading: boolean;
  error: Error | null;
  retry: () => void;
  getBySlug: (slug: string) => Product | undefined;
  getRelated: (product: Product, count?: number) => Product[];
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [requestNumber, setRequestNumber] = useState(0);

  useEffect(() => {
    let active = true;

    loadProductCatalog()
      .then((catalog: ProductCatalog) => {
        if (!active) return;
        setProducts(catalog.products);
        setCategories(catalog.categories);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(
          reason instanceof Error
            ? reason
            : new Error("Unable to load product data."),
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [requestNumber]);

  const retry = useCallback(() => {
    clearProductDataCache();
    setLoading(true);
    setError(null);
    setRequestNumber((current) => current + 1);
  }, []);

  const getBySlug = useCallback(
    (slug: string) => products.find((product) => product.slug === slug),
    [products],
  );
  const getRelated = useCallback(
    (product: Product, count = 4) =>
      products
        .filter(
          (entry) =>
            entry.category === product.category && entry.id !== product.id,
        )
        .slice(0, count),
    [products],
  );

  const value = useMemo(
    () => ({
      products,
      categories,
      loading,
      error,
      retry,
      getBySlug,
      getRelated,
    }),
    [categories, error, getBySlug, getRelated, loading, products, retry],
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used inside ProductsProvider.");
  }
  return context;
}
