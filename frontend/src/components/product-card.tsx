"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import type { Recommendation } from "@/lib/store-data";

type ProductCardProps = {
  product: Recommendation;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToBag: (id: string) => void;
};

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToBag
}: ProductCardProps) {
  return (
    <article className="group min-w-[238px] flex-1 snap-start sm:min-w-[260px]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.06] bg-panel">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 24vw, (min-width: 640px) 45vw, 80vw"
          className="object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-60 transition group-hover:opacity-100" />

        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-label={isFavorite ? `Remove ${product.name} from favorites` : `Save ${product.name}`}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition ${
            isFavorite
              ? "border-sand/60 bg-black/30 text-sand"
              : "border-white/15 bg-black/20 text-cream/80 hover:border-sand/50 hover:text-sand"
          }`}
        >
          <Heart
            size={16}
            strokeWidth={1.7}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>

        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/25 px-2.5 py-1.5 text-[8px] uppercase tracking-[0.2em] text-cream/80 backdrop-blur-md">
            {product.badge}
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => onAddToBag(product.id)}
          className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-cream py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink opacity-0 transition duration-300 hover:bg-sand group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
        >
          Add to bag
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[8px] uppercase tracking-[0.26em] text-zinc-600">{product.category}</p>
          <h3 className="mt-1.5 font-serif text-[21px] leading-tight text-cream">{product.name}</h3>
        </div>
        <p className="pt-4 text-[13px] font-medium tracking-tight text-sand">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </article>
  );
}
