export type ColorOption = {
  name: string;
  hex: string;
};

export const COLOR_OPTIONS: ColorOption[] = [
  { name: "Beige", hex: "#D6C3A6" },
  { name: "Onyx", hex: "#202020" },
  { name: "Sage", hex: "#8A9A7B" },
  { name: "Cream", hex: "#F2E8DC" },
  { name: "Terracotta", hex: "#B5654A" },
  { name: "Slate", hex: "#747B86" }
];

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"] as const;

export type ProductSize = (typeof SIZE_OPTIONS)[number];

export type StoreCategory = {
  slug: string;
  label: string;
  tagline: string;
  description: string;
};

export const CATEGORIES: StoreCategory[] = [
  {
    slug: "new-in",
    label: "New In",
    tagline: "Just landed",
    description:
      "The latest arrivals from our Nairobi atelier - fresh silhouettes, warm-weather layers, and pieces made for the season ahead."
  },
  {
    slug: "dresses",
    label: "Dresses",
    tagline: "Effortless movement",
    description:
      "Fluid midis, sculpted wraps, and occasion dresses cut for Nairobi evenings and coastal weekends."
  },
  {
    slug: "tops",
    label: "Tops",
    tagline: "Everyday foundations",
    description:
      "Silk blouses, ribbed knits, and linen shirts that layer beautifully from the office to the terrace."
  },
  {
    slug: "outerwear",
    label: "Outerwear",
    tagline: "Quiet structure",
    description:
      "Trenches, wool coats, and softly tailored blazers built for highland mornings and city nights."
  },
  {
    slug: "pants",
    label: "Pants",
    tagline: "Tailored ease",
    description:
      "Wide-leg trousers, clean tailoring, and comfortable cargo shapes finished with an easy drape."
  },
  {
    slug: "shoes",
    label: "Shoes",
    tagline: "Grounding details",
    description:
      "Hand-finished leather sandals, woven loafers, and polished heels made for long Nairobi days."
  },
  {
    slug: "bags",
    label: "Bags",
    tagline: "Carry the collection",
    description:
      "Leather totes, mini crossbodies, and woven clutches with honest hardware and everyday capacity."
  },
  {
    slug: "accessories",
    label: "Accessories",
    tagline: "Finishing touches",
    description:
      "Beaded necklaces, silk scarves, and gold-tone hoops that bring a considered finish to every look."
  }
];

export type StoreProduct = {
  id: string;
  name: string;
  categorySlug: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  description: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
};

const IMAGES = {
  trench: "/products/trench-coat.jpg",
  wool: "/products/wool-coat.jpg",
  blazer: "/products/oversized-blazer.jpg",
  knit: "/products/knit-sweater.jpg",
  skirt: "/products/pleated-skirt.jpg"
} as const;

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

