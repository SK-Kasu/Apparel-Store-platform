import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Package, ShoppingBag, Users, Wallet } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";

export const metadata: Metadata = {
  title: "Analytics | Radiant Regalia Collection"
};

const OVERVIEW = [
  { label: "Catalog pieces", value: "128", icon: Package, note: "Across all tenants" },
  { label: "Open orders", value: "24", icon: ShoppingBag, note: "Awaiting fulfilment" },
  { label: "Customers", value: "1,480", icon: Users, note: "Registered accounts" },
  { label: "Revenue", value: "KSh 1.24M", icon: Wallet, note: "Current quarter" }
];

export default function AdminPage() {
  return (
    <div className="admin-shell min-h-screen">
      <AdminSidebar />

      <div className="lg:pl-[280px]">
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[var(--inv-sand)]">
            Admin console
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-none tracking-tight text-[var(--inv-text)] sm:text-6xl">
            Analytics
          </h1>
          <p className="mt-4 max-w-xl font-serif text-lg italic leading-relaxed text-[var(--inv-muted)]">
            A quiet overview of the atelier: catalog health, order flow, and the pieces moving
            through the house.
          </p>

          <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Overview">
            {OVERVIEW.map(({ label, value, icon: Icon, note }) => (
              <article
                key={label}
                className="rounded-[1.5rem] border border-[var(--inv-border)] bg-[var(--inv-panel)] p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--inv-sand)] bg-[var(--inv-sand-soft)] text-[var(--inv-sand)]">
                  <Icon size={17} strokeWidth={1.7} />
                </span>
                <p className="mt-7 font-serif text-4xl text-[var(--inv-text)]">{value}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-[var(--inv-muted)]">
                  {label}
                </p>
                <p className="mt-3 text-[11px] text-[var(--inv-muted)]">{note}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-[var(--inv-border)] bg-[var(--inv-panel)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--inv-border)] px-5 py-4">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-[var(--inv-sand)]" />
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--inv-text)]">
                  Workspace shortcuts
                </h2>
              </div>
              <span className="rounded-full border border-[var(--inv-sand)] bg-[var(--inv-sand-soft)] px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-[var(--inv-sand)]">
                Ready
              </span>
            </div>
            <div className="grid gap-px bg-[var(--inv-border)] sm:grid-cols-2">
              <Link
                href="/admin/inventory"
                className="group flex items-center justify-between gap-4 bg-[var(--inv-panel)] px-5 py-8 transition hover:bg-[var(--inv-panel-soft)]"
              >
                <div>
                  <p className="font-serif text-xl text-[var(--inv-text)]">Inventory management</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-[var(--inv-muted)]">
                    Add regalia, adjust stock levels, and retire pieces that have left the collection.
                  </p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 text-[var(--inv-sand)] transition group-hover:translate-x-0.5"
                />
              </Link>
              <div className="bg-[var(--inv-panel)] px-5 py-8">
                <p className="font-serif text-xl text-[var(--inv-text)]">Order pipeline</p>
                <p className="mt-2 text-[11px] leading-relaxed text-[var(--inv-muted)]">
                  Fulfilment controls arrive with the next operations pass.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
