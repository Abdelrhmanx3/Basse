"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LangContext";
import { useProducts } from "../context/ProductsContext";
import { formatPrice } from "../utils/formatPrice";
import { Icon } from "./Icon";

export function CartItemRow({ lineId }: { lineId: string }) {
  const { items, removeItem, updateQuantity } = useCart();
  const { language, t } = useLanguage();
  const { products } = useProducts();
  const item = items.find((entry) => entry.lineId === lineId);
  if (!item) return null;

  const product = products.find((entry) => entry.id === item.productId);
  if (!product) return null;

  return (
    <article className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 border-b border-[#e9e6df] dark:border-[#403d35] py-5 sm:grid-cols-[6rem_minmax(0,1fr)]">
      <Link
        aria-label={product.name[language]}
        className="relative aspect-[4/5] overflow-hidden rounded bg-[#f1efe9] dark:bg-[#292821] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
        href={`/products/${product.slug}`}
        prefetch={false}
      >
        <Image
          alt={`${product.name[language]} — ${item.color.name[language]}`}
          className="object-cover"
          fill
          sizes="96px"
          src={item.color.images[0]}
        />
      </Link>
      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              className="line-clamp-2 text-sm font-medium leading-5 hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
              href={`/products/${product.slug}`}
              prefetch={false}
            >
              {product.name[language]}
            </Link>
            <p className="mt-1 text-xs leading-5 text-[#6b6963] dark:text-[#c1bbaf]">
              {t.size}: {item.size} <span aria-hidden="true">·</span>{" "}
              {t.color}: {item.color.name[language]}
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium tabular-nums">
            {formatPrice(product.price * item.quantity, language)}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div
            aria-label={t.quantity}
            className="flex h-10 items-center border border-[#dcd8cf] dark:border-[#403d35]"
            role="group"
          >
            <button
              aria-label={t.decreaseQuantity}
              className="grid size-10 place-items-center text-[#5d5a53] hover:bg-[#f3f1ec] dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#a16207]"
              disabled={item.quantity <= 1}
              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
              type="button"
            >
              <Icon className="size-4" name="minus" />
            </button>
            <span className="min-w-8 text-center text-xs tabular-nums" aria-live="polite">
              {item.quantity}
            </span>
            <button
              aria-label={t.increaseQuantity}
              className="grid size-10 place-items-center text-[#5d5a53] hover:bg-[#f3f1ec] dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#a16207]"
              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
              type="button"
            >
              <Icon className="size-4" name="plus" />
            </button>
          </div>
          <button
            aria-label={`${t.remove}: ${product.name[language]}`}
            className="inline-flex min-h-11 items-center gap-1 rounded px-2 text-xs text-[#68645d] dark:text-[#c1bbaf] transition-colors hover:bg-[#f2efea] dark:hover:bg-[#343129] hover:text-[#811f1b] dark:hover:text-[#ffc7c0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
            onClick={() => removeItem(item.lineId)}
            type="button"
          >
            <Icon className="size-4" name="trash" />
            <span>{t.remove}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
