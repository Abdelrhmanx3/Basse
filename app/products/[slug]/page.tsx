import type { Metadata } from "next";
import { siteConfig } from "@/src/data/siteConfig.js";
import { getServerLanguage } from "@/src/utils/getServerLanguage";
import { translations } from "@/src/i18n/translations.js";
import { ProductPageContent } from "@/src/components/ProductPageContent";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [, language] = await Promise.all([params, getServerLanguage()]);
  const title = `${translations[language].products} | ${siteConfig.storeName[language]}`;

  return {
    title,
    description: translations[language].heroDescription,
    openGraph: {
      title,
      locale: language === "ar" ? "ar_EG" : "en_EG",
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  return <ProductPageContent slug={slug} />;
}