export const PRODUCTS: StoreProduct[] = [
  {
    id: "nairobi-dawn-trench",
    name: "Nairobi Dawn Trench",
    categorySlug: "outerwear",
    category: "Outerwear",
    price: 18500,
    image: IMAGES.trench,
    badge: "New",
    description:
      "A double-breasted trench in brushed Kenyan cotton twill, finished with horn buttons and a removable belt.",
    colors: ["Beige", "Onyx", "Slate"],
    sizes: ALL_SIZES,
    isNew: true
  },
  {
    id: "maasai-beaded-blazer",
    name: "Maasai Beaded Blazer",
    categorySlug: "outerwear",
    category: "Outerwear",
    price: 14900,
    image: IMAGES.blazer,
    badge: "Atelier",
    description:
      "An oversized blazer with hand-beaded lapel detailing, crafted in small batches with Maasai artisans.",
    colors: ["Onyx", "Terracotta"],
    sizes: ["S", "M", "L", "XL"],
    isNew: true
  },
  {
    id: "kilimani-knit-set",
    name: "Kilimani Knit Set",
    categorySlug: "tops",
    category: "Tops",
    price: 8500,
    image: IMAGES.knit,
    badge: "New",
    description:
      "A soft ribbed knit set with a relaxed crew neck and matching wide sleeves for cool highland evenings.",
    colors: ["Cream", "Sage", "Beige"],
    sizes: ["XS", "S", "M", "L"],
    isNew: true
  },
  {
    id: "karen-pleated-midi",
    name: "Karen Pleated Midi Dress",
    categorySlug: "dresses",
    category: "Dresses",
    price: 9900,
    image: IMAGES.skirt,
    badge: "New",
    description:
      "A fluid pleated midi dress with a tie waist and softly structured shoulders, made for garden lunches.",
    colors: ["Sage", "Cream", "Terracotta"],
    sizes: ALL_SIZES,
    isNew: true
  },
  {
    id: "highlands-wool-coat",
    name: "Highlands Wool Coat",
    categorySlug: "outerwear",
    category: "Outerwear",
    price: 22500,
    image: IMAGES.wool,
    badge: "Limited",
    description:
      "A longline wool-blend coat with a clean lapel and deep pockets, cut for Limuru mist and city mornings.",
    colors: ["Beige", "Slate", "Onyx"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "aberdare-oversized-blazer",
    name: "Aberdare Oversized Blazer",
    categorySlug: "outerwear",
    category: "Outerwear",
    price: 15900,
    image: IMAGES.blazer,
    description:
      "A softly padded blazer with a longline shape and polished buttons, easy over dresses and denim.",
    colors: ["Onyx", "Beige"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "westlands-silk-blouse",
    name: "Westlands Silk Blouse",
    categorySlug: "tops",
    category: "Tops",
    price: 6500,
    image: IMAGES.knit,
    badge: "New",
    description:
      "A fluid silk blouse with a covered placket and French seams, finished with a soft drape at the cuff.",
    colors: ["Cream", "Beige", "Terracotta"],
    sizes: ALL_SIZES,
    isNew: true
  },
  {
    id: "savannah-ribbed-knit",
    name: "Savannah Ribbed Knit",
    categorySlug: "tops",
    category: "Tops",
    price: 4900,
    image: IMAGES.knit,
    description:
      "A fine-gauge ribbed knit with a slim fit and gently cropped hem - the quiet layer under everything.",
    colors: ["Sage", "Cream", "Onyx"],
    sizes: ALL_SIZES
  },
  {
    id: "lamu-linen-shirt",
    name: "Lamu Linen Shirt",
    categorySlug: "tops",
    category: "Tops",
    price: 5400,
    image: IMAGES.knit,
    description:
      "A breathable linen shirt with a relaxed camp collar, made for coastal weekends and warm afternoons.",
    colors: ["Cream", "Beige", "Sage"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "diani-sunset-slip",
    name: "Diani Sunset Slip Dress",
    categorySlug: "dresses",
    category: "Dresses",
    price: 7800,
    image: IMAGES.skirt,
    description:
      "A bias-cut slip dress with adjustable straps and a soft satin finish, made to move at golden hour.",
    colors: ["Terracotta", "Cream", "Onyx"],
    sizes: ALL_SIZES
  },
  {
    id: "nairobi-nights-wrap",
    name: "Nairobi Nights Wrap Dress",
    categorySlug: "dresses",
    category: "Dresses",
    price: 11200,
    image: IMAGES.trench,
    badge: "Editor's pick",
    description:
      "A sculpted wrap dress with a deep V neckline and fluid skirt, finished with a hand-polished clasp.",
    colors: ["Onyx", "Slate", "Beige"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "kilimani-tailored-trousers",
    name: "Kilimani Tailored Trousers",
    categorySlug: "pants",
    category: "Pants",
    price: 7900,
    image: IMAGES.blazer,
    description:
      "High-waisted trousers with a clean front crease and a soft taper, cut from a breathable wool blend.",
    colors: ["Onyx", "Beige", "Slate"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "rift-valley-wide-leg",
    name: "Rift Valley Wide-Leg Pants",
    categorySlug: "pants",
    category: "Pants",
    price: 8400,
    image: IMAGES.skirt,
    badge: "New",
    description:
      "A wide-leg trouser with a comfortable elastic back and fluid fall, made for long days on the move.",
    colors: ["Cream", "Sage", "Onyx"],
    sizes: ALL_SIZES,
    isNew: true
  },
  {
    id: "nairobi-cargo-pants",
    name: "Nairobi Cargo Pants",
    categorySlug: "pants",
    category: "Pants",
    price: 6200,
    image: IMAGES.wool,
    description:
      "Utility-inspired cargo pants with soft patch pockets and a relaxed leg, in a durable cotton twill.",
    colors: ["Beige", "Onyx", "Sage"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "maasai-leather-sandals",
    name: "Maasai Leather Sandals",
    categorySlug: "shoes",
    category: "Shoes",
    price: 5800,
    image: IMAGES.trench,
    badge: "Artisan",
    description:
      "Hand-beaded leather sandals made with Maasai artisans, with a cushioned footbed for all-day wear.",
    colors: ["Beige", "Terracotta", "Onyx"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "karen-pointed-heels",
    name: "Karen Pointed Heels",
    categorySlug: "shoes",
    category: "Shoes",
    price: 9500,
    image: IMAGES.blazer,
    description:
      "A sculpted pointed heel in soft leather with a low block heel - polished enough for evening.",
    colors: ["Onyx", "Beige"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "diani-woven-loafers",
    name: "Diani Woven Loafers",
    categorySlug: "shoes",
    category: "Shoes",
    price: 8200,
    image: IMAGES.wool,
    badge: "New",
    description:
      "Woven leather loafers with a flexible sole and breathable lining, made for warm-weather tailoring.",
    colors: ["Beige", "Terracotta", "Slate"],
    sizes: ["S", "M", "L", "XL"],
    isNew: true
  },
  {
    id: "safari-leather-tote",
    name: "Safari Leather Tote",
    categorySlug: "bags",
    category: "Bags",
    price: 12500,
    image: IMAGES.wool,
    badge: "Everyday",
    description:
      "A structured leather tote with a laptop sleeve and magnetic close, hand-finished in Nairobi.",
    colors: ["Beige", "Onyx", "Terracotta"],
    sizes: ["M", "L"]
  },
  {
    id: "nairobi-mini-crossbody",
    name: "Nairobi Mini Crossbody",
    categorySlug: "bags",
    category: "Bags",
    price: 7200,
    image: IMAGES.trench,
    description:
      "A compact crossbody with an adjustable strap and brushed hardware, sized for the essentials.",
    colors: ["Onyx", "Beige", "Sage"],
    sizes: ["S", "M"]
  },
  {
    id: "lamu-woven-clutch",
    name: "Lamu Woven Clutch",
    categorySlug: "bags",
    category: "Bags",
    price: 4800,
    image: IMAGES.knit,
    badge: "New",
    description:
      "A hand-woven clutch with a soft structure and detachable wrist strap, made by coastal artisans.",
    colors: ["Beige", "Cream", "Terracotta"],
    sizes: ["S", "M"],
    isNew: true
  },
  {
    id: "maasai-beaded-necklace",
    name: "Maasai Beaded Necklace",
    categorySlug: "accessories",
    category: "Accessories",
    price: 3500,
    image: IMAGES.skirt,
    badge: "Artisan",
    description:
      "A layered beaded necklace in warm earth tones, hand-strung by Maasai women in Kajiado.",
    colors: ["Terracotta", "Beige", "Onyx"],
    sizes: ["S", "M", "L"]
  },
  {
    id: "savannah-silk-scarf",
    name: "Savannah Silk Scarf",
    categorySlug: "accessories",
    category: "Accessories",
    price: 2800,
    image: IMAGES.knit,
    description:
      "A lightweight silk scarf with hand-rolled edges and a painterly print inspired by the savannah.",
    colors: ["Cream", "Sage", "Terracotta"],
    sizes: ["S", "M"]
  },
  {
    id: "kilimani-gold-hoops",
    name: "Kilimani Gold Hoops",
    categorySlug: "accessories",
    category: "Accessories",
    price: 4200,
    image: IMAGES.blazer,
    badge: "New",
    description:
      "Sculptural gold-tone hoops with a brushed finish and comfortable click closure for all-day wear.",
    colors: ["Beige", "Onyx"],
    sizes: ["S", "M"],
    isNew: true
  }
];

export const HERO_PRODUCT =
  PRODUCTS.find((product) => product.id === "nairobi-dawn-trench") ?? PRODUCTS[0];

export const SUPPORTED_CATEGORY_SLUGS = CATEGORIES.map((category) => category.slug);

export function formatKsh(value: number): string {
  return `KSh ${new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0
  }).format(Math.round(value))}`;
}

export function getCategory(slug: string): StoreCategory | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

export function productsInCategory(slug: string): StoreProduct[] {
  if (slug === "new-in") {
    return PRODUCTS.filter((product) => product.isNew);
  }

  return PRODUCTS.filter((product) => product.categorySlug === slug);
}

export function findProduct(id: string): StoreProduct | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function colorHex(name: string): string {
  return COLOR_OPTIONS.find((color) => color.name === name)?.hex ?? "#D6C3A6";
}

export function defaultSize(product: StoreProduct): string {
  return product.sizes.includes("M") ? "M" : (product.sizes[0] ?? "M");
}

export function defaultColor(product: StoreProduct): string {
  return product.colors[0] ?? "Beige";
}
