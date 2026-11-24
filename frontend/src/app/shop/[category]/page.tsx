"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { CategoryProductCard } from "@/components/category-product-card";
import { StoreShell } from "@/components/store-shell";
import {
  CATEGORIES,
  getCategory,
  productsInCategory
} from "@/lib/catalog";
import { useStore } from "@/lib/store-context";

export default function CategoryPage() {
  const params = useParams<{ category: string }>();
  const { search, setSearch } = useStore();
  const slug = typeof params.category === "string" ? params.category : "";
  const category = getCategory(slug);
  const query = search.trim().toLowerCase();

  const products = category
    ? productsInCategory(category.slug).filter((product) => {
        if (!query) return true;
        return (
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        );
      })
    : [];

  return (
    <StoreShell>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-600">
          Women / {category?.label ?? "Collection"}
        </p>
        <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-600">
          Free Nairobi delivery over KSh 10,000
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar">
        {CATEGORIES.map((item) => {
          const active = item.slug === category?.slug;

          return (
            <Link
              key={item.slug}
              href={`/shop/${item.slug}`}
              aria-current={active ? "page" : undefined}
              className={`flex h-10 shrink-0 items-center rounded-full border px-4 text-[10px] font-semibold uppercase tracking-[0.16em] transition ${
                active
                  ? "border-sand bg-sand text-ink"
                  : "border-white/[0.09] text-zinc-500 hover:border-sand/40 hover:text-cream"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {category ? (
        <>
          <header className="mt-5 max-w-3xl">
            <p className="text-[9px] uppercase tracking-[0.32em] text-sand">{category.tagline}</p>
            <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight text-cream sm:text-6xl">
              {category.label}
            </h1>
            <p className="mt-4 font-serif text-lg italic leading-relaxed text-zinc-400 sm:text-xl">
              {category.description}
            </p>
            <p className="mt-4 text-[9px] uppercase tracking-[0.24em] text-zinc-600">
              {query
                ? `${products.length} result${products.length === 1 ? "" : "s"} for "${search.trim()}"`
                : `${products.length} pieces · Prices in Kenyan shillings`}
            </p>
          </header>

          {products.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-white/[0.07] bg-white/[0.02] px-6 py-16 text-center">
              <SearchX size={30} className="text-zinc-600" />
              <p className="mt-4 font-serif text-2xl text-cream">No pieces found</p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
                {query
                  ? "Try another search, or browse the full category."
                  : "This edit is being prepared. Explore another category in the collection."}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {query ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="flex h-11 items-center rounded-full bg-sand px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-[#E0B68E]"
                  >
                    Clear search
                  </button>
                ) : null}
                <Link
                  href="/shop/new-in"
                  className="flex h-11 items-center rounded-full border border-white/10 px-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 transition hover:border-sand/50 hover:text-sand"
                >
                  Shop new in
                </Link>
              </div>
            </div>
          ) : (
            <section
              className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6"
              aria-label={`${category.label} products`}
            >
              {products.map((product) => (
                <CategoryProductCard key={product.id} product={product} />
              ))}
            </section>
          )}
        </>
      ) : (
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-white/[0.07] bg-white/[0.02] px-6 py-16 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-sand">Collection</p>
          <h1 className="mt-3 font-serif text-4xl text-cream">Category not found</h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500">
            The edit you are looking for has moved. Browse the collection below.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((item) => (
              <Link
                key={item.slug}
                href={`/shop/${item.slug}`}
                className="flex h-10 items-center rounded-full border border-white/10 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 transition hover:border-sand/50 hover:text-sand"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </StoreShell>
  );
}
