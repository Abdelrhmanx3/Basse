"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "../data/productTypes";
import { useLanguage } from "../context/LangContext";
import { useWishlist } from "../context/CartContext";
import { getDiscountPercentage, formatPrice } from "../utils/formatPrice";
import { Icon } from "./Icon";

export function ProductCard({
  product,
  eager = false,
}: {
  product: Product;
  eager?: boolean;
}) {
  const { language, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useWishlist();
  const discount = getDiscountPercentage(product.oldPrice, product.price);
  const favorite = isFavorite(product.id);
  const color = product.colors[0];
  const image = color?.images[0];

  return (
    <article className="group min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#efede7] dark:bg-[#292821]">
        <Link
          aria-label={`${t.products}: ${product.name[language]}`}
          className="absolute inset-0 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#a16207]"
          href={`/products/${product.slug}`}
          prefetch={false}
        >
          {image && (
            <Image
              alt={`${product.name[language]}${color ? ` — ${color.name[language]}` : ""}`}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
              fill
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 23vw"
              src={image}
            />
          )}
        </Link>
        <div className="pointer-events-none absolute start-3 top-3 z-[1] flex flex-col items-start gap-1.5">
          {product.isNew && (
            <span className="rounded-sm bg-[#faf9f6] dark:bg-[#171714] px-2.5 py-1 text-[10px] font-medium tracking-wide text-[#34312b] dark:text-[#f3f0e9]">
              {t.new}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-sm bg-[#24231f] dark:bg-[#343129] px-2.5 py-1 text-[10px] font-medium text-white">
              {discount}% {t.sale}
            </span>
          )}
        </div>
        <button
          aria-label={`${favorite ? t.removeFromWishlist : t.addToWishlist}: ${product.name[language]}`}
          aria-pressed={favorite}
          className="absolute end-3 top-3 z-[2] grid size-11 place-items-center rounded-full bg-[#faf9f6] dark:bg-[#171714]/95 text-[#282621] dark:text-[#f3f0e9] shadow-sm transition-colors hover:bg-white dark:hover:bg-[#343129] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
          onClick={() => toggleFavorite(product.id)}
          type="button"
        >
          <Icon
            className={`size-[19px] ${favorite ? "fill-[#a16207] text-[#a16207] dark:text-[#d8b576]" : ""}`}
            name="heart"
          />
        </button>
        <Link
          className="absolute inset-x-3 bottom-3 z-[1] flex min-h-11 translate-y-2 items-center justify-center rounded-sm bg-[#faf9f6] dark:bg-[#171714]/95 px-3 text-xs font-medium text-[#26241f] dark:text-[#f3f0e9] opacity-0 shadow-sm transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] max-sm:translate-y-0 max-sm:opacity-100"
          href={`/products/${product.slug}`}
          prefetch={false}
        >
          {t.shopNow}
          <Icon className="ms-2 size-4 rtl:rotate-180" name="arrow" />
        </Link>
      </div>
      <div className="pt-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              className="line-clamp-1 text-[13px] font-medium leading-5 hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207] sm:text-sm"
              href={`/products/${product.slug}`}
              prefetch={false}
            >
              {product.name[language]}
            </Link>
            <div className="mt-1.5 flex items-center gap-1.5">
              {product.colors.slice(0, 4).map((swatch) => (
                <span
                  aria-label={swatch.name[language]}
                  className="size-3 rounded-full border border-black/15 dark:border-white/25"
                  key={swatch.hex}
                  role="img"
                  style={{ backgroundColor: swatch.hex }}
                  title={swatch.name[language]}
                />
              ))}
              <span className="text-[10px] text-[#6b675f] dark:text-[#c1bbaf]">
                {product.rating.toFixed(1)} <span aria-hidden="true">★</span>
              </span>
            </div>
          </div>
          <div className="shrink-0 text-end text-[12px] leading-5 tabular-nums sm:text-[13px]">
            <span className="font-medium">{formatPrice(product.price, language)}</span>
            {product.oldPrice && (
              <span className="ms-1.5 text-[10px] text-[#6b675f] dark:text-[#c1bbaf] line-through">
                {formatPrice(product.oldPrice, language)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
