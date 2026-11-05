export type LocalizedText = {
  ar: string;
  en: string;
};

export type ProductColor = {
  name: LocalizedText;
  hex: string;
  images: string[];
};

export type Product = {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  category: string;
  price: number;
  oldPrice: number | null;
  sizes: string[];
  colors: ProductColor[];
  featured: boolean;
  isNew: boolean;
  rating: number;
};

export type ProductCategory = {
  id: string;
  name: LocalizedText;
};

export type ProductCatalog = {
  products: Product[];
  categories: ProductCategory[];
};
