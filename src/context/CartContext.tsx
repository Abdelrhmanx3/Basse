"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Product, ProductColor } from "../data/productTypes";
import { LangProvider, type Language } from "./LangContext";
import { ProductsProvider, useProducts } from "./ProductsContext";
import { ThemeProvider } from "./ThemeContext";
import { createPersistedStore } from "../utils/createPersistedStore";

export type CartLine = {
  lineId: string;
  productId: string;
  size: string;
  color: ProductColor;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  isHydrated: boolean;
  notification: { id: number; message: "addedToCart" } | null;
  addItem: (product: Product, size: string, color: ProductColor, quantity: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  dismissNotification: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function getLineId(productId: string, size: string, colorHex: string) {
  return `${productId}:${size}:${colorHex.toLowerCase()}`;
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CartLine>;
  const color = candidate.color;

  return Boolean(
    typeof candidate.productId === "string" &&
      typeof candidate.size === "string" &&
      typeof candidate.quantity === "number" &&
      Number.isSafeInteger(candidate.quantity) &&
      candidate.quantity > 0 &&
      color &&
      typeof color.hex === "string" &&
      typeof color.name?.ar === "string" &&
      typeof color.name?.en === "string" &&
      Array.isArray(color.images),
  );
}

function parseCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) throw new Error("Saved cart data is not an array.");

  return value.filter(isCartLine).flatMap((line) => {
    return [{
      lineId: getLineId(line.productId, line.size, line.color.hex),
      productId: line.productId,
      size: line.size,
      color: line.color,
      quantity: line.quantity,
    }];
  });
}

const cartStore = createPersistedStore("basse-cart-v1", [] as CartLine[], parseCart);
const wishlistStore = createPersistedStore("basse-wishlist-v1", [] as string[], (value) => {
  if (!Array.isArray(value)) throw new Error("Saved wishlist data is not an array.");
  return [...new Set(value)].filter(
    (id): id is string => typeof id === "string",
  );
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, loading: productsLoading } = useProducts();
  const cart = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const [notification, setNotification] = useState<CartContextValue["notification"]>(null);
  const items = cart.value.filter((line) => {
    const product = products.find((entry) => entry.id === line.productId);
    return Boolean(
      product &&
        product.colors.some(
          (color) =>
            color.hex === line.color.hex &&
            (color.sizes ?? product.sizes).includes(line.size),
        ),
    );
  });

  const addItem = useCallback(
    (product: Product, size: string, color: ProductColor, quantity: number) => {
      const lineId = getLineId(product.id, size, color.hex);
      cartStore.update((current) => {
        const existingLine = current.find((item) => item.lineId === lineId);
        if (!existingLine) {
          return [...current, { lineId, productId: product.id, size, color, quantity }];
        }
        return current.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      });
      setNotification({ id: Date.now(), message: "addedToCart" });
    },
    [],
  );

  const removeItem = useCallback((lineId: string) => {
    cartStore.update((current) => current.filter((item) => item.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    cartStore.update((current) =>
      current.map((item) =>
        item.lineId === lineId
          ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
          : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => cartStore.update(() => []), []);
  const dismissNotification = useCallback(() => setNotification(null), []);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      isHydrated: cart.isHydrated && !productsLoading,
      notification,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      dismissNotification,
    }),
    [
      addItem,
      cart.isHydrated,
      productsLoading,
      clearCart,
      dismissNotification,
      itemCount,
      items,
      notification,
      removeItem,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider.");
  return context;
}

type WishlistContextValue = {
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts();
  const wishlist = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot,
  );
  const favorites = wishlist.value.filter((id) =>
    products.some((product) => product.id === id),
  );

  const toggleFavorite = useCallback((productId: string) => {
    wishlistStore.update((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites],
  );
  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite }),
    [favorites, isFavorite, toggleFavorite],
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside WishlistProvider.");
  }
  return context;
}

export function AppProviders({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage: Language;
}) {
  return (
    <ThemeProvider>
      <ProductsProvider>
        <LangProvider initialLanguage={initialLanguage}>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </LangProvider>
      </ProductsProvider>
    </ThemeProvider>
  );
}
