"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLanguage } from "../context/LangContext";
import { useWishlist } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import { formatPrice } from "../utils/formatPrice";
import { ProductCard } from "./ProductCard";
import { Icon } from "./Icon";
import { ProductGridSkeleton, ProductLoadError } from "./ProductsStates";

type SortOption = "featured" | "price-ascending" | "price-descending" | "newest";

function updateQuery(key: string, value: string) {
  const params = new URLSearchParams(window.location.search);
  if (value) params.set(key, value);
  else params.delete(key);
  const query = params.toString();
  return `${window.location.pathname}${query ? `?${query}` : ""}`;
}

export function ProductsExplorer({
  initialCategory,
  initialFavorites,
  initialSearch,
  initialSort,
  initialMaxPrice,
  initialSize,
}: {
  initialCategory: string;
  initialFavorites: boolean;
  initialSearch: string;
  initialSort: SortOption;
  initialMaxPrice: number;
  initialSize: string;
}) {
  const { language, t } = useLanguage();
  const { favorites } = useWishlist();
  const { categories, products, loading, error, retry } = useProducts();
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [size, setSize] = useState(initialSize);
  useEffect(() => setCategory(initialCategory), [initialCategory]);
  useEffect(() => setSearch(initialSearch), [initialSearch]);
  useEffect(() => setSort(initialSort), [initialSort]);
  useEffect(() => setMaxPrice(initialMaxPrice), [initialMaxPrice]);
  useEffect(() => setSize(initialSize), [initialSize]);
  const activeCategory = categories.some((item) => item.id === category)
    ? category
    : "";
  const availableSizes = useMemo(
    () => [...new Set(products.flatMap((product) =>
      product.colors.flatMap((color) => color.sizes ?? product.sizes),
    ))],
    [products],
  );
  const activeSize = availableSizes.includes(size) ? size : "";
  const emptyStateImage = products[0]?.colors[0]?.images[0];

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase(language);
    const filtered = products.filter((product) => {
      const matchesCategory = !activeCategory || product.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        product.name[language].toLocaleLowerCase(language).includes(normalizedSearch) ||
        product.description[language].toLocaleLowerCase(language).includes(normalizedSearch);
      const matchesPrice = product.price <= maxPrice;
      const matchesFavorite = !initialFavorites || favorites.includes(product.id);
      const matchesSize =
        !activeSize ||
        product.colors.some((color) =>
          (color.sizes ?? product.sizes).includes(activeSize),
        );
      return matchesCategory && matchesSearch && matchesPrice && matchesFavorite && matchesSize;
    });

    return filtered.toSorted((left, right) => {
      if (sort === "price-ascending") return left.price - right.price;
      if (sort === "price-descending") return right.price - left.price;
      if (sort === "newest") {
        return Number(right.isNew) - Number(left.isNew);
      }
      return Number(right.featured) - Number(left.featured);
    });
  }, [activeCategory, activeSize, favorites, initialFavorites, language, maxPrice, products, search, sort]);

  const navigate = (key: string, value: string) => {
    window.history.replaceState(null, "", updateQuery(key, value));
  };

  const clearFilters = () => {
    setCategory("");
    setSearch("");
    setSort("featured");
    setMaxPrice(2500);
    setSize("");
    window.history.replaceState(null, "", window.location.pathname);
  };

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1380px] px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        <ProductLoadError language={language} onRetry={retry} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1380px] px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        <div className="mb-8 h-10 w-48 animate-pulse bg-[#e9e6df] dark:bg-[#343129]" />
        <ProductGridSkeleton count={8} language={language} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1380px] px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
      <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#e9e6df] dark:border-[#403d35] pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777168] dark:text-[#c1bbaf]">
            {initialFavorites ? t.wishlist : t.products}
          </p>
          <h1 className="mt-2 text-3xl font-medium tracking-[-0.05em] text-[#201f1c] dark:text-[#f3f0e9] sm:text-4xl">
            {initialFavorites ? t.wishlist : t.shopAll}
          </h1>
        </div>
        <p className="text-xs text-[#6c685f] dark:text-[#c1bbaf]" aria-live="polite">
          {filteredProducts.length} {t.results}
        </p>
      </div>

      {initialFavorites ? (
        <div className="mb-6 flex items-center gap-2 text-sm text-[#67635b] dark:text-[#c1bbaf]">
          <Icon className="size-4 text-[#98702f] dark:text-[#d8b576]" name="heart" />
          {t.wishlist}
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2" aria-label={t.category}>
            <button
              aria-pressed={!activeCategory}
              className={`min-h-10 rounded-full border px-4 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] ${!activeCategory ? "border-[#24231f] bg-[#24231f] dark:bg-[#343129] text-white" : "border-[#dcd8cf] dark:border-[#403d35] text-[#4b4841] dark:text-[#e2ded6] hover:border-[#8f7955]"}`}
              onClick={() => {
                setCategory("");
                navigate("category", "");
              }}
              type="button"
            >
              {t.allCategories}
            </button>
            {categories.map((item) => (
              <button
                aria-pressed={activeCategory === item.id}
                className={`min-h-10 rounded-full border px-4 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] ${category === item.id ? "border-[#24231f] bg-[#24231f] dark:bg-[#343129] text-white" : "border-[#dcd8cf] dark:border-[#403d35] text-[#4b4841] dark:text-[#e2ded6] hover:border-[#8f7955]"}`}
                key={item.id}
                onClick={() => {
                  setCategory(item.id);
                  navigate("category", item.id);
                }}
                type="button"
              >
                {item.name[language]}
              </button>
            ))}
          </div>

          <div className="mb-8 grid gap-4 border-y border-[#e9e6df] dark:border-[#403d35] py-4 sm:grid-cols-[minmax(220px,1fr)_minmax(120px,0.6fr)_minmax(120px,0.6fr)_minmax(180px,0.8fr)] sm:items-end">
            <div>
              <label className="sr-only" htmlFor="product-search">{t.search}</label>
              <div className="flex min-h-11 items-center gap-2 border-b border-[#cfcac0] dark:border-[#514d43] focus-within:border-[#76511e]">
                <Icon className="size-[18px] shrink-0 text-[#777168] dark:text-[#c1bbaf]" name="search" />
                <input
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-[#6b675f] dark:placeholder:text-[#9b9589] focus-visible:outline-none"
                  id="product-search"
                  name="search"
                  onChange={(event) => {
                    setSearch(event.target.value);
                    navigate("search", event.target.value);
                  }}
                  placeholder={t.searchPlaceholder}
                  type="search"
                  value={search}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-[#69655d] dark:text-[#c1bbaf]" htmlFor="filter-size">{t.size}</label>
              <select
                className="min-h-11 w-full border-b border-[#cfcac0] dark:border-[#514d43] bg-transparent pe-7 text-sm outline-none focus-visible:border-[#76511e] focus-visible:ring-2 focus-visible:ring-[#a16207]"
                id="filter-size"
                name="size"
                onChange={(event) => {
                  setSize(event.target.value);
                  navigate("size", event.target.value);
                }}
                value={activeSize}
              >
                <option value="">{t.allSizes}</option>
                {availableSizes.map((availableSize) => (
                  <option key={availableSize} value={availableSize}>{availableSize}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-[#69655d] dark:text-[#c1bbaf]" htmlFor="sort-products">{t.sort}</label>
              <select
                className="min-h-11 w-full border-b border-[#cfcac0] dark:border-[#514d43] bg-transparent pe-7 text-sm outline-none focus-visible:border-[#76511e] focus-visible:ring-2 focus-visible:ring-[#a16207]"
                id="sort-products"
                name="sort"
                onChange={(event) => {
                  setSort(event.target.value as SortOption);
                  navigate("sort", event.target.value === "featured" ? "" : event.target.value);
                }}
                value={sort}
              >
                <option value="featured">{t.featured}</option>
                <option value="price-ascending">{t.priceLow}</option>
                <option value="price-descending">{t.priceHigh}</option>
                <option value="newest">{t.newest}</option>
              </select>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between gap-2 text-[11px] text-[#69655d] dark:text-[#c1bbaf]">
                <label htmlFor="max-price">{t.priceRange}</label>
                <output htmlFor="max-price">{formatPrice(maxPrice, language)}</output>
              </div>
              <input
                className="h-11 w-full accent-[#76511e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
                id="max-price"
                max="2500"
                min="300"
                name="maxPrice"
                onChange={(event) => {
                  const value = Number(event.target.value);
                  setMaxPrice(value);
                  navigate("maxPrice", value === 2500 ? "" : String(value));
                }}
                step="50"
                type="range"
                value={maxPrice}
              />
            </div>
          </div>
        </>
      )}

      {filteredProducts.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
          {filteredProducts.map((product, index) => (
            <ProductCard eager={index === 0} key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
          {initialFavorites ? (
            <Icon className="size-8 text-[#8b6b37] dark:text-[#d8b576]" name="heart" />
          ) : emptyStateImage ? (
            <div className="relative mb-4 size-32 overflow-hidden bg-[#efede7] dark:bg-[#292821]">
                <Image
                  alt=""
                  className="object-cover opacity-60"
                  fill
                  sizes="128px"
                  src={emptyStateImage}
                />
            </div>
          ) : null}
          <h2 className="text-lg font-medium">{initialFavorites ? t.emptyFavorites : t.noResults}</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[#6b675f] dark:text-[#c1bbaf]">{t.noResultsHint}</p>
          <button
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded border border-[#d5d0c6] dark:border-[#403d35] px-4 text-sm font-medium hover:bg-white dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
            onClick={clearFilters}
            type="button"
          >
            {t.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
}
