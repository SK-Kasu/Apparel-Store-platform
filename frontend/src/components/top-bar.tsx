"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sun
} from "lucide-react";

type TopBarProps = {
  favoriteCount: number;
  bagCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenSidebar: () => void;
};

export function TopBar({
  favoriteCount,
  bagCount,
  isDarkMode,
  onToggleTheme,
  onOpenSidebar
}: TopBarProps) {
  const [query, setQuery] = useState("");
  const [isBagFlashing, setIsBagFlashing] = useState(false);

  useEffect(() => {
    if (bagCount === 0) {
      return;
    }

    setIsBagFlashing(true);
    const timeout = setTimeout(() => setIsBagFlashing(false), 450);

    return () => clearTimeout(timeout);
  }, [bagCount]);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-[#f9f6f0]/85 backdrop-blur-xl dark:bg-[#121212]/85">
      <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-zinc-700 transition hover:border-sand/40 hover:text-sand dark:text-zinc-300 lg:hidden"
        >
          <Menu size={18} strokeWidth={1.7} />
        </button>

        <div className="font-serif text-xl tracking-tight text-cream sm:text-2xl lg:hidden">
          Radiant Regalia
        </div>

        <div className="order-3 flex w-full items-center gap-3 lg:order-none lg:mx-auto lg:w-auto lg:max-w-2xl lg:flex-1">
          <label className="group flex h-12 flex-1 items-center gap-3 rounded-full border border-line bg-black/[0.03] px-5 transition focus-within:border-sand/50 focus-within:bg-black/[0.04] dark:bg-white/[0.03] dark:focus-within:bg-white/[0.04]">
            <Search
              size={17}
              strokeWidth={1.7}
              className="text-subtle group-focus-within:text-sand"
            />
            <span className="sr-only">Search the collection</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the collection"
              className="w-full bg-transparent text-sm text-zinc-800 outline-none placeholder:text-faint dark:text-zinc-200"
            />
            <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] tracking-wide text-faint sm:block">
              ⌘K
            </kbd>
          </label>
          <button
            type="button"
            aria-label="Filter products"
            className="hidden h-12 w-12 items-center justify-center rounded-full border border-line text-subtle transition hover:border-sand/40 hover:text-sand sm:flex"
          >
            <SlidersHorizontal size={17} strokeWidth={1.7} />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDarkMode}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-zinc-700 transition hover:border-sand/40 hover:text-sand dark:text-zinc-300"
          >
            {isDarkMode ? (
              <Sun size={18} strokeWidth={1.7} />
            ) : (
              <Moon size={18} strokeWidth={1.7} />
            )}
          </button>
          <button
            type="button"
            aria-label={`${favoriteCount} saved items`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line text-zinc-700 transition hover:border-sand/40 hover:text-sand dark:text-zinc-300"
          >
            <Heart size={18} strokeWidth={1.7} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sand px-1 text-[9px] font-bold text-accent-ink">
              {favoriteCount}
            </span>
          </button>
          <button
            type="button"
            aria-label={`${bagCount} items in bag`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line text-zinc-700 transition hover:border-sand/40 hover:text-sand dark:text-zinc-300"
          >
            <ShoppingBag size={18} strokeWidth={1.7} />
            <span
              className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[9px] font-bold transition-all duration-300 ${
                isBagFlashing
                  ? "scale-125 bg-sand text-accent-ink"
                  : "scale-100 bg-zinc-900 text-white dark:bg-cream dark:text-accent-ink"
              }`}
            >
              {bagCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
