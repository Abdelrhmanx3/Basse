"use client";

import { siteConfig } from "../data/siteConfig.js";
import type { CartLine } from "../context/CartContext";
import { useLanguage } from "../context/LangContext";
import { useProducts } from "../context/ProductsContext";
import { formatPrice, getSubtotal } from "../utils/formatPrice";

export function OrderSummary({ items }: { items: CartLine[] }) {
  const { language, t } = useLanguage();
  const { products } = useProducts();
  const subtotal = getSubtotal(items, products);

  return (
    <section className="border border-[#e8e4dc] dark:border-[#403d35] bg-white dark:bg-[#201f1b] p-5 sm:p-6">
      <h2 className="text-lg font-medium tracking-[-0.03em]">{t.orderSummary}</h2>
      <dl className="mt-4 space-y-3 border-b border-[#e9e6df] dark:border-[#403d35] pb-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#68645d] dark:text-[#c1bbaf]">{t.subtotal}</dt>
          <dd className="m-0 font-medium tabular-nums">{formatPrice(subtotal, language)}</dd>
        </div>
      </dl>
      {subtotal > 0 && subtotal < siteConfig.freeShippingThreshold && (
        <p className="mt-3 text-xs leading-5 text-[#6d685f] dark:text-[#c1bbaf]">
          {t.freeShippingRemaining.replace(
            "{amount}",
            formatPrice(siteConfig.freeShippingThreshold - subtotal, language),
          )}
        </p>
      )}
      {subtotal >= siteConfig.freeShippingThreshold && (
        <p className="mt-3 text-xs leading-5 text-[#286345] dark:text-[#9bd2ae]">{t.freeShippingUnlocked}</p>
      )}
      <div className="mt-4 flex items-center justify-between gap-3 text-base font-semibold">
        <span>{t.total}</span>
        <span className="tabular-nums">{formatPrice(subtotal, language)}</span>
      </div>
    </section>
  );
}