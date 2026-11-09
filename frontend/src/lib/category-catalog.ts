import type { CategorySlug } from "@/lib/categories";

export type ProductColor = {
  name: string;
  hex: string;
};

export type ShopProduct = {
  id: string;
  title: string;
  price: string;
  amount: number;
  details: string;
  sizes: string[];
  colors: ProductColor[];
  description: string;
  category: CategorySlug;
  badge?: string;
};

export type CategoryCatalog = {
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  products: ShopProduct[];
};

const DRESSES: ShopProduct[] = [
  {
    id: "premium-silk-slip-dress",
    title: "Premium Silk Slip Dress",
    price: "KSh 12,500",
    amount: 12500,
    details: "100% mulberry silk · Bias cut · Adjustable straps · Dry clean",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Champagne", hex: "#D9C4A3" },
      { name: "Espresso", hex: "#3B2A21" },
      { name: "Midnight", hex: "#1B2430" }
    ],
    description:
      "A vertical editorial composition: a liquid silk column falls from fine straps into a low cowl back, with a shadowed side slit and a pooled hem.",
    category: "dresses",
    badge: "Signature"
  },
  {
    id: "floral-kitenge-maxi",
    title: "Floral Kitenge Maxi",
    price: "KSh 9,800",
    amount: 9800,
    details: "Cotton kitenge · Hand-finished print · Side pockets · Machine wash cold",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Marigold Bloom", hex: "#C77D2B" },
      { name: "Indigo Bloom", hex: "#2F4B6E" },
      { name: "Clay Bloom", hex: "#9E5B4A" }
    ],
    description:
      "A full-length panel composition: a fitted bodice opens into a sweeping kitenge skirt, framed by a sculpted waist seam and a single front split.",
    category: "dresses"
  }
];

const TOPS: ShopProduct[] = [
  {
    id: "pure-linen-button-up",
    title: "Pure Linen Button-Up",
    price: "KSh 5,200",
    amount: 5200,
    details: "European linen · Mother-of-pearl buttons · Relaxed fit · Machine wash cold",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Chalk", hex: "#E8E0D2" },
      { name: "Sage", hex: "#8A927C" },
      { name: "Ink", hex: "#232323" }
    ],
    description:
      "A clean grid composition: an oversized shirt body is anchored by a crisp placket, dropped shoulder seams, and a curved hem that skims the hip.",
    category: "tops"
  },
  {
    id: "fine-knit-shell-top",
    title: "Fine Knit Shell Top",
    price: "KSh 4,600",
    amount: 4600,
    details: "Merino blend · Fine gauge knit · Sleeveless · Hand wash",
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Oat", hex: "#CDBFA8" },
      { name: "Charcoal", hex: "#4B4B4B" },
      { name: "Burgundy", hex: "#6C2F36" }
    ],
    description:
      "A compact knit composition: a high round neckline and narrow shoulder line frame a body-skimming shell, finished with a ribbed hem and armholes.",
    category: "tops"
  }
];

const OUTERWEAR: ShopProduct[] = [
  {
    id: "maasai-fleece-trench-coat",
    title: "Maasai Fleece Trench Coat",
    price: "KSh 18,500",
    amount: 18500,
    details: "Brushed cotton fleece · Full lining · Horn buttons · Specialist clean",
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Camel", hex: "#B98A5E" },
      { name: "Onyx", hex: "#222222" },
      { name: "Crimson", hex: "#7B2D35" }
    ],
    description:
      "A layered outerwear composition: a double-breasted trench body is softened by fleece texture, with a wide storm flap, belted waist, and deep patch pockets.",
    category: "outerwear",
    badge: "Atelier"
  },
  {
    id: "cropped-denim-blazer",
    title: "Cropped Denim Blazer",
    price: "KSh 8,900",
    amount: 8900,
    details: "Rigid cotton denim · Cropped fit · Notch lapel · Machine wash cold",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Washed Indigo", hex: "#4D6480" },
      { name: "Ecru", hex: "#D8D0C2" },
      { name: "Black Denim", hex: "#2A2A2A" }
    ],
    description:
      "A cropped tailoring composition: a boxy denim blazer sits above the waist, balanced by strong shoulders, a single-button closure, and raw-edge cuffs.",
    category: "outerwear"
  }
];

