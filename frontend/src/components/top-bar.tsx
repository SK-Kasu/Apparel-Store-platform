"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useStore } from "@/lib/store-context";

export function TopBar() {
  const {
    search,
    setSearch,
    cartCount,
    wishlistProducts,
    setCartOpen,
    setWishlistOpen,
    setMenuOpen
  } = useStore();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#121212]/90 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:px-6 lg:px-10 lg:py-4">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-zinc-300 transition hover:border-sand/40 hover:text-sand lg:hidden"
        >
          <Menu size={19} strokeWidth={1.7} />
        </button>

        <Link
          href="/"
          className="min-w-0 flex-1 lg:hidden"
          aria-label="Radiant Regalia Collection home"
        >
          <p className="truncate font-serif text-[17px] leading-tight tracking-tight text-cream sm:text-lg">
            Radiant Regalia Collection
          </p>
          <p className="mt-0.5 truncate text-[8px] uppercase tracking-[0.3em] text-sand/80">
            All under one roof
          </p>
        </Link>

        <div className="order-last flex w-full items-center gap-3 lg:order-none lg:mx-auto lg:w-auto lg:max-w-2xl lg:flex-1">
          <div className="group flex h-12 flex-1 items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 transition focus-within:border-sand/50 focus-within:bg-white/[0.04] sm:px-5">
            <Search
              size={17}
              strokeWidth={1.7}
              className="shrink-0 text-zinc-500 group-focus-within:text-sand"
            />
            <input
              ref={searchRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the collection"
              aria-label="Search the collection"
              className="w-full min-w-0 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white/[0.06] hover:text-cream"
              >
                <X size={14} />
              </button>
            ) : (
              <kbd className="hidden shrink-0 rounded border border-white/10 px-1.5 py-0.5 text-[10px] tracking-wide text-zinc-600 sm:block">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 lg:ml-0">
          <Link
            href="/admin"
            aria-label="Open admin console"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] text-zinc-300 transition hover:border-sand/40 hover:text-sand"
          >
            <UserRound size={18} strokeWidth={1.7} />
          </Link>
          <button
            type="button"
            onClick={() => setWishlistOpen(true)}
            aria-label={`${wishlistProducts.length} saved items`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] text-zinc-300 transition hover:border-sand/40 hover:text-sand"
          >
            <Heart size={18} strokeWidth={1.7} />
            {wishlistProducts.length > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sand px-1 text-[9px] font-bold text-ink">
                {wishlistProducts.length}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`${cartCount} items in bag`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] text-zinc-300 transition hover:border-sand/40 hover:text-sand"
          >
            <ShoppingBag size={18} strokeWidth={1.7} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cream px-1 text-[9px] font-bold text-ink">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
}
