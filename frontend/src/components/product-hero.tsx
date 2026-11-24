"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Heart } from "lucide-react";
import {
  HERO_PRODUCT,
  SIZE_OPTIONS,
  colorHex,
  defaultColor,
  defaultSize,
  formatKsh
} from "@/lib/catalog";
import { useStore } from "@/lib/store-context";

export function ProductHero() {
  const { addToCart, toggleWishlist, isFavorite } = useStore();
  const [selectedColor, setSelectedColor] = useState(defaultColor(HERO_PRODUCT));
  const [selectedSize, setSelectedSize] = useState(defaultSize(HERO_PRODUCT));
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const favorite = isFavorite(HERO_PRODUCT.id);

  const add = () => {
    addToCart(HERO_PRODUCT, { color: selectedColor, size: selectedSize });
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[0.07] bg-panel shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)]">
      <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
        <div className="flex min-w-0 flex-col p-5 sm:p-9 xl:p-12">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-sand/35 bg-sand/[0.07] px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.26em] text-sand">
              <span className="h-1.5 w-1.5 rounded-full bg-sand" />
              New Arrival
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-zinc-600">AW / 2026</span>
          </div>

          <p className="mt-8 font-serif text-base italic text-sand-soft sm:mt-14">
            The signature silhouette
          </p>
          <h1 className="mt-3 font-serif text-[44px] leading-[0.92] tracking-[-0.02em] text-cream sm:text-6xl xl:text-[76px]">
            Nairobi Dawn
            <br />
            <span className="text-sand-soft">Trench Coat</span>
          </h1>
          <p className="mt-6 max-w-md font-serif text-lg italic leading-relaxed text-zinc-400 sm:text-xl">
            A fluid, double-breasted trench cut from brushed Kenyan cotton twill. Softly
            structured, generously proportioned, and finished with hand-polished hardware.
          </p>

          <div className="mt-8 flex items-end gap-4">
            <span className="text-[30px] font-medium tracking-[-0.04em] text-sand">
              {formatKsh(HERO_PRODUCT.price)}
            </span>
            <span className="pb-1.5 text-[9px] uppercase tracking-[0.22em] text-zinc-600">
              incl. duties
            </span>
          </div>

          <div className="mt-8 h-px bg-white/[0.08]" />

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                Colour
              </p>
              <p className="text-[11px] text-zinc-300">{selectedColor}</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {HERO_PRODUCT.colors.map((name) => {
                const active = selectedColor === name;

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedColor(name)}
                    aria-label={`Select ${name}`}
                    aria-pressed={active}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                      active
                        ? "border-sand ring-1 ring-sand/40 ring-offset-2 ring-offset-panel"
                        : "border-white/20 hover:border-white/50"
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-black/20"
                      style={{ backgroundColor: colorHex(name) }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                Size
              </p>
              <button
                type="button"
                onClick={() => setShowSizeGuide((open) => !open)}
                aria-expanded={showSizeGuide}
                className="text-[10px] text-zinc-500 underline decoration-zinc-700 underline-offset-4 transition hover:text-sand"
              >
                {showSizeGuide ? "Hide size guide" : "Size guide"}
              </button>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {SIZE_OPTIONS.map((size) => {
                const active = selectedSize === size;
                const available = HERO_PRODUCT.sizes.includes(size);

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!available}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={active}
                    className={`flex h-12 items-center justify-center rounded-xl border text-xs font-semibold tracking-[0.12em] transition ${
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
            {showSizeGuide ? (
              <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-[11px] leading-relaxed text-zinc-400">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-sand">
                  Fit notes
                </p>
                <p className="mt-2">
                  Relaxed fit. XS–S fits UK 6–8, M–L fits UK 10–14, XL fits UK 16. Model is
                  175cm and wears size M.
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[9px] uppercase tracking-[0.18em] text-zinc-600">
            <span>Relaxed fit</span>
            <span className="text-sand/40">/</span>
            <span>Brushed cotton</span>
            <span className="text-sand/40">/</span>
            <span>Fully lined</span>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden bg-[#202020] sm:min-h-[520px] lg:min-h-[700px]">
          <Image
            src={HERO_PRODUCT.image}
            alt="Beige trench coat styled for the Radiant Regalia Collection spring edit"
            fill
            priority
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover object-[center_28%] transition duration-700 hover:scale-[1.015]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121212]/75 via-transparent to-black/10" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />

          <button
            type="button"
            onClick={() => toggleWishlist(HERO_PRODUCT.id)}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/25 text-cream backdrop-blur-md transition hover:border-sand/60 hover:text-sand"
          >
            <Heart
              size={19}
              strokeWidth={1.6}
              className={favorite ? "text-sand" : undefined}
              fill={favorite ? "currentColor" : "none"}
            />
          </button>

          <div className="absolute left-5 top-5">
            <span className="rounded-full border border-white/15 bg-black/25 px-3 py-2 text-[8px] uppercase tracking-[0.24em] text-cream/80 backdrop-blur-md">
              Editor&apos;s pick
            </span>
          </div>

          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.28em] text-cream/60">The trench</p>
              <p className="mt-1 font-serif text-xl text-cream">01 / 04</p>
            </div>
            <Link
              href="/shop/new-in"
              className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-cream/60 transition hover:text-sand"
            >
              <span>View look</span>
              <ArrowUpRight size={14} className="text-sand" />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => toggleWishlist(HERO_PRODUCT.id)}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            className={`flex h-14 w-full shrink-0 items-center justify-center rounded-2xl border transition sm:w-14 ${
              favorite
                ? "border-sand/60 bg-sand/10 text-sand"
                : "border-white/[0.1] text-zinc-400 hover:border-sand/40 hover:text-sand"
            }`}
          >
            <Heart size={20} strokeWidth={1.6} fill={favorite ? "currentColor" : "none"} />
          </button>
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={add}
              className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-sand px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition hover:bg-[#E0B68E] active:scale-[0.995]"
            >
              Add To Bag
              <span className="h-1 w-1 rounded-full bg-ink/50" />
              <span className="text-[10px] tracking-[0.12em]">{formatKsh(HERO_PRODUCT.price)}</span>
            </button>
            <button
              type="button"
              onClick={add}
              className="h-14 rounded-2xl border border-white/[0.14] bg-transparent px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream transition hover:border-sand/50 hover:bg-white/[0.03] hover:text-sand"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