const PANTS: ShopProduct[] = [
  {
    id: "high-waisted-pleated-trousers",
    title: "High-Waisted Pleated Trousers",
    price: "KSh 6,400",
    amount: 6400,
    details: "Wool blend · Double pleat · Tapered leg · Dry clean",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Stone", hex: "#B7AA96" },
      { name: "Navy", hex: "#26344A" },
      { name: "Black", hex: "#1E1E1E" }
    ],
    description:
      "A long-line trouser composition: a high waistband releases into double front pleats, tapering through the leg to a clean cropped ankle.",
    category: "pants"
  },
  {
    id: "linen-wide-leg-pants",
    title: "Linen Wide-Leg Pants",
    price: "KSh 5,900",
    amount: 5900,
    details: "Washed linen · Elastic back waist · Wide leg · Machine wash cold",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Sand", hex: "#C9B28E" },
      { name: "Olive", hex: "#6E7252" },
      { name: "White", hex: "#ECE8E0" }
    ],
    description:
      "A fluid volume composition: a flat-front waist flows into a generous wide leg, with a soft break at the floor and discreet side seam pockets.",
    category: "pants"
  }
];

const SHOES: ShopProduct[] = [
  {
    id: "leather-block-heel-mules",
    title: "Leather Block-Heel Mules",
    price: "KSh 7,800",
    amount: 7800,
    details: "Full-grain leather · 65 mm block heel · Leather lining · Made in Kenya",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "Tan", hex: "#A9744F" },
      { name: "Black", hex: "#1C1C1C" },
      { name: "Bone", hex: "#D8CBB8" }
    ],
    description:
      "A sculptural footwear composition: a pointed leather vamp rests on a squared block heel, with a clean open back and a slim ankle strap.",
    category: "shoes"
  },
  {
    id: "urban-minimalist-loafers",
    title: "Urban Minimalist Loafers",
    price: "KSh 8,200",
    amount: 8200,
    details: "Polished calf leather · Rubber sole · Apron toe · Leather lining",
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "Espresso", hex: "#3A2B24" },
      { name: "Black", hex: "#191919" },
      { name: "Cognac", hex: "#8B4F2C" }
    ],
    description:
      "A low-profile composition: a rounded apron-toe loafer is set on a flexible rubber sole, with a clean vamp and hand-stitched collar.",
    category: "shoes"
  }
];

const BAGS: ShopProduct[] = [
  {
    id: "luxury-pebbled-totebag",
    title: "Luxury Pebbled Totebag",
    price: "KSh 14,500",
    amount: 14500,
    details: "Pebbled leather · Cotton twill lining · Magnetic closure · Dust bag included",
    sizes: ["One Size"],
    colors: [
      { name: "Cognac", hex: "#8C5A3C" },
      { name: "Onyx", hex: "#1D1D1D" },
      { name: "Cream", hex: "#E3D8C7" }
    ],
    description:
      "A structured carry composition: a tall pebbled leather tote is framed by rolled handles, a recessed zip pocket, and a broad base that holds its shape.",
    category: "bags"
  },
  {
    id: "woven-sisal-accent-clutch",
    title: "Woven Sisal Accent Clutch",
    price: "KSh 6,700",
    amount: 6700,
    details: "Handwoven sisal · Leather trim · Detachable wrist strap · Spot clean",
    sizes: ["One Size"],
    colors: [
      { name: "Natural", hex: "#C6A875" },
      { name: "Charcoal", hex: "#3E3A35" },
      { name: "Terracotta", hex: "#A85C43" }
    ],
    description:
      "A textural evening composition: a compact sisal clutch is bordered in smooth leather, with a fold-over flap and a slender detachable wrist loop.",
    category: "bags"
  }
];

