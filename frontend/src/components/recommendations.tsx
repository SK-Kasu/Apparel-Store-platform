"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { PRODUCTS } from "@/lib/catalog";
import { useStore } from "@/lib/store-context";

export function Recommendations() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { search } = useStore();
  const query = search.trim().toLowerCase();

  const products = PRODUCTS.filter((product) => {
    if (!query) return true;
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }).slice(0, 8);

  const scroll = (direction: -1 | 1) => {
    scrollerRef.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  return (
    <section className="mt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-sand">
            {query ? `Results for "${search.trim()}"` : "Curated for you"}
          </p>
          <h2 className="mt-2 font-serif text-3xl tracking-tight text-cream sm:text-4xl">
            {query ? "Search Results" : "You May Also Like"}
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

      {products.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-14 text-center">
          <SearchX size={28} className="text-zinc-600" />
          <p className="mt-4 font-serif text-2xl text-cream">No pieces match that search</p>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            Try a category like dresses, outerwear, or bags - or explore the full new-in edit.
          </p>
          <Link
            href="/shop/new-in"
            prefetch={true}
            className="mt-5 flex h-11 items-center justify-center rounded-full bg-sand px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-[#E0B68E]"
          >
            Shop new in
          </Link>
        </div>
      ) : (
        <div
          ref={scrollerRef}
          className="mt-6 flex snap-x gap-4 overflow-x-auto pb-3 no-scrollbar sm:gap-5"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
