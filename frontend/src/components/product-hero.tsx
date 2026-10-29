"use client";

import Image from "next/image";
import { ArrowUpRight, Heart } from "lucide-react";
import { COLOR_OPTIONS, SIZE_OPTIONS } from "@/lib/store-data";

type ProductHeroProps = {
  selectedColor: string;
  selectedSize: string;
  isFavorite: boolean;
  onSelectColor: (color: string) => void;
  onSelectSize: (size: string) => void;
  onToggleFavorite: () => void;
  onAddToBag: () => void;
};

export function ProductHero({
  selectedColor,
  selectedSize,
  isFavorite,
  onSelectColor,
  onSelectSize,
  onToggleFavorite,
  onAddToBag
}: ProductHeroProps) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/[0.07] bg-panel shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)]">
      <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
        <div className="flex flex-col p-6 sm:p-9 xl:p-12">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-sand/35 bg-sand/[0.07] px-3.5 py-2 text-[9px] font-semibold uppercase tracking-[0.26em] text-sand">
              <span className="h-1.5 w-1.5 rounded-full bg-sand" />
              New Arrival
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-zinc-600">AW / 2026</span>
          </div>

          <p className="mt-10 font-serif text-base italic text-sand-soft sm:mt-14">
            The signature silhouette
          </p>
          <h1 className="mt-3 font-serif text-[52px] leading-[0.9] tracking-[-0.02em] text-cream sm:text-6xl xl:text-[80px]">
            Beige
            <br />
            <span className="text-sand-soft">Trench Coat</span>
          </h1>
          <p className="mt-6 max-w-md font-serif text-lg italic leading-relaxed text-zinc-400 sm:text-xl">
            A fluid, double-breasted trench cut from brushed cotton twill. Softly structured,
            generously proportioned, and finished with hand-polished hardware.
          </p>

          <div className="mt-8 flex items-end gap-4">
            <span className="text-[32px] font-medium tracking-[-0.04em] text-sand">$129.99</span>
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
            <div className="mt-4 flex items-center gap-3">
              {COLOR_OPTIONS.map((color) => {
                const active = selectedColor === color.name;

                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => onSelectColor(color.name)}
                    aria-label={`Select ${color.name}`}
                    aria-pressed={active}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                      active
                        ? "border-sand ring-1 ring-sand/40 ring-offset-2 ring-offset-panel"
                        : "border-white/20 hover:border-white/50"
                    }`}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-black/20"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                Size
              </p>
              <button
                type="button"
                className="text-[10px] text-zinc-500 underline decoration-zinc-700 underline-offset-4 transition hover:text-sand"
              >
                Size guide
              </button>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2.5">
              {SIZE_OPTIONS.map((size) => {
                const active = selectedSize === size;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onSelectSize(size)}
                    aria-pressed={active}
                    className={`flex h-12 items-center justify-center rounded-xl border text-xs font-semibold tracking-[0.12em] transition ${
                      active
                        ? "border-sand bg-sand text-ink"
                        : "border-white/[0.09] bg-white/[0.02] text-zinc-400 hover:border-sand/40 hover:text-cream"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-[9px] uppercase tracking-[0.18em] text-zinc-600">
            <span>Relaxed fit</span>
            <span className="text-sand/40">/</span>
            <span>Brushed cotton</span>
            <span className="text-sand/40">/</span>
            <span>Fully lined</span>
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden bg-[#202020] lg:min-h-[700px]">
          <Image
            src="/products/trench-coat.jpg"
            alt="Beige trench coat styled for the Daylog spring collection"
            fill
            priority
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="object-cover object-[center_28%] transition duration-700 hover:scale-[1.015]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#121212]/75 via-transparent to-black/10" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />

          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/25 text-cream backdrop-blur-md transition hover:border-sand/60 hover:text-sand"
          >
            <Heart
              size={19}
              strokeWidth={1.6}
              className={isFavorite ? "text-sand" : undefined}
              fill={isFavorite ? "currentColor" : "none"}
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
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-cream/60">
              <span>View look</span>
              <ArrowUpRight size={14} className="text-sand" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.07] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            className={`flex h-14 w-full shrink-0 items-center justify-center rounded-2xl border transition sm:w-14 ${
              isFavorite
                ? "border-sand/60 bg-sand/10 text-sand"
                : "border-white/[0.1] text-zinc-400 hover:border-sand/40 hover:text-sand"
            }`}
          >
            <Heart
              size={20}
              strokeWidth={1.6}
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onAddToBag}
              className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-sand px-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition hover:bg-[#E0B68E] active:scale-[0.995]"
            >
              Add To Bag
              <span className="h-1 w-1 rounded-full bg-ink/50" />
              <span className="text-[10px] tracking-[0.12em]">$129.99</span>
            </button>
            <button
              type="button"
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
