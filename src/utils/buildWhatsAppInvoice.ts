import { siteConfig } from "../data/siteConfig.js";
import type { Product } from "../data/productTypes";
import type { CartLine } from "../context/CartContext";
import type { Language } from "../context/LangContext";
import { formatPrice, getShippingFee, getSubtotal } from "./formatPrice";
import { governorates, translations } from "../i18n/translations.js";

type InvoiceCustomer = {
  fullName: string;
  phone1: string;
  phone2: string;
  governorate: string;
  city: string;
  address: string;
  notes: string;
};

export function buildWhatsAppInvoice(
  items: CartLine[],
  customer: InvoiceCustomer,
  language: Language,
  products: Product[],
) {
  const t = translations[language];
  const subtotal = getSubtotal(items, products);
  const shipping = getShippingFee(subtotal, customer.governorate);
  const governorateIndex = governorates.en.indexOf(customer.governorate);
  const governorateName =
    governorateIndex >= 0
      ? governorates[language][governorateIndex]
      : customer.governorate;
  const orderNumber = `BASEE-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const date = new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-EG", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());
  const lines = [
    `${siteConfig.storeName[language]} — ${t.orderNumber}: ${orderNumber}`,
    `${t.orderDate}: ${date}`,
    "",
    `${t.customer}: ${customer.fullName}`,
    `${t.phone1}: ${customer.phone1}`,
    `${t.phone2}: ${customer.phone2}`,
    `${t.location}: ${governorateName}, ${customer.city}, ${customer.address}`,
    "",
    ...items.flatMap((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return [];
      const lineTotal = product.price * item.quantity;

      return [
        `${t.item}: ${product.name[language]}`,
        `  ${t.size}: ${item.size} | ${t.color}: ${item.color.name[language]}`,
        `  ${t.quantity}: ${item.quantity} ${t.quantityUnit} × ${formatPrice(product.price, language)}`,
        `  ${t.lineTotal}: ${formatPrice(lineTotal, language)}`,
        "",
      ];
    }),
    `${t.subtotal}: ${formatPrice(subtotal, language)}`,
    `${t.shipping}: ${shipping === 0 ? t.free : formatPrice(shipping, language)}`,
    `${t.total}: ${formatPrice(subtotal + shipping, language)}`,
  ];

  if (customer.notes.trim()) {
    lines.push("", `${t.notesInvoice}: ${customer.notes.trim()}`);
  }

  return { message: lines.join("\n"), orderNumber };
}
