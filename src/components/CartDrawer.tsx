"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LangContext";
import { useProducts } from "../context/ProductsContext";
import { siteConfig } from "../data/siteConfig.js";
import { formatPrice, getShippingFee, getSubtotal } from "../utils/formatPrice";
import { CartItemRow } from "./CartItemRow";
import { Icon } from "./Icon";
import { ProductLoadError } from "./ProductsStates";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { items, itemCount } = useCart();
  const { language, t } = useLanguage();
  const { products, loading, error, retry } = useProducts();
  const subtotal = getSubtotal(items, products);
  const shipping = getShippingFee(subtotal);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      aria-label={t.cartTitle}
      className="fixed inset-0 m-0 h-dvh max-h-dvh w-full max-w-full overscroll-contain overflow-hidden border-0 bg-transparent p-0 text-start text-[#201f1c] dark:text-[#f3f0e9] backdrop:bg-black/45 backdrop:backdrop-blur-[2px] open:flex open:justify-end"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      ref={dialogRef}
    >
      <section
        aria-labelledby="cart-drawer-title"
        className="flex h-full w-full max-w-md flex-col overscroll-contain bg-[#faf9f6] dark:bg-[#171714] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#e9e6df] dark:border-[#403d35] px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-lg font-medium tracking-tight" id="cart-drawer-title">
              {t.cartTitle}
            </h2>
            <p className="mt-0.5 text-xs text-[#716e67] dark:text-[#c1bbaf]">
              {itemCount} {t.results}
            </p>
          </div>
          <button
            aria-label={t.closeCart}
            className="grid size-11 place-items-center rounded-full transition-colors hover:bg-[#efede7] dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
            onClick={onClose}
            type="button"
          >
            <Icon name="close" />
          </button>
        </div>

        {error ? (
          <div className="flex flex-1 items-center px-5 py-8 sm:px-7">
            <ProductLoadError language={language} onRetry={retry} />
          </div>
        ) : loading ? (
          <div aria-busy="true" className="flex-1 animate-pulse px-5 py-8 sm:px-7" role="status">
            <div className="h-24 bg-[#efede7] dark:bg-[#292821]" />
            <div className="mt-4 h-24 bg-[#efede7] dark:bg-[#292821]" />
          </div>
        ) : items.length ? (
          <>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-7">
              {items.map((item) => (
                <CartItemRow key={item.lineId} lineId={item.lineId} />
              ))}
              {subtotal < siteConfig.freeShippingThreshold && (
                <p className="py-4 text-xs leading-5 text-[#625e57] dark:text-[#c1bbaf]">
                  {t.freeShippingRemaining.replace(
                    "{amount}",
                    formatPrice(siteConfig.freeShippingThreshold - subtotal, language),
                  )}
                </p>
              )}
            </div>
            <div className="border-t border-[#e9e6df] dark:border-[#403d35] bg-white dark:bg-[#201f1b] px-5 py-5 sm:px-7">
              <div className="flex justify-between py-1.5 text-sm">
                <span className="text-[#68645d] dark:text-[#c1bbaf]">{t.subtotal}</span>
                <span className="font-medium tabular-nums">{formatPrice(subtotal, language)}</span>
              </div>
              <div className="flex justify-between py-1.5 text-sm">
                <span className="text-[#68645d] dark:text-[#c1bbaf]">{t.shipping}</span>
                <span>{shipping === 0 ? t.free : formatPrice(shipping, language)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-[#ece9e3] dark:border-[#403d35] pt-3 text-base font-semibold">
                <span>{t.total}</span>
                <span className="tabular-nums">{formatPrice(subtotal + shipping, language)}</span>
              </div>
              <div className="mt-4 grid gap-2">
                <Link
                  className="flex min-h-12 items-center justify-center gap-2 rounded bg-[#24231f] dark:bg-[#343129] px-5 text-sm font-medium text-white transition-colors hover:bg-[#76511e] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
                  href="/checkout"
                  onClick={onClose}
                >
                  {t.checkout}
                  <Icon className="size-4 rtl:rotate-180" name="arrow" />
                </Link>
                <Link
                  className="flex min-h-11 items-center justify-center rounded border border-[#dcd8cf] dark:border-[#403d35] px-5 text-xs font-medium transition-colors hover:bg-[#f1efe9] dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
                  href="/cart"
                  onClick={onClose}
                >
                  {t.cartTitle}
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-[#efede7] dark:bg-[#292821] text-[#716b60] dark:text-[#c1bbaf]">
              <Icon className="size-7" name="bag" />
            </span>
            <h3 className="mt-5 text-lg font-medium">{t.cartEmpty}</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-[#69665e] dark:text-[#c1bbaf]">{t.cartEmptyHint}</p>
            <Link
              className="mt-6 inline-flex min-h-12 items-center rounded bg-[#24231f] dark:bg-[#343129] px-5 text-sm font-medium text-white transition-colors hover:bg-[#76511e] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
              href="/products"
              onClick={onClose}
            >
              {t.continueShopping}
            </Link>
          </div>
        )}
      </section>
    </dialog>
  );
}
