"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import {
  colorHex,
  defaultColor,
  defaultSize,
  formatKsh,
  type StoreProduct
} from "@/lib/catalog";
import { useStore } from "@/lib/store-context";

export function CategoryProductCard({ product }: { product: StoreProduct }) {
  const { addToCart, toggleWishlist, isFavorite } = useStore();
  const [selectedSize, setSelectedSize] = useState(defaultSize(product));
  const [selectedColor, setSelectedColor] = useState(defaultColor(product));
  const favorite = isFavorite(product.id);

  const add = () => addToCart(product, { size: selectedSize, color: selectedColor });

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-panel">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#202020]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={favorite ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
          className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition ${
            favorite
              ? "border-sand/60 bg-black/35 text-sand"
              : "border-white/15 bg-black/20 text-cream/80 hover:border-sand/50 hover:text-sand"
          }`}
        >
          <Heart size={17} strokeWidth={1.7} fill={favorite ? "currentColor" : "none"} />
        </button>

        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/30 px-2.5 py-1.5 text-[8px] uppercase tracking-[0.2em] text-cream/85 backdrop-blur-md">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[8px] uppercase tracking-[0.26em] text-zinc-600">
              {product.category}
            </p>
            <h3 className="mt-1.5 font-serif text-[22px] leading-tight text-cream">
              {product.name}
            </h3>
          </div>
          <p className="shrink-0 pt-3 text-sm font-medium tracking-tight text-sand">
            {formatKsh(product.price)}
          </p>
        </div>

        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
          {product.description}
        </p>

        <div className="mt-4">
          <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Colour · <span className="text-zinc-300">{selectedColor}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.colors.map((name) => {
              const active = selectedColor === name;

              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setSelectedColor(name)}
                  aria-label={`Select ${name}`}
                  aria-pressed={active}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                    active
                      ? "border-sand ring-1 ring-sand/40 ring-offset-2 ring-offset-panel"
                      : "border-white/15 hover:border-white/40"
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/20"
                    style={{ backgroundColor: colorHex(name) }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Size · <span className="text-zinc-300">{selectedSize}</span>
          </p>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {["XS", "S", "M", "L", "XL"].map((size) => {
              const available = product.sizes.includes(size);
              const active = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={!available}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={active}
                  className={`flex h-9 items-center justify-center rounded-lg border text-[10px] font-semibold tracking-[0.1em] transition ${
                    active
                      ? "border-sand bg-sand text-ink"
                      : available
                        ? "border-white/[0.09] bg-white/[0.02] text-zinc-400 hover:border-sand/40 hover:text-cream"
                        : "cursor-not-allowed border-white/[0.04] text-zinc-700"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={add}
            className="flex h-11 items-center justify-center rounded-xl bg-sand px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-[#E0B68E]"
          >
            Add to Bag
          </button>
          <button
            type="button"
            onClick={add}
            className="flex h-11 items-center justify-center rounded-xl border border-white/[0.14] px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream transition hover:border-sand/50 hover:text-sand"
          >
            Buy Now
          </button>
        </div>
      </div>
    </article>
  );
}
