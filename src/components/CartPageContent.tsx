"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LangContext";
import { useProducts } from "../context/ProductsContext";
import { CartItemRow } from "./CartItemRow";
import { OrderSummary } from "./OrderSummary";
import { ProductLoadError } from "./ProductsStates";

export function CartPageContent() {
  const { items, isHydrated } = useCart();
  const { language, t } = useLanguage();
  const { error, retry } = useProducts();

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[1380px] px-5 py-12 sm:px-8 lg:px-10">
        <ProductLoadError language={language} onRetry={retry} />
      </div>
    );
  }

  if (!isHydrated) {
    return (
      <div aria-busy="true" className="mx-auto min-h-[60vh] w-full max-w-[1380px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="h-8 w-40 animate-pulse bg-[#e9e6df] dark:bg-[#343129]" />
        <div className="mt-8 h-28 animate-pulse bg-[#efede7] dark:bg-[#292821]" />
        <div className="mt-4 h-28 animate-pulse bg-[#efede7] dark:bg-[#292821]" />
        <span className="sr-only">{t.cart}</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-full max-w-[1380px] flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
        <div className="grid size-16 place-items-center rounded-full bg-[#efede7] dark:bg-[#292821] text-[#716b60] dark:text-[#c1bbaf]">
          <span aria-hidden="true" className="text-2xl">B</span>
        </div>
        <h1 className="mt-5 text-2xl font-medium tracking-[-0.04em]">{t.cartEmpty}</h1>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[#6b675f] dark:text-[#c1bbaf]">{t.cartEmptyHint}</p>
        <Link
          className="mt-6 inline-flex min-h-12 items-center rounded bg-[#24231f] dark:bg-[#343129] px-5 text-sm font-medium text-white transition-colors hover:bg-[#76511e] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
          href="/products"
        >
          {t.continueShopping}
        </Link>
      </section>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1380px] px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
      <div className="mb-8 border-b border-[#e9e6df] dark:border-[#403d35] pb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#777168] dark:text-[#c1bbaf]">{t.cart}</p>
        <h1 className="mt-2 text-3xl font-medium tracking-[-0.05em] sm:text-4xl">{t.cartTitle}</h1>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
        <div className="min-w-0">
          {items.map((item) => (
            <CartItemRow key={item.lineId} lineId={item.lineId} />
          ))}
          <Link
            className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-[#5f594f] dark:text-[#d3cec4] underline decoration-[#c4b28d] underline-offset-4 hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]"
            href="/products"
          >
            {t.continueShopping}
          </Link>
        </div>
        <div className="lg:sticky lg:top-28">
          <OrderSummary items={items} />
          <Link
            className="mt-4 flex min-h-12 items-center justify-center rounded bg-[#24231f] dark:bg-[#343129] px-5 text-sm font-medium text-white transition-colors hover:bg-[#76511e] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
            href="/checkout"
          >
            {t.checkout}
          </Link>
        </div>
      </div>
    </div>
  );
}
