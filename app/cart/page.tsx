import type { Metadata } from "next";
import { CartPageContent } from "@/src/components/CartPageContent";
import { siteConfig } from "@/src/data/siteConfig.js";
import { translations } from "@/src/i18n/translations.js";
import { getServerLanguage } from "@/src/utils/getServerLanguage";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const t = translations[language];
  return {
    title: `${t.cart} | ${siteConfig.storeName[language]}`,
    description: t.cartEmptyHint,
    robots: { index: false, follow: true },
  };
}

export default function CartPage() {
  return <CartPageContent />;
}
