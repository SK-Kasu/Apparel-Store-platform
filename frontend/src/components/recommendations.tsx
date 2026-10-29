"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { RECOMMENDATIONS } from "@/lib/store-data";

type RecommendationsProps = {
  favoriteIds: Set<string>;
  onToggleFavorite: (id: string) => void;
  onAddToBag: (id: string) => void;
};

export function Recommendations({
  favoriteIds,
  onToggleFavorite,
  onAddToBag
}: RecommendationsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-sand">Curated for you</p>
          <h2 className="mt-2 font-serif text-3xl tracking-tight text-cream sm:text-4xl">
            You May Also Like
          </h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Scroll recommendations left"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-zinc-500 transition hover:border-sand/40 hover:text-sand"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Scroll recommendations right"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] text-zinc-500 transition hover:border-sand/40 hover:text-sand"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-6 flex snap-x gap-4 overflow-x-auto pb-3 no-scrollbar sm:gap-5"
      >
        {RECOMMENDATIONS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={favoriteIds.has(product.id)}
            onToggleFavorite={onToggleFavorite}
            onAddToBag={onAddToBag}
          />
        ))}
      </div>
    </section>
  );
}
