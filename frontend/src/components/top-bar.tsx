"use client";

import { useState } from "react";
import { Heart, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";

type TopBarProps = {
  favoriteCount: number;
  bagCount: number;
};

export function TopBar({ favoriteCount, bagCount }: TopBarProps) {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#121212]/85 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <div className="font-serif text-2xl tracking-tight text-cream lg:hidden">Daylog</div>

        <div className="order-3 flex w-full items-center gap-3 lg:order-none lg:mx-auto lg:w-auto lg:max-w-2xl lg:flex-1">
          <label className="group flex h-12 flex-1 items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 transition focus-within:border-sand/50 focus-within:bg-white/[0.04]">
            <Search size={17} strokeWidth={1.7} className="text-zinc-500 group-focus-within:text-sand" />
            <span className="sr-only">Search the collection</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the collection"
              className="w-full bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
            />
            <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] tracking-wide text-zinc-600 sm:block">
              ⌘K
            </kbd>
          </label>
          <button
            type="button"
            aria-label="Filter products"
            className="hidden h-12 w-12 items-center justify-center rounded-full border border-white/[0.08] text-zinc-500 transition hover:border-sand/40 hover:text-sand sm:flex"
          >
            <SlidersHorizontal size={17} strokeWidth={1.7} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            aria-label={`${favoriteCount} saved items`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] text-zinc-300 transition hover:border-sand/40 hover:text-sand"
          >
            <Heart size={18} strokeWidth={1.7} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sand px-1 text-[9px] font-bold text-ink">
              {favoriteCount}
            </span>
          </button>
          <button
            type="button"
            aria-label={`${bagCount} items in bag`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] text-zinc-300 transition hover:border-sand/40 hover:text-sand"
          >
            <ShoppingBag size={18} strokeWidth={1.7} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cream px-1 text-[9px] font-bold text-ink">
              {bagCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
