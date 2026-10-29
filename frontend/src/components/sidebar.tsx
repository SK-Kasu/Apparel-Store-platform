"use client";

import type { LucideIcon } from "lucide-react";
import {
  ChevronRight,
  Footprints,
  Gem,
  Layers,
  PersonStanding,
  Ruler,
  Shirt,
  ShoppingBag,
  Sparkles
} from "lucide-react";

export type Department = "Women" | "Men";

type NavItem = {
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "New In", icon: Sparkles },
  { label: "Dresses", icon: PersonStanding },
  { label: "Tops", icon: Shirt },
  { label: "Outerwear", icon: Layers },
  { label: "Pants", icon: Ruler },
  { label: "Shoes", icon: Footprints },
  { label: "Bags", icon: ShoppingBag },
  { label: "Accessories", icon: Gem }
];

type NavigationProps = {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  department: Department;
  onSelectDepartment: (department: Department) => void;
};

export function Sidebar({
  activeCategory,
  onSelectCategory,
  department,
  onSelectDepartment
}: NavigationProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-white/[0.06] bg-[#151515] px-5 py-6 lg:flex">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sand/40 font-serif text-xl text-sand">
          D
        </div>
        <div>
          <p className="font-serif text-[28px] leading-none tracking-tight text-cream">Daylog</p>
          <p className="mt-1 text-[8px] uppercase tracking-[0.38em] text-zinc-500">Atelier</p>
        </div>
      </div>

      <div className="mt-8 flex rounded-full border border-white/[0.08] bg-black/20 p-1">
        {(["Women", "Men"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelectDepartment(option)}
            aria-pressed={department === option}
            className={`flex-1 rounded-full py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] transition ${
              department === option
                ? "bg-sand text-ink shadow-sm"
                : "text-zinc-500 hover:text-zinc-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1.5" aria-label="Shop categories">
        {NAV_ITEMS.map(({ label, icon: Icon }) => {
          const active = activeCategory === label;

          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelectCategory(label)}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-full px-4 py-3 text-left text-sm transition ${
                active
                  ? "border border-sand/60 bg-sand/10 text-cream shadow-[inset_0_0_0_1px_rgba(212,163,115,0.08)]"
                  : "border border-transparent text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
              }`}
            >
              <Icon
                size={17}
                strokeWidth={1.6}
                className={active ? "text-sand" : "text-zinc-500 group-hover:text-zinc-300"}
              />
              <span className="flex-1 tracking-wide">{label}</span>
              {active ? <span className="h-1.5 w-1.5 rounded-full bg-sand" /> : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div className="relative overflow-hidden rounded-2xl border border-sand/15 bg-[#1C1916] p-5">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sand/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-full border border-sand/10" />
          <p className="relative text-[9px] uppercase tracking-[0.3em] text-sand">
            Spring Collection
          </p>
          <h2 className="relative mt-3 font-serif text-[26px] leading-[1.05] text-cream">
            The soft
            <br />
            tailoring edit
          </h2>
          <button
            type="button"
            aria-label="Explore the Spring Collection"
            className="relative mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-sand/40 text-sand transition hover:bg-sand hover:text-ink"
          >
            <ChevronRight size={17} />
          </button>
        </div>
        <p className="mt-5 px-1 text-[9px] uppercase tracking-[0.22em] text-zinc-600">
          © 2026 Daylog Studio
        </p>
      </div>
    </aside>
  );
}

export function MobileNav({ activeCategory, onSelectCategory }: Pick<NavigationProps, "activeCategory" | "onSelectCategory">) {
  return (
    <nav
      className="flex gap-2 overflow-x-auto border-b border-white/[0.06] px-4 py-3 no-scrollbar lg:hidden"
      aria-label="Shop categories"
    >
      {NAV_ITEMS.map(({ label, icon: Icon }) => {
        const active = activeCategory === label;

        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelectCategory(label)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] transition ${
              active
                ? "border-sand/60 bg-sand/10 text-cream"
                : "border-white/[0.07] text-zinc-500"
            }`}
          >
            <Icon size={14} strokeWidth={1.7} className={active ? "text-sand" : "text-zinc-500"} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
