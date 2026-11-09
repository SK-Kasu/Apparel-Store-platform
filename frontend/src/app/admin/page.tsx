import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  LayoutDashboard,
  Package,
  ShieldCheck,
  ShoppingBag,
  Users
} from "lucide-react";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-session";

export const metadata: Metadata = {
  title: "Admin Console"
};

const overview = [
  { label: "Catalog pieces", value: "128", icon: Package },
  { label: "Open orders", value: "24", icon: ShoppingBag },
  { label: "Customers", value: "1,480", icon: Users }
];

export default async function AdminPage() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ink text-zinc-100">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(212,163,115,0.16),transparent_65%)]" />

      <header className="relative border-b border-white/[0.07] bg-[#121212]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-sand/40 font-serif text-xl text-sand">
              R
            </span>
            <div>
              <p className="font-serif text-xl leading-none tracking-tight text-cream">
                Radiant Regalia Collection
              </p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-zinc-500">
                All under one roof
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex h-10 items-center gap-2 rounded-full border border-white/[0.1] px-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:border-sand/50 hover:text-sand"
            >
              Storefront
              <ArrowUpRight size={14} />
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.26em] text-sand">
          <ShieldCheck size={14} />
          Administrator access verified
        </div>
        <h1 className="mt-4 font-serif text-5xl leading-[0.95] tracking-tight text-cream sm:text-6xl">
          Atelier
          <br />
          <span className="text-sand-soft">control room</span>
        </h1>
        <p className="mt-5 max-w-xl font-serif text-lg italic leading-relaxed text-zinc-400">
          Signed in as {session.email}. Manage the collection, review orders, and keep the
          house running from one quiet workspace.
        </p>

        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          {overview.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-white/[0.07] bg-panel p-5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-sand/25 bg-sand/[0.06] text-sand">
                  <Icon size={17} strokeWidth={1.6} />
                </span>
                <ArrowUpRight size={15} className="text-zinc-600" />
              </div>
              <p className="mt-8 font-serif text-4xl text-cream">{value}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-zinc-500">
                {label}
              </p>
            </div>
          ))}
        </div>

        <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/[0.07] bg-panel">
          <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={16} className="text-sand" />
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-cream">
                Workspace overview
              </h2>
            </div>
            <span className="rounded-full border border-sand/25 bg-sand/[0.06] px-3 py-1.5 text-[8px] uppercase tracking-[0.2em] text-sand">
              Live
            </span>
          </div>
          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-3">
            {["Inventory sync", "Order pipeline", "Customer care"].map((item) => (
              <div key={item} className="bg-panel px-5 py-8">
                <p className="text-sm text-cream">{item}</p>
                <p className="mt-2 text-[10px] leading-relaxed text-zinc-500">
                  Operational controls are ready for the next production pass.
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
