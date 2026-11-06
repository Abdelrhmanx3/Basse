import type { Metadata } from "next";
import { translations } from "@/src/i18n/translations.js";
import { getServerLanguage } from "@/src/utils/getServerLanguage";
import { ProductsExplorer } from "@/src/components/ProductsExplorer";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type SortOption = "featured" | "price-ascending" | "price-descending" | "newest";

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const t = translations[language];
  const title = `${t.products} | ${language === "ar" ? "بيسي" : "BASSE"}`;

  return {
    title,
    description: t.heroDescription,
    openGraph: {
      title,
      description: t.heroDescription,
      locale: language === "ar" ? "ar_EG" : "en_EG",
      type: "website",
    },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const category = firstValue(params.category) ?? "";
  const sortValue = firstValue(params.sort);
  const validSorts: SortOption[] = [
    "featured",
    "price-ascending",
    "price-descending",
    "newest",
  ];
  const sort = validSorts.find((option) => option === sortValue) ?? "featured";
  const maxPriceValue = Number(firstValue(params.maxPrice));
  const maxPrice =
    Number.isFinite(maxPriceValue) && maxPriceValue >= 300 && maxPriceValue <= 2500
      ? maxPriceValue
      : 2500;

  return (
    <ProductsExplorer
      initialCategory={category}
      initialFavorites={firstValue(params.favorites) === "1"}
      initialMaxPrice={maxPrice}
      initialSearch={firstValue(params.search) ?? ""}
      initialSize={firstValue(params.size) ?? ""}
      initialSort={sort}
    />
  );
}
