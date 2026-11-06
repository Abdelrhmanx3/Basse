"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LangContext";
import type { Product, ProductColor } from "../data/productTypes";
import { formatPrice, getDiscountPercentage } from "../utils/formatPrice";
import { ColorSwatch } from "./ColorSwatch";
import { Icon } from "./Icon";
import { ProductCard } from "./ProductCard";
import { SizeSelector } from "./SizeSelector";

export function ProductDetailsClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const sizeGroupRef = useRef<HTMLDivElement>(null);
  const colorGroupRef = useRef<HTMLDivElement>(null);
  const activeColor = selectedColor ?? product.colors[0];
  const availableSizes = activeColor?.sizes ?? product.sizes;
  const image = activeColor?.images[selectedImage] ?? activeColor?.images[0];
  const discount = getDiscountPercentage(product.oldPrice, product.price);

  const selectColor = (color: ProductColor) => {
    setSelectedColor(color);
    if (
      selectedSize &&
      !(color.sizes ?? product.sizes).includes(selectedSize)
    ) {
      setSelectedSize(null);
    }
    setSelectedImage(0);
  };

  const handleAddToCart = () => {
    setValidationAttempted(true);
    if (!selectedSize || !selectedColor) {
      if (!selectedSize) sizeGroupRef.current?.querySelector("button")?.focus();
      else colorGroupRef.current?.querySelector("button")?.focus();
      return;
    }
    addItem(product, selectedSize, selectedColor, quantity);
  };

  return (
    <>
      <div className="mx-auto grid w-full max-w-[1380px] gap-8 px-5 py-7 sm:px-8 sm:py-10 lg:grid-cols-2 lg:gap-14 lg:px-10">
        <div className="min-w-0">
          <div className="relative aspect-[4/4.8] overflow-hidden bg-[#efede7] dark:bg-[#292821]">
            {image && (
              <Image
                alt={`${product.name[language]}${activeColor ? ` — ${activeColor.name[language]}` : ""}`}
                className="object-cover"
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 52vw"
                src={image}
              />
            )}
            {discount > 0 && (
              <span className="absolute start-4 top-4 rounded-sm bg-[#24231f] dark:bg-[#343129] px-3 py-1.5 text-xs font-medium text-white">
                {discount}% {t.sale}
              </span>
            )}
          </div>
          <div aria-label={t.productDetails} className="mt-3 grid grid-cols-4 gap-3" role="group">
            {(activeColor?.images ?? []).map((thumbnail, index) => (
              <button
                aria-label={`${t.productDetails} ${index + 1}`}
                aria-pressed={selectedImage === index}
                className={`relative aspect-square overflow-hidden bg-[#efede7] dark:bg-[#292821] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207] ${selectedImage === index ? "ring-1 ring-inset ring-[#24231f] dark:ring-[#f3f0e9]" : ""}`}
                key={thumbnail}
                onClick={() => setSelectedImage(index)}
                type="button"
              >
                <Image
                  alt=""
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 22vw, 120px"
                  src={thumbnail}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:py-5">
          <nav aria-label={language === "ar" ? "مسار التنقل" : "Breadcrumb"} className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#716d65] dark:text-[#c1bbaf]">
            <Link className="min-h-8 content-center hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]" href="/">
              {t.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link className="min-h-8 content-center hover:text-[#76511e] dark:hover:text-[#e8c98e] focus-visible:outline-2 focus-visible:outline-[#a16207]" href={`/products?category=${product.category}`}>
              {t.products}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#33312c] dark:text-[#f3f0e9]">{product.name[language]}</span>
          </nav>

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#777168] dark:text-[#c1bbaf]">
                {product.isNew ? t.new : t.featuredPicks}
              </p>
              <h1 className="mt-2 text-3xl font-medium leading-tight tracking-[-0.05em] text-[#201f1c] dark:text-[#f3f0e9] sm:text-4xl">
                {product.name[language]}
              </h1>
            </div>
            <p
              aria-label={t.rating.replace("{rating}", product.rating.toFixed(1))}
              className="mt-1 inline-flex shrink-0 items-center gap-1 text-xs text-[#625d53] dark:text-[#c1bbaf]"
            >
              <span aria-hidden="true" className="text-[#997437] dark:text-[#d8b576]">★</span>
              {product.rating.toFixed(1)}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-lg font-medium tabular-nums">{formatPrice(product.price, language)}</p>
            {product.oldPrice && (
              <>
                <p className="text-sm text-[#777168] dark:text-[#c1bbaf] line-through">
                  {formatPrice(product.oldPrice, language)}
                </p>
                <p className="text-xs font-medium text-[#76511e] dark:text-[#d8b576]">
                  {discount}% {t.sale}
                </p>
              </>
            )}
          </div>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#656158] dark:text-[#c1bbaf]">
            {product.description[language]}
          </p>

          <div className="mt-8 border-t border-[#e9e6df] dark:border-[#403d35] pt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">
                {t.selectColor}
                {selectedColor && (
                  <span className="ms-2 font-normal text-[#6b675f] dark:text-[#c1bbaf]">
                    — {selectedColor.name[language]}
                  </span>
                )}
              </p>
              <span className="text-xs text-[#78746b] dark:text-[#c1bbaf]">{product.colors.length}</span>
            </div>
            <div
              aria-label={t.selectColor}
              aria-describedby={validationAttempted && !selectedColor ? "color-error" : undefined}
              className="mt-2 flex flex-wrap gap-1"
              ref={colorGroupRef}
              role="group"
            >
              {product.colors.map((color) => (
                <ColorSwatch
                  color={color}
                  key={color.hex}
                  language={language}
                  onSelect={() => selectColor(color)}
                  selected={selectedColor?.hex === color.hex}
                />
              ))}
            </div>
            {validationAttempted && !selectedColor && (
              <p className="mt-1 text-xs text-[#a22c25] dark:text-[#f3b1a7]" id="color-error">
                {t.colorRequired}
              </p>
            )}
          </div>

          <div className="mt-5 border-t border-[#e9e6df] dark:border-[#403d35] pt-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{t.selectSize}</p>
              <span className="text-xs text-[#777168] dark:text-[#c1bbaf]">{t.sizeGuide}</span>
            </div>
            <div
              aria-describedby={validationAttempted && !selectedSize ? "size-error" : undefined}
              ref={sizeGroupRef}
            >
              <SizeSelector
                language={language}
                onSelect={setSelectedSize}
                selectedSize={selectedSize}
                sizes={availableSizes}
              />
            </div>
            {validationAttempted && !selectedSize && (
              <p className="mt-2 text-xs text-[#a22c25] dark:text-[#f3b1a7]" id="size-error">
                {t.sizeRequired}
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center border border-[#dcd8cf] dark:border-[#403d35]" role="group" aria-label={t.quantity}>
              <button
                aria-label={t.decreaseQuantity}
                className="grid size-11 place-items-center disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#a16207]"
                disabled={quantity <= 1}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                type="button"
              >
                <Icon className="size-4" name="minus" />
              </button>
              <span aria-live="polite" className="min-w-8 text-center text-sm tabular-nums">
                {quantity}
              </span>
              <button
                aria-label={t.increaseQuantity}
                className="grid size-11 place-items-center focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#a16207]"
                onClick={() => setQuantity((current) => current + 1)}
                type="button"
              >
                <Icon className="size-4" name="plus" />
              </button>
            </div>
            <button
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded bg-[#24231f] dark:bg-[#343129] px-5 text-sm font-medium text-white transition-colors hover:bg-[#76511e] dark:hover:bg-[#5a482d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a16207]"
              onClick={handleAddToCart}
              type="button"
            >
              <Icon className="size-[18px]" name="bag" />
              {t.addToCart}
            </button>
          </div>

          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#777168] dark:text-[#c1bbaf]">
            <Icon className="mt-0.5 size-4 shrink-0 text-[#80643a] dark:text-[#d8b576]" name="whatsapp" />
            {t.whatsappDescription}
          </p>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mx-auto w-full max-w-[1380px] border-t border-[#e9e6df] dark:border-[#403d35] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
          <h2 className="mb-6 text-2xl font-medium tracking-[-0.04em]">{t.relatedProducts}</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
