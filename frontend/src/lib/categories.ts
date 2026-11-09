export const CATEGORY_SLUGS = [
  "new-in",
  "dresses",
  "tops",
  "outerwear",
  "pants",
  "shoes",
  "bags",
  "accessories"
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  "new-in": "New In",
  dresses: "Dresses",
  tops: "Tops",
  outerwear: "Outerwear",
  pants: "Pants",
  shoes: "Shoes",
  bags: "Bags",
  accessories: "Accessories"
};

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value);
}

export function categoryHref(slug: CategorySlug): string {
  return `/shop/${slug}`;
}
