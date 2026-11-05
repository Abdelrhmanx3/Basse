import type { Metadata } from "next";
import { CheckoutContent } from "@/src/components/CheckoutContent";
import { siteConfig } from "@/src/data/siteConfig.js";
import { translations } from "@/src/i18n/translations.js";
import { getServerLanguage } from "@/src/utils/getServerLanguage";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const t = translations[language];
  return {
    title: `${t.checkout} | ${siteConfig.storeName[language]}`,
    description: t.checkoutTitle,
    robots: { index: false, follow: false },
  };
}

export default function CheckoutPage() {
  return <CheckoutContent />;
}
