"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, ShoppingBag, X } from "lucide-react";

export type NewInProduct = {
  id: string;
  title: string;
  price: number;
  baseImage: string;
  hoverImage: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  note?: string;
};

const NEW_IN_PRODUCTS: NewInProduct[] = [
  {
    id: "radiant-silk-wrap-dress",
    title: "Radiant Silk Wrap Dress",
    price: 189.99,
    baseImage: "/products/pleated-skirt.jpg",
    hoverImage: "/products/knit-sweater.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Sand", hex: "#D4A373" },
      { name: "Ivory", hex: "#F5F0E7" },
      { name: "Onyx", hex: "#202020" }
    ],
    note: "Bias-cut silk with a hand-finished wrap waist."
  },
  {
    id: "regalia-tailored-blazer",
    title: "Regalia Tailored Blazer",
    price: 219.99,
    baseImage: "/products/oversized-blazer.jpg",
    hoverImage: "/products/wool-coat.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal", hex: "#3F3F46" },
      { name: "Camel", hex: "#C6A47E" },
      { name: "Slate", hex: "#747B86" }
    ],
    note: "Structured shoulder, fluid drape, and a clean single-button closure."
  },
  {
    id: "nairobi-urban-linen-shirt",
    title: "Nairobi Urban Linen Shirt",
    price: 89.99,
    baseImage: "/products/knit-sweater.jpg",
    hoverImage: "/products/pleated-skirt.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Chalk", hex: "#F1ECE2" },
      { name: "Olive", hex: "#6B7259" },
      { name: "Ink", hex: "#18181B" }
    ],
    note: "Breathable washed linen tailored for warm-weather layering."
  },
  {
    id: "savannah-pleated-skirt",
    title: "Savannah Pleated Skirt",
    price: 119.99,
    baseImage: "/products/pleated-skirt.jpg",
    hoverImage: "/products/trench-coat.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Ochre", hex: "#B98A4A" },
      { name: "Stone", hex: "#A8A29E" },
      { name: "Black", hex: "#111111" }
    ],
    note: "Sunray pleats with a fluid midi length and concealed zip."
  },
  {
    id: "atelier-wool-coat",
    title: "Atelier Wool Coat",
    price: 279.99,
    baseImage: "/products/wool-coat.jpg",
    hoverImage: "/products/oversized-blazer.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Camel", hex: "#C6A47E" },
      { name: "Graphite", hex: "#52525B" },
      { name: "Cream", hex: "#F5F0E7" }
    ],
    note: "Double-faced wool with a relaxed cocoon silhouette."
  },
  {
    id: "mombasa-trench",
    title: "Mombasa Trench",
    price: 249.99,
    baseImage: "/products/trench-coat.jpg",
    hoverImage: "/products/wool-coat.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Beige", hex: "#D6C3A6" },
      { name: "Sand", hex: "#D4A373" },
      { name: "Onyx", hex: "#202020" }
    ],
    note: "Weather-ready cotton twill with polished hardware and storm flaps."
  },
  {
    id: "kilimani-knit-sweater",
    title: "Kilimani Knit Sweater",
    price: 79.99,
    baseImage: "/products/knit-sweater.jpg",
    hoverImage: "/products/wool-coat.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Oat", hex: "#D8CBB8" },
      { name: "Moss", hex: "#6B7259" },
      { name: "Charcoal", hex: "#3F3F46" }
    ],
    note: "Fine-gauge merino with a softly brushed hand feel."
  },
  {
    id: "westlands-oversized-blazer",
    title: "Westlands Oversized Blazer",
    price: 199.99,
    baseImage: "/products/oversized-blazer.jpg",
    hoverImage: "/products/trench-coat.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Espresso", hex: "#4A3A2E" },
      { name: "Slate", hex: "#747B86" },
      { name: "Ivory", hex: "#F5F0E7" }
    ],
    note: "Relaxed tailoring with a longline cut and soft construction."
  }
];

