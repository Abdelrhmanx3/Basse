"use client";

import { NotFoundContent } from "./NotFoundContent";
import { ProductDetailsClient } from "./ProductDetailsClient";
import { ProductLoadError } from "./ProductsStates";
import { useLanguage } from "../context/LangContext";
import { useProducts } from "../context/ProductsContext";

export function ProductPageContent({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const { loading, error, retry, getBySlug, getRelated } = useProducts();

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1380px] px-5 py-12 sm:px-8 lg:px-10">
        <ProductLoadError language={language} onRetry={retry} />
      </div>
    );
  }

  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className="mx-auto grid w-full max-w-[1380px] gap-8 px-5 py-7 sm:px-8 sm:py-10 lg:grid-cols-2 lg:gap-14 lg:px-10"
        role="status"
      >
        <div className="aspect-[4/4.8] animate-pulse bg-[#efede7] dark:bg-[#292821]" />
        <div className="space-y-5 py-5">
          <div className="h-3 w-24 animate-pulse bg-[#e9e6df] dark:bg-[#343129]" />
          <div className="h-10 w-3/4 animate-pulse bg-[#e9e6df] dark:bg-[#343129]" />
          <div className="h-5 w-28 animate-pulse bg-[#e9e6df] dark:bg-[#343129]" />
          <div className="h-20 w-full animate-pulse bg-[#efede7] dark:bg-[#292821]" />
          <span className="sr-only">{t.loadingProducts}</span>
        </div>
      </div>
    );
  }

  const product = getBySlug(slug);
  if (!product) return <NotFoundContent />;

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={getRelated(product)}
    />
  );
}
