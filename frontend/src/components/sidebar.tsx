"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  ChevronRight,
  Footprints,
  Gem,
  Layers,
  PersonStanding,
  Ruler,
  Shirt,
  ShoppingBag,
  Sparkles,
  X
} from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import { useStore } from "@/lib/store-context";

export type Department = "Women" | "Men";

type NavItem = {
  slug: string;
  label: string;
  icon: LucideIcon;
};

const ICONS: Record<string, LucideIcon> = {
  "new-in": Sparkles,
  dresses: PersonStanding,
  tops: Shirt,
  outerwear: Layers,
  pants: Ruler,
  shoes: Footprints,
  bags: ShoppingBag,
  accessories: Gem
};

export const NAV_ITEMS: NavItem[] = CATEGORIES.map(({ slug, label }) => ({
  slug,
  label,
  icon: ICONS[slug] ?? Sparkles
}));

function isActivePath(pathname: string, slug: string): boolean {
  return pathname === `/shop/${slug}` || pathname.startsWith(`/shop/${slug}/`);
}

function Brand() {
  return (
    <Link
      href="/"
      prefetch={true}
      className="flex items-center gap-3 px-1"
      aria-label="Radiant Regalia Collection home"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sand/40 font-serif text-xl text-sand">
        R
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-[19px] leading-[1.03] tracking-tight text-cream">
          Radiant Regalia <span className="text-sand-soft">Collection</span>
        </span>
        <span className="mt-1.5 block text-[8px] uppercase tracking-[0.32em] text-zinc-500">
          All under one roof
        </span>
      </span>
    </Link>
  );
}

function DepartmentToggle() {
  const [department, setDepartment] = useState<Department>("Women");

  return (
    <div className="flex rounded-full border border-white/[0.08] bg-black/20 p-1">
      {(["Women", "Men"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setDepartment(option)}
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
  );
}

function CategoryLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1.5" aria-label="Shop categories">
      {NAV_ITEMS.map(({ slug, label, icon: Icon }) => {
        const active = isActivePath(pathname, slug);

        return (
          <Link
            key={slug}
            href={`/shop/${slug}`}
            prefetch={true}
            onClick={onNavigate}
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
          </Link>
        );
      })}
    </nav>
  );
}

function PromoCard({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/shop/new-in"
      prefetch={true}
      onClick={onNavigate}
      aria-label="Explore the Spring Collection"
      className="group relative block overflow-hidden rounded-2xl border border-sand/15 bg-[#1C1916] p-5 transition hover:border-sand/35"
    >
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
      <span className="relative mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-sand/40 text-sand transition group-hover:bg-sand group-hover:text-ink">
        <ChevronRight size={17} />
      </span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-white/[0.06] bg-[#151515] px-5 py-6 lg:flex">
      <Brand />

      <div className="mt-8">
        <DepartmentToggle />
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        <CategoryLinks />

        <div className="mt-auto pt-8">
          <PromoCard />
          <p className="mt-5 px-1 text-[9px] uppercase tracking-[0.22em] text-zinc-600">
            © 2026 Radiant Regalia Collection
          </p>
        </div>
      </div>
    </aside>
  );
}

export function MobileMenu() {
  const { menuOpen, setMenuOpen } = useStore();
  const close = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, setMenuOpen]);

  return (
    <div
      className={`fixed inset-0 z-[65] lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!menuOpen}
    >
      <button
        type="button"
        tabIndex={menuOpen ? 0 : -1}
        aria-label="Close menu"
        onClick={close}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Store menu"
        className={`absolute left-0 top-0 flex h-full w-[86%] max-w-[340px] flex-col border-r border-white/10 bg-[#151515] px-5 py-6 shadow-2xl transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <Brand />
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-sand/50 hover:text-sand"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-7">
          <DepartmentToggle />
        </div>

        <div className="mt-7 flex flex-1 flex-col overflow-y-auto">
          <CategoryLinks onNavigate={close} />

          <div className="mt-8 space-y-3">
            <PromoCard onNavigate={close} />
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/track-order"
                prefetch={true}
                onClick={close}
                className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/10 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400 transition hover:border-sand/50 hover:text-sand"
              >
                Track order
                <ArrowUpRight size={12} />
              </Link>
              <Link
                href="/admin"
                prefetch={true}
                onClick={close}
                className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-white/10 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400 transition hover:border-sand/50 hover:text-sand"
              >
                Admin
                <ArrowUpRight size={12} />
              </Link>
            </div>
            <Link
              href="/contact"
              prefetch={true}
              onClick={close}
              className="flex h-11 items-center justify-center rounded-full border border-white/10 text-[9px] font-semibold uppercase tracking-[0.16em] text-zinc-400 transition hover:border-sand/50 hover:text-sand"
            >
              Contact us
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
