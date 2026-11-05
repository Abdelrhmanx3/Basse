import { siteConfig } from "../data/siteConfig.js";
import type { Product } from "../data/productTypes";
import type { CartLine } from "../context/CartContext";
import type { Language } from "../context/LangContext";

export function formatPrice(amount: number, language: Language) {
  const formatted = new Intl.NumberFormat(language === "ar" ? "ar-EG" : "en-EG", {
    maximumFractionDigits: 0,
  }).format(amount);

  return `${formatted} ${siteConfig.currency[language]}`;
}

export function getDiscountPercentage(oldPrice: number | null, price: number) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function getSubtotal(items: CartLine[], products: Product[]) {
  return items.reduce((subtotal, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    return subtotal + (product?.price ?? 0) * item.quantity;
  }, 0);
}

export function getShippingFee(subtotal: number, governorate?: string) {
  if (subtotal === 0 || subtotal >= siteConfig.freeShippingThreshold) return 0;
  const governorateFee = governorate
    ? siteConfig.governorateFees[governorate]
    : undefined;
  return governorateFee ?? siteConfig.shippingFee;
}
