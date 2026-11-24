"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LayoutDashboard, Package, ShieldCheck } from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Analytics", icon: LayoutDashboard },
  { href: "/admin/inventory", label: "Inventory", icon: Package }
];

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`flex shrink-0 items-center justify-center rounded-full border border-[var(--inv-sand)] font-serif text-[var(--inv-sand)] ${
          compact ? "h-9 w-9 text-base" : "h-11 w-11 text-xl"
        }`}
      >
        R
      </span>
      <div className="min-w-0">
        <p
          className={`font-serif leading-none tracking-tight text-[var(--inv-text)] ${
            compact ? "text-[15px]" : "text-[19px]"
          }`}
        >
          Radiant Regalia Collection
        </p>
        <p className="mt-1.5 text-[8px] uppercase tracking-[0.3em] text-[var(--inv-muted)]">
          All under one roof
        </p>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-[var(--inv-border)] bg-[var(--inv-panel)] px-5 py-6 lg:flex">
        <Brand />

        <div className="mt-9 flex items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-[var(--inv-muted)]">
          <ShieldCheck size={13} className="text-[var(--inv-sand)]" />
          Admin workspace
        </div>

        <nav className="mt-4 flex flex-col gap-2" aria-label="Admin navigation">
          {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                prefetch={true}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                  active
                    ? "border-[var(--inv-sand)] bg-[var(--inv-sand-soft)] text-[var(--inv-text)]"
                    : "border-transparent text-[var(--inv-muted)] hover:border-[var(--inv-border)] hover:text-[var(--inv-text)]"
                }`}
              >
                <Icon size={17} strokeWidth={1.7} className={active ? "text-[var(--inv-sand)]" : ""} />
                <span className="flex-1 tracking-wide">{label}</span>
                {active ? <span className="h-1.5 w-1.5 rounded-full bg-[var(--inv-sand)]" /> : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-[var(--inv-border)] pt-6">
          <p className="text-[9px] uppercase tracking-[0.24em] text-[var(--inv-muted)]">
            Atelier operations
          </p>
          <p className="mt-3 font-serif text-lg leading-tight text-[var(--inv-text)]">
            Curated pieces,
            <br />
            <span className="text-[var(--inv-sand)]">one quiet workspace.</span>
          </p>
          <Link
            href="/"
            prefetch={true}
            className="mt-5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-muted)] transition hover:text-[var(--inv-sand)]"
          >
            View storefront
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </aside>

      <div className="sticky top-0 z-30 border-b border-[var(--inv-border)] bg-[var(--inv-panel)] lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Brand compact />
          <Link
            href="/"
            prefetch={true}
            className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--inv-border)] px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--inv-muted)] transition hover:border-[var(--inv-sand)] hover:text-[var(--inv-sand)]"
          >
            Store
            <ArrowUpRight size={12} />
          </Link>
        </div>
        <nav className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 sm:px-6" aria-label="Admin navigation">
          {ADMIN_NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                prefetch={true}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[11px] transition ${
                  active
                    ? "border-[var(--inv-sand)] bg-[var(--inv-sand-soft)] text-[var(--inv-text)]"
                    : "border-[var(--inv-border)] text-[var(--inv-muted)]"
                }`}
              >
                <Icon size={14} strokeWidth={1.7} className={active ? "text-[var(--inv-sand)]" : ""} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