const ACCESSORIES: ShopProduct[] = [
  {
    id: "fine-brass-statement-hoops",
    title: "Fine Brass Statement Hoops",
    price: "KSh 3,200",
    amount: 3200,
    details: "Recycled brass · Lightweight hollow form · Sterling silver posts · Polish with cloth",
    sizes: ["One Size"],
    colors: [
      { name: "Brass", hex: "#B08D57" },
      { name: "Silver", hex: "#C9CCD0" },
      { name: "Oxidised", hex: "#5B544B" }
    ],
    description:
      "A circular jewelry composition: two graduated hoops are hollow-formed in brass, catching light along a fine hand-polished edge.",
    category: "accessories"
  },
  {
    id: "silk-reversible-scarf",
    title: "Silk Reversible Scarf",
    price: "KSh 4,100",
    amount: 4100,
    details: "100% silk twill · Reversible print · Hand-rolled hem · Dry clean",
    sizes: ["One Size"],
    colors: [
      { name: "Amber / Ink", hex: "#B5793A" },
      { name: "Sage / Cream", hex: "#9AA084" },
      { name: "Rose / Clay", hex: "#B77B72" }
    ],
    description:
      "A folded textile composition: a long silk square reverses between two prints, finished with a hand-rolled edge and a fluid drape.",
    category: "accessories"
  }
];

const NEW_IN: ShopProduct[] = [
  { ...DRESSES[0], id: "new-in-silk-slip-dress", category: "new-in", badge: "Just in" },
  { ...OUTERWEAR[0], id: "new-in-fleece-trench", category: "new-in", badge: "Just in" },
  { ...TOPS[0], id: "new-in-linen-button-up", category: "new-in", badge: "Just in" },
  { ...SHOES[0], id: "new-in-block-heel-mules", category: "new-in", badge: "Just in" }
];

export const CATEGORY_CATALOG = {
  "new-in": {
    label: "New In",
    eyebrow: "Freshly landed",
    title: "The New In Edit",
    description:
      "The latest arrivals, pulled from every corner of the atelier and styled for the season ahead.",
    products: NEW_IN
  },
  dresses: {
    label: "Dresses",
    eyebrow: "Fluid silhouettes",
    title: "Dresses",
    description:
      "Bias-cut silk, hand-printed kitenge, and evening-ready lines made for movement.",
    products: DRESSES
  },
  tops: {
    label: "Tops",
    eyebrow: "Everyday foundations",
    title: "Tops",
    description:
      "Quietly sculpted shirts and fine knits that layer easily through the week.",
    products: TOPS
  },
  outerwear: {
    label: "Outerwear",
    eyebrow: "Soft structure",
    title: "Outerwear",
    description:
      "Trench coats and cropped tailoring built to carry the changing weather.",
    products: OUTERWEAR
  },
  pants: {
    label: "Pants",
    eyebrow: "Long lines",
    title: "Pants",
    description:
      "Pleated and wide-leg shapes with an easy drape and a precise finish.",
    products: PANTS
  },
  shoes: {
    label: "Shoes",
    eyebrow: "Grounded steps",
    title: "Shoes",
    description:
      "Leather mules and minimalist loafers shaped for long days and late evenings.",
    products: SHOES
  },
  bags: {
    label: "Bags",
    eyebrow: "Carry pieces",
    title: "Bags",
    description:
      "Structured leather and handwoven textures designed to move with you.",
    products: BAGS
  },
  accessories: {
    label: "Accessories",
    eyebrow: "Finishing touches",
    title: "Accessories",
    description:
      "Brass, silk, and small sculptural details that complete the silhouette.",
    products: ACCESSORIES
  }
} satisfies Record<CategorySlug, CategoryCatalog>;
