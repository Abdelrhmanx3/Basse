const slugPattern = /[^\p{L}\p{N}]+/gu;

function dataUrl(path) {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
  return `${basePath}/data/${path}`;
}

function asLocalizedText(value, fallback = "") {
  if (typeof value === "string") {
    return { ar: value || fallback, en: value || fallback };
  }

  if (!value || typeof value !== "object") {
    return { ar: fallback, en: fallback };
  }

  const arabic = typeof value.ar === "string" ? value.ar : fallback;
  const english = typeof value.en === "string" ? value.en : fallback;
  return { ar: arabic, en: english };
}

function toPublicImagePath(image) {
  if (typeof image !== "string" || !image.trim()) return "";
  if (/^(?:https?:)?\/\//i.test(image)) return image;

  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
  const path = image.replace(/^public[\\/]/i, "").replace(/\\/g, "/");
  const publicPath = path.startsWith("/")
    ? path
    : path.startsWith("data/")
      ? `/${path}`
      : `/data/${path}`;
  return encodeURI(`${basePath}${publicPath}`);
}

function slugFromName(name) {
  return (name.en || name.ar)
    .normalize("NFKD")
    .toLowerCase()
    .replace(slugPattern, "-")
    .replace(/^-|-$/g, "");
}

function mapColor(color) {
  if (!color || typeof color !== "object") return null;

  const name = asLocalizedText(color.name);
  if (!name.en && !name.ar) return null;

  const images = Array.isArray(color.images)
    ? color.images.map(toPublicImagePath).filter(Boolean)
    : [];

  return {
    name,
    hex: typeof color.hex === "string" ? color.hex : "#808080",
    images,
  };
}

function mapProduct(value) {
  if (!value || typeof value !== "object") return null;

  const name = asLocalizedText(value.name);
  const id = typeof value.id === "string" ? value.id : "";
  const slug =
    typeof value.slug === "string" && value.slug.trim()
      ? value.slug
      : slugFromName(name);
  const price = Number(value.price);

  if (!id || (!name.en && !name.ar) || !slug || !Number.isFinite(price) || price < 0) {
    return null;
  }

  const colors = Array.isArray(value.colors)
    ? value.colors.map(mapColor).filter(Boolean)
    : [];
  const sizes = Array.isArray(value.sizes)
    ? value.sizes.filter((size) => typeof size === "string")
    : [];

  return {
    id,
    slug,
    name,
    description: asLocalizedText(value.description),
    category:
      typeof value.category === "string" && value.category
        ? value.category
        : "uncategorized",
    price,
    oldPrice:
      typeof value.oldPrice === "number" && Number.isFinite(value.oldPrice)
        ? value.oldPrice
        : null,
    sizes,
    colors,
    featured: value.featured === true,
    isNew: value.isNew === true,
    rating:
      typeof value.rating === "number" && Number.isFinite(value.rating)
        ? value.rating
        : 0,
  };
}

function normalizeCatalog(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.products)) {
    throw new Error("The product data file must contain a products array.");
  }

  const products = value.products.flatMap((entry, index) => {
    const product = mapProduct(entry, index);
    if (product) return [product];

    if (process.env.NODE_ENV !== "production") {
      console.warn(`Skipping invalid product at index ${index}.`, entry);
    }
    return [];
  });

  const categories = Array.isArray(value.categories)
    ? value.categories.flatMap((category, index) => {
        if (
          !category ||
          typeof category.id !== "string" ||
          !category.id ||
          (!category.name?.ar && !category.name?.en)
        ) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`Skipping invalid category at index ${index}.`, category);
          }
          return [];
        }
        return [{ id: category.id, name: asLocalizedText(category.name) }];
      })
    : [];

  return { products, categories };
}

let catalogPromise;

export function clearProductDataCache() {
  catalogPromise = undefined;
}

export function loadProductCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch(dataUrl("products.json"), { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load products (${response.status}).`);
        }
        return response.json();
      })
      .then(normalizeCatalog)
      .catch((error) => {
        catalogPromise = undefined;
        throw error;
      });
  }

  return catalogPromise;
}