type NewInCollectionProps = {
  isProcessing: boolean;
  onAddToBag: (product: NewInProduct, size: string, color: string) => void;
  onBuyNow: (product: NewInProduct, size: string, color: string) => void | Promise<void>;
};

const defaultSize = (product: NewInProduct) =>
  product.sizes.includes("M") ? "M" : product.sizes[0];

export function NewInCollection({ isProcessing, onAddToBag, onBuyNow }: NewInCollectionProps) {
  const [selectedProduct, setSelectedProduct] = useState<NewInProduct | null>(null);
  const [activeModalSize, setActiveModalSize] = useState("M");
  const [activeModalColor, setActiveModalColor] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const confirmationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedProduct]);

  useEffect(() => {
    return () => {
      if (confirmationTimeout.current) {
        clearTimeout(confirmationTimeout.current);
      }
    };
  }, []);

  const openQuickView = (product: NewInProduct) => {
    setSelectedProduct(product);
    setActiveModalSize(defaultSize(product));
    setActiveModalColor(product.colors[0]?.name ?? "");
  };

  const showConfirmation = () => {
    setConfirmation("Item added successfully!");

    if (confirmationTimeout.current) {
      clearTimeout(confirmationTimeout.current);
    }

    confirmationTimeout.current = setTimeout(() => setConfirmation(null), 2200);
  };

  const addProductToBag = (
    product: NewInProduct,
    size = defaultSize(product),
    color = product.colors[0]?.name ?? ""
  ) => {
    onAddToBag(product, size, color);
    showConfirmation();
  };

  const handleModalBuyNow = async () => {
    if (!selectedProduct) {
      return;
    }

    await onBuyNow(selectedProduct, activeModalSize, activeModalColor);
  };

  return (
    <section id="new-in" className="mt-10 scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-sand">New In</p>
          <h2 className="mt-2 font-serif text-3xl tracking-tight text-cream sm:text-4xl">
            New Arrivals
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
            A considered edit of premium pieces, cut for movement and finished for everyday
            elegance.
          </p>
        </div>
        <span className="hidden text-[9px] uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-400 sm:block">
          {NEW_IN_PRODUCTS.length} pieces
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {NEW_IN_PRODUCTS.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 transition-transform duration-300 hover:scale-[1.02] dark:border-zinc-800 dark:bg-zinc-900"
          >
            <button
              type="button"
              onClick={() => openQuickView(product)}
              aria-label={`Quick view ${product.title}`}
              className="block w-full text-left"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={product.baseImage}
                  alt={product.title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:opacity-0"
                />
                <Image
                  src={product.hoverImage}
                  alt=""
                  fill
                  aria-hidden="true"
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-0 transition duration-500 group-hover:opacity-100"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70" />
                <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/25 px-2.5 py-1.5 text-[8px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                  New In
                </span>
                <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[8px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
                  Quick View
                </span>
              </div>

              <div className="p-4">
                <p className="text-[8px] uppercase tracking-[0.26em] text-zinc-600 dark:text-zinc-400">
                  New Arrival
                </p>
                <h3 className="mt-1.5 font-serif text-xl leading-tight text-cream">
                  {product.title}
                </h3>
                {product.note ? (
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
                    {product.note}
                  </p>
                ) : null}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-sand">${product.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1.5">
                    {product.colors.slice(0, 3).map((color) => (
                      <span
                        key={color.name}
                        className="h-3 w-3 rounded-full border border-black/10 dark:border-white/20"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </button>

            <div className="mt-auto px-4 pb-4">
              <button
                type="button"
                onClick={() => addProductToBag(product)}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700 transition hover:border-sand hover:text-sand dark:border-zinc-700 dark:text-zinc-200"
              >
                <ShoppingBag size={14} strokeWidth={1.7} />
                Add to Bag
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedProduct ? (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-in-quick-view-title"
        >
          <button
            type="button"
            onClick={() => setSelectedProduct(null)}
            aria-label="Close quick view"
            className="animate-fade-in absolute inset-0 bg-black/65 backdrop-blur-sm"
          />

          <div className="animate-modal-in relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-y-auto rounded-t-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-[#141414] sm:rounded-3xl">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close quick view"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-700 backdrop-blur-md transition hover:border-sand/50 hover:text-sand dark:border-zinc-700 dark:bg-black/40 dark:text-zinc-200"
            >
              <X size={17} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative min-h-[320px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 md:min-h-[560px]">
                <Image
                  src={selectedProduct.baseImage}
                  alt={selectedProduct.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[8px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
                  New In · AW 2026
                </span>
              </div>

              <div className="flex flex-col p-5 sm:p-7 lg:p-8">
                <p className="text-[9px] uppercase tracking-[0.3em] text-sand">Quick View</p>
                <h2
                  id="new-in-quick-view-title"
                  className="mt-2 font-serif text-3xl leading-tight tracking-tight text-cream sm:text-4xl"
                >
                  {selectedProduct.title}
                </h2>
                <p className="mt-3 text-2xl font-medium tracking-tight text-sand">
                  ${selectedProduct.price.toFixed(2)}
                </p>
                {selectedProduct.note ? (
                  <p className="mt-4 text-sm leading-relaxed text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
                    {selectedProduct.note}
                  </p>
                ) : null}

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-zinc-600 dark:text-zinc-400">
                      Size
                    </p>
                    <p className="text-[11px] text-zinc-700 dark:text-zinc-300">{activeModalSize}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((size) => {
                      const active = activeModalSize === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setActiveModalSize(size)}
                          aria-pressed={active}
                          className={`flex h-11 min-w-11 items-center justify-center rounded-xl border px-3 text-xs font-semibold tracking-[0.12em] transition ${
                            active
                              ? "border-sand bg-sand/10 text-sand"
                              : "border-zinc-200 text-zinc-600 hover:border-sand/40 hover:text-cream dark:border-zinc-700 dark:text-zinc-400"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-zinc-600 dark:text-zinc-400">
                      Colour
                    </p>
                    <p className="text-[11px] text-zinc-700 dark:text-zinc-300">
                      {activeModalColor}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {selectedProduct.colors.map((color) => {
                      const active = activeModalColor === color.name;

                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setActiveModalColor(color.name)}
                          aria-label={`Select ${color.name}`}
                          aria-pressed={active}
                          className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                            active
                              ? "border-sand ring-2 ring-sand/40 ring-offset-2 ring-offset-white dark:ring-offset-[#141414]"
                              : "border-zinc-300 hover:border-sand/50 dark:border-zinc-700"
                          }`}
                        >
                          <span
                            className="h-6 w-6 rounded-full border border-black/10 dark:border-white/20"
                            style={{ backgroundColor: color.hex }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      addProductToBag(selectedProduct, activeModalSize, activeModalColor)
                    }
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-sand px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-ink transition hover:bg-[#E0B68E]"
                  >
                    <ShoppingBag size={15} strokeWidth={1.8} />
                    Add to Bag
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleModalBuyNow()}
                    disabled={isProcessing}
                    aria-busy={isProcessing}
                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-300 px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-800 transition hover:border-sand hover:text-sand disabled:cursor-wait disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-100"
                  >
                    {isProcessing ? "Processing..." : "Buy Now"}
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
                  Complimentary delivery over $100 · Nairobi same-day available
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {confirmation ? (
        <div
          role="status"
          aria-live="polite"
          className="animate-modal-in fixed bottom-24 right-5 z-[70] flex items-center gap-2 rounded-full border border-sand/30 bg-white px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-800 shadow-[0_18px_50px_-15px_rgba(0,0,0,0.5)] dark:bg-[#171513] dark:text-cream"
        >
          <Check size={15} strokeWidth={2} className="text-sand" />
          {confirmation}
        </div>
      ) : null}
    </section>
  );
}
