"use client";

import type { Language } from "../context/LangContext";
import { translations } from "../i18n/translations.js";

export function ProductGridSkeleton({
  count = 4,
  language,
}: {
  count?: number;
  language: Language;
}) {
  const t = translations[language];

  return (
    <div
      aria-busy="true"
      aria-label={t.loadingProducts}
      className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6"
      role="status"
    >
      {Array.from({ length: count }, (_, index) => (
        <div className="min-w-0 animate-pulse" key={index}>
          <div className="aspect-[4/5] bg-[#efede7] dark:bg-[#292821]" />
          <div className="mt-4 h-4 w-3/4 bg-[#e9e6df] dark:bg-[#343129]" />
          <div className="mt-2 h-3 w-1/3 bg-[#e9e6df] dark:bg-[#343129]" />
        </div>
      ))}
      <span className="sr-only">{t.loadingProducts}</span>
    </div>
  );
}

export function ProductLoadError({
  language,
  onRetry,
}: {
  language: Language;
  onRetry: () => void;
}) {
  const t = translations[language];

  return (
    <div
      aria-live="polite"
      className="flex min-h-44 flex-col items-center justify-center gap-4 rounded border border-[#e3c9c5] bg-[#fff8f6] px-5 py-8 text-center dark:border-[#613b35] dark:bg-[#3b2420]"
      role="alert"
    >
      <p className="max-w-md text-sm leading-6 text-[#8b2f26] dark:text-[#f3b1a7]">
        {t.productsLoadError}
      </p>
      <button
        className="inline-flex min-h-11 items-center justify-center rounded border border-[#b7776e] px-4 text-sm font-medium text-[#71251e] transition-colors hover:bg-[#f4e3df] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] dark:border-[#b7776e] dark:text-[#ffd0c9] dark:hover:bg-[#512e29]"
        onClick={onRetry}
        type="button"
      >
        {t.retry}
      </button>
    </div>
  );
}
