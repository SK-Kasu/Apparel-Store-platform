"use client";

import { useState } from "react";
import { MobileNav, Sidebar, type Department } from "@/components/sidebar";
import { ProductHero } from "@/components/product-hero";
import { Recommendations } from "@/components/recommendations";
import { TopBar } from "@/components/top-bar";
import { TrustBanner } from "@/components/trust-banner";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Outerwear");
  const [department, setDepartment] = useState<Department>("Women");
  const [selectedColor, setSelectedColor] = useState("Beige");
  const [selectedSize, setSelectedSize] = useState("M");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [bagCount, setBagCount] = useState(0);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addToBag = () => {
    setBagCount((count) => count + 1);
  };

  return (
    <div className="min-h-screen bg-ink text-zinc-100">
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        department={department}
        onSelectDepartment={setDepartment}
      />

      <div className="lg:pl-[280px]">
        <TopBar favoriteCount={favoriteIds.size} bagCount={bagCount} />
        <MobileNav activeCategory={activeCategory} onSelectCategory={setActiveCategory} />

        <main className="mx-auto w-full max-w-[1480px] px-4 pb-10 pt-5 sm:px-6 lg:px-8 xl:px-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-600">
              {department} / {activeCategory} / Trench
            </p>
            <p className="hidden text-[9px] uppercase tracking-[0.28em] text-zinc-600 sm:block">
              Complimentary shipping over $100
            </p>
          </div>

          <ProductHero
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            isFavorite={favoriteIds.has("hero-trench")}
            onSelectColor={setSelectedColor}
            onSelectSize={setSelectedSize}
            onToggleFavorite={() => toggleFavorite("hero-trench")}
            onAddToBag={addToBag}
          />

          <Recommendations
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onAddToBag={addToBag}
          />

          <TrustBanner />

          <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-[9px] uppercase tracking-[0.22em] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>Daylog Studio — Modern essentials</p>
            <p>Designed in Copenhagen · Shipped worldwide</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
