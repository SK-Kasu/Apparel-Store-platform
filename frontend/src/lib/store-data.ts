export type Recommendation = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
};

export const COLOR_OPTIONS = [
  { name: "Beige", hex: "#D6C3A6" },
  { name: "Slate", hex: "#747B86" },
  { name: "Onyx", hex: "#202020" }
] as const;

export const SIZE_OPTIONS = ["S", "M", "L", "XL"] as const;

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "wool-blend-coat",
    name: "Wool Blend Coat",
    category: "Outerwear",
    price: 159.99,
    image: "/products/wool-coat.jpg",
    badge: "New"
  },
  {
    id: "oversized-blazer",
    name: "Oversized Blazer",
    category: "Tailoring",
    price: 89.99,
    image: "/products/oversized-blazer.jpg"
  },
  {
    id: "knit-sweater",
    name: "Knit Sweater",
    category: "Knitwear",
    price: 49.99,
    image: "/products/knit-sweater.jpg",
    badge: "Soft touch"
  },
  {
    id: "pleated-skirt",
    name: "Pleated Skirt",
    category: "Dresses & Skirts",
    price: 59.99,
    image: "/products/pleated-skirt.jpg"
  }
];
