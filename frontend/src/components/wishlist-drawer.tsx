"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { formatKsh } from "@/lib/catalog";
import { useStore } from "@/lib/store-context";

export function WishlistDrawer() {
  const {
    wishlistProducts,
    wishlistOpen,
    setWishlistOpen,
    toggleWishlist,
    addToCart
  } = useStore();

  useEffect(() => {
    if (!wishlistOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWishlistOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [wishlistOpen, setWishlistOpen]);

  return (
    <div
      className={`fixed inset-0 z-[60] ${
        wishlistOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!wishlistOpen}
    >
      <button
        type="button"
        tabIndex={wishlistOpen ? 0 : -1}
        aria-label="Close wishlist"
        onClick={() => setWishlistOpen(false)}
        className={`absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ${
          wishlistOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Saved items"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#151515] shadow-2xl transition-transform duration-300 ${
          wishlistOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-sand">Your edit</p>
            <h2 className="mt-1 flex items-center gap-2 font-serif text-2xl text-cream">
              Wishlist
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-sans text-zinc-400">
                {wishlistProducts.length}
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setWishlistOpen(false)}
            aria-label="Close wishlist"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-sand/50 hover:text-sand"
          >
            <X size={18} />
          </button>
        </header>

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-500">
              <Heart size={26} />
            </span>
            <h3 className="mt-6 font-serif text-2xl text-cream">Nothing saved yet</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">
              Tap the heart on any piece to keep it here for later.
            </p>
            <Link
              href="/shop/new-in"
              onClick={() => setWishlistOpen(false)}
              className="mt-6 flex h-12 items-center justify-center rounded-full bg-sand px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-[#E0B68E]"
            >
              Browse new in
            </Link>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="space-y-4">
              {wishlistProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3"
                >
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-panel">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[8px] uppercase tracking-[0.22em] text-zinc-600">
                          {product.category}
                        </p>
                        <h3 className="mt-1 truncate font-serif text-lg leading-tight text-cream">
                          {product.name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleWishlist(product.id)}
                        aria-label={`Remove ${product.name} from wishlist`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-600 transition hover:bg-white/[0.05] hover:text-red-300"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <p className="text-sm font-medium text-sand">{formatKsh(product.price)}</p>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-cream transition hover:border-sand/50 hover:text-sand"
                      >
                        <ShoppingBag size={12} />
                        Add to bag
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
