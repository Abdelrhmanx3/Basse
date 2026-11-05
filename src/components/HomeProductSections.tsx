"use client";

import Image from "next/image";
import Link from "next/link";
import type { Language } from "../context/LangContext";
import { useProducts } from "../context/ProductsContext";
import { translations } from "../i18n/translations.js";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton, ProductLoadError } from "./ProductsStates";
import { Icon } from "./Icon";

export function CategorySection({ language }: { language: Language }) {
  const t = translations[language];
  const { categories, products, loading, error, retry } = useProducts();

  return (
    <section className="mx-auto w-full max-w-[1380px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777168] dark:text-[#c1bbaf]">
            {t.category}
          </p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#201f1c] dark:text-[#f3f0e9] sm:text-3xl">
            {t.shopAll}
          </h2>
        </div>
        <Link
          className="inline-flex min-h-11 items-center gap-1 text-xs font-medium text-[#625c51] hover:text-[#76511e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] dark:text-[#c1bbaf] dark:hover:text-[#d8b576] sm:text-sm"
          href="/products"
        >
          {t.shopAll}
          <Icon className="size-4 rtl:rotate-180" name="arrow" />
        </Link>
      </div>
      {error ? (
        <ProductLoadError language={language} onRetry={retry} />
      ) : loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              className="aspect-[4/4.8] animate-pulse bg-[#efede7] dark:bg-[#292821]"
              key={index}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {categories.map((category) => {
            const product = products.find((item) => item.category === category.id);
            const image = product?.colors[0]?.images[0] ?? "";

            return (
              <Link
                className="group relative aspect-[4/4.8] overflow-hidden bg-[#efede7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] dark:bg-[#292821]"
                href={`/products?category=${category.id}`}
                key={category.id}
              >
                {image && (
                  <Image
                    alt=""
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 16vw"
                    src={image}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                <span className="absolute inset-x-3 bottom-3 text-sm font-medium text-white sm:inset-x-4 sm:bottom-4">
                  {category.name[language]}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function FeaturedProducts({
  language,
  newest = false,
}: {
  language: Language;
  newest?: boolean;
}) {
  const t = translations[language];
  const { products, loading, error, retry } = useProducts();
  const featured = newest
    ? products.filter((product) => product.isNew).slice(0, 4)
    : products.filter((product) => product.featured).slice(0, 4);

  return (
    <section className="mx-auto w-full max-w-[1380px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777168] dark:text-[#c1bbaf]">
            {newest ? t.newArrivals : t.featuredPicks}
          </p>
          <h2 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#201f1c] dark:text-[#f3f0e9] sm:text-3xl">
            {newest ? t.newArrivals : t.featuredPicks}
          </h2>
        </div>
        <Link
          className="inline-flex min-h-11 items-center gap-1 text-xs font-medium text-[#625c51] hover:text-[#76511e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] dark:text-[#c1bbaf] dark:hover:text-[#d8b576] sm:text-sm"
          href="/products"
        >
          {t.shopAll}
          <Icon className="size-4 rtl:rotate-180" name="arrow" />
        </Link>
      </div>
      {error ? (
        <ProductLoadError language={language} onRetry={retry} />
      ) : loading ? (
        <ProductGridSkeleton language={language} />
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
