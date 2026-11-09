"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Moon,
  Receipt,
  ShoppingBag,
  Store,
  Sun,
  TrendingUp,
  Wallet,
  type LucideIcon
} from "lucide-react";

type AnalyticsSummary = {
  grossRevenue: number;
  totalOrderVolume: number;
  paidOrderVolume: number;
  unpaidOrderVolume: number;
  averageOrderValue: number;
};

type RevenueByTenant = {
  tenantId: string;
  businessName: string;
  slug: string | null;
  grossRevenue: number;
  orderCount: number;
  averageOrderValue: number;
};

type VariantDistribution = {
  color: string;
  size: string;
  unitsSold: number;
  orderCount: number;
  revenue: number;
};

type AnalyticsPayload = {
  generatedAt: string;
  currency: string;
  summary: AnalyticsSummary;
  revenueByTenant: RevenueByTenant[];
  variantDistribution: VariantDistribution[];
};

type TransactionStatus = "PAID" | "FULFILLED";

type Transaction = {
  id: string;
  tenant: string;
  timestamp: string;
  sku: string;
  subtotal: number;
  status: TransactionStatus;
};

const KES_PER_USD = 129.5;
const CHART_WIDTH = 640;
const CHART_HEIGHT = 250;
const CHART_PADDING = 28;

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const REVENUE_SERIES = [612000, 704000, 668000, 812000, 905000, 878000, 1094000, 1240500];

const FALLBACK_SUMMARY: AnalyticsSummary = {
  grossRevenue: 1240500,
  totalOrderVolume: 3842,
  paidOrderVolume: 3610,
  unpaidOrderVolume: 232,
  averageOrderValue: 3228
};

const FALLBACK_VARIANTS: VariantDistribution[] = [
  { color: "Onyx Black", size: "L", unitsSold: 412, orderCount: 318, revenue: 384000 },
  { color: "Sand", size: "M", unitsSold: 356, orderCount: 271, revenue: 318000 },
  { color: "Ivory", size: "S", unitsSold: 304, orderCount: 244, revenue: 276000 },
  { color: "Camel", size: "L", unitsSold: 261, orderCount: 208, revenue: 238000 },
  { color: "Charcoal", size: "M", unitsSold: 214, orderCount: 176, revenue: 194000 },
  { color: "Olive", size: "XL", unitsSold: 168, orderCount: 132, revenue: 151000 }
];

const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: "a3f1c2e8-7b4d-4c1a-9f2e-8d6b5a4c3e21",
    tenant: "Aura Boutique",
    timestamp: "Nov 09, 2026 · 14:32 EAT",
    sku: "ONX-BLK-L",
    subtotal: 12480,
    status: "PAID"
  },
  {
    id: "c7d2e9f4-1a6b-4e8c-b3d5-9f0a2c4e6b18",
    tenant: "Nairobi Atelier",
    timestamp: "Nov 09, 2026 · 13:48 EAT",
    sku: "SND-IVY-M",
    subtotal: 18900,
    status: "FULFILLED"
  },
  {
    id: "e5b8a1d3-6c2f-4a7e-8d9b-3f1c5e7a2b46",
    tenant: "Savannah Threads",
    timestamp: "Nov 09, 2026 · 12:15 EAT",
    sku: "CML-GPH-XL",
    subtotal: 24600,
    status: "PAID"
  },
  {
    id: "b9f4d6c2-8e1a-4b3d-9c7f-2a5e8d1b4c63",
    tenant: "Kilimani Muse",
    timestamp: "Nov 09, 2026 · 11:04 EAT",
    sku: "OLV-CHK-S",
    subtotal: 9600,
    status: "FULFILLED"
  },
  {
    id: "d1a7c3e9-5b8f-4c2a-a6d4-7e9b1f3c5a82",
    tenant: "Mombasa Edit",
    timestamp: "Nov 09, 2026 · 09:51 EAT",
    sku: "ONX-SND-M",
    subtotal: 15750,
    status: "PAID"
  },
  {
    id: "f2c8b5d1-9a3e-4f7c-b1d6-8e4a2c9f6b37",
    tenant: "Aura Boutique",
    timestamp: "Nov 08, 2026 · 18:22 EAT",
    sku: "IVY-CML-L",
    subtotal: 21300,
    status: "FULFILLED"
  }
];

const statusStyles: Record<TransactionStatus, string> = {
  PAID: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  FULFILLED: "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
};

const numberFormatter = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 });

function toKes(value: number, currency?: string) {
  const normalized = currency?.toUpperCase() === "USD" ? value * KES_PER_USD : value;
  return Math.round(normalized);
}

function formatKsh(value: number) {
  return `KSh ${numberFormatter.format(Math.round(value))}`;
}

function buildChart(values: number[], width: number, height: number, padding: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / (values.length - 1);

  const points = values.map((value, index) => ({
    x: padding + index * stepX,
    y: padding + (1 - (value - min) / range) * (height - padding * 2)
  }));

  const line = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    }

    const previous = points[index - 1];
    const controlX = previous.x + (point.x - previous.x) / 2;

    return `${path} C ${controlX.toFixed(2)} ${previous.y.toFixed(2)}, ${controlX.toFixed(2)} ${point.y.toFixed(2)}, ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }, "");

  const baseline = height - padding;
  const area = `${line} L ${points[points.length - 1].x.toFixed(2)} ${baseline} L ${points[0].x.toFixed(2)} ${baseline} Z`;

  return { line, area, points };
}

const GRID_Y = [0.2, 0.4, 0.6, 0.8].map(
  (fraction) => CHART_PADDING + fraction * (CHART_HEIGHT - CHART_PADDING * 2)
);

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  trend?: string;
};

function MetricCard({ label, value, detail, icon: Icon, trend }: MetricCardProps) {
  return (
    <article className="group rounded-2xl border border-zinc-200 bg-zinc-100 p-6 shadow-sm transition-all duration-300 hover:border-sand/40 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sand shadow-sm transition-transform duration-300 group-hover:scale-105 dark:bg-zinc-800">
          <Icon className="h-4 w-4" />
        </span>
      </div>

      <p className="mt-5 font-serif text-3xl tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {trend ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </span>
        ) : null}
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{detail}</span>
      </div>
    </article>
  );
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics?limit=6", {
          signal: controller.signal,
          headers: { Accept: "application/json" }
        });

        if (!response.ok) {
          throw new Error(`Analytics request failed with ${response.status}`);
        }

        const payload = (await response.json()) as AnalyticsPayload;
        setAnalytics(payload);
        setIsLive(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setIsLive(false);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadAnalytics();

    return () => controller.abort();
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");

    root.classList.toggle("dark", !isDark);
    root.classList.toggle("light", isDark);
  };

  const summary = analytics?.summary;
  const currency = analytics?.currency;
  const grossRevenue = toKes(summary?.grossRevenue ?? FALLBACK_SUMMARY.grossRevenue, currency);
  const totalOrders = summary?.totalOrderVolume ?? FALLBACK_SUMMARY.totalOrderVolume;
  const averageOrderValue = toKes(
    summary?.averageOrderValue ?? FALLBACK_SUMMARY.averageOrderValue,
    currency
  );

  const apiTenants = analytics?.revenueByTenant;
  const tenantCount = apiTenants && apiTenants.length > 0 ? apiTenants.length : 24;

  const apiVariants = analytics?.variantDistribution;
  const variantRows = (
    apiVariants && apiVariants.length > 0 ? apiVariants : FALLBACK_VARIANTS
  ).slice(0, 6);
  const maxUnits = Math.max(...variantRows.map((variant) => variant.unitsSold), 1);

  const chartValues =
    summary?.grossRevenue !== undefined
      ? REVENUE_SERIES.map((value) =>
          Math.round(value * (grossRevenue / REVENUE_SERIES[REVENUE_SERIES.length - 1]))
        )
      : REVENUE_SERIES;
  const chart = buildChart(chartValues, CHART_WIDTH, CHART_HEIGHT, CHART_PADDING);
  const peakRevenue = Math.max(...chartValues);

  const generatedAt = analytics?.generatedAt ? new Date(analytics.generatedAt) : null;
  const updatedLabel =
    generatedAt && !Number.isNaN(generatedAt.getTime())
      ? generatedAt.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })
      : "Preview snapshot";

  return (
    <div className="animate-fade-in min-h-screen bg-ink text-zinc-900 transition-colors duration-300 dark:text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-line bg-[#f9f6f0]/85 backdrop-blur-xl dark:bg-[#121212]/85">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-sand/30 bg-sand/10 font-serif text-lg text-sand transition-colors group-hover:bg-sand/20">
              RR
            </span>
            <span>
              <span className="block font-serif text-xl tracking-tight text-cream">
                Radiant Regalia
              </span>
              <span className="block text-[9px] uppercase tracking-[0.32em] text-sand">
                Admin Console
              </span>
            </span>
          </Link>

          <nav
            aria-label="Admin sections"
            className="hidden items-center gap-1 rounded-full border border-line bg-white/60 p-1 dark:bg-zinc-900/60 md:flex"
          >
            <span className="rounded-full bg-sand px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-ink">
              Overview
            </span>
            <span className="rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              Tenants
            </span>
            <span className="rounded-full px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
              Orders
            </span>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-line bg-white/60 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-muted dark:bg-zinc-900/60 sm:inline-flex">
              <Activity className="h-3.5 w-3.5 text-sand" />
              {isLoading ? "Syncing" : isLive ? "Live data" : "Preview data"}
            </span>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle light and dark theme"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/60 text-muted transition-colors hover:border-sand/40 hover:text-sand dark:bg-zinc-900/60"
            >
              <Sun className="hidden h-4 w-4 dark:block" />
              <Moon className="h-4 w-4 dark:hidden" />
            </button>

            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white/60 px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:border-sand/40 hover:text-sand dark:bg-zinc-900/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1480px] px-4 pb-12 pt-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted">
              <BarChart3 className="h-3.5 w-3.5 text-sand" />
              Analytics overview
            </div>
            <h1 className="mt-3 font-serif text-4xl tracking-tight text-cream sm:text-5xl">
              Store performance
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              A live read on gross revenue, order health, and the variant velocity moving across
              every boutique on the network.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {isLoading
              ? "Connecting to /api/analytics"
              : isLive
                ? `Updated ${updatedLabel}`
                : "Preview snapshot · API offline"}
          </div>
        </div>

        <section className="mb-8 mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Gross Revenue"
            value={formatKsh(grossRevenue)}
            detail="this month"
            trend="+14.2%"
            icon={Wallet}
          />
          <MetricCard
            label="Total Orders"
            value={numberFormatter.format(totalOrders)}
            detail="fulfilled orders"
            icon={ShoppingBag}
          />
          <MetricCard
            label="Average Order Value"
            value={formatKsh(averageOrderValue)}
            detail="per paid order"
            icon={Receipt}
          />
          <MetricCard
            label="Active Apparel Tenants"
            value={`${tenantCount} Stores`}
            detail="live on the network"
            icon={Store}
          />
        </section>

        <section className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-zinc-200 bg-zinc-100 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-sand">
                  Revenue telemetry
                </p>
                <h2 className="mt-2 font-serif text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">
                  Monthly sales volume
                </h2>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Gross merchandise value · KSh
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" />
                +14.2% MoM
              </span>
            </div>

            <div className="mt-6">
              <svg
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                role="img"
                aria-label="Monthly gross revenue trend"
                className="h-auto w-full overflow-visible"
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A373" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#D4A373" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <g className="text-zinc-200 dark:text-zinc-800">
                  {GRID_Y.map((y) => (
                    <line
                      key={y}
                      x1={CHART_PADDING}
                      x2={CHART_WIDTH - CHART_PADDING}
                      y1={y}
                      y2={y}
                      stroke="currentColor"
                      strokeDasharray="4 8"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>

                <path d={chart.area} fill="url(#revenueGradient)" />
                <path
                  d={chart.line}
                  className="fill-none stroke-[#D4A373] stroke-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />

                {chart.points.map((point, index) => (
                  <circle
                    key={`${point.x}-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r={index === chart.points.length - 1 ? 4 : 2.5}
                    className="fill-[#D4A373]"
                  />
                ))}
              </svg>

              <div className="mt-3 flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
                {MONTHS.map((month) => (
                  <span key={month} className="flex-1 text-center">
                    {month}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Peak month</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {formatKsh(peakRevenue)} · Nov
              </span>
            </div>
          </article>

          <article className="rounded-2xl border border-zinc-200 bg-zinc-100 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-sand">
                  Variant matrix
                </p>
                <h2 className="mt-2 font-serif text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">
                  Inventory velocity
                </h2>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Top size and colour combinations by units sold
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/60 px-3 py-1.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
                <Activity className="h-3.5 w-3.5 text-sand" />
                Top {variantRows.length}
              </span>
            </div>

            <div className="mt-7 space-y-5">
              {variantRows.map((variant) => {
                const share = Math.max(8, Math.round((variant.unitsSold / maxUnits) * 100));

                return (
                  <div key={`${variant.color}-${variant.size}`} className="space-y-2">
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="font-medium text-zinc-800 dark:text-zinc-100">
                        {variant.color} — {variant.size}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                        {numberFormatter.format(variant.unitsSold)} units
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className="h-3 w-[var(--bar-width)] rounded-full bg-[#D4A373] transition-[width] duration-700 ease-out"
                        style={{ "--bar-width": `${share}%` } as CSSProperties}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-4 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Highest velocity</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {variantRows[0]
                  ? `${variantRows[0].color} — ${variantRows[0].size}`
                  : "—"}
              </span>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line p-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-sand">
                Recent transactions
              </p>
              <h2 className="mt-2 font-serif text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">
                Boutique ledger
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Multi-tenant checkout audit trail
              </p>
            </div>
            <span className="rounded-full border border-line bg-white/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
              Last {RECENT_TRANSACTIONS.length} checkouts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[9px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  <th scope="col" className="px-6 py-4 font-medium">
                    Order UUID
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Boutique tenant
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Purchased
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Variant SKU
                  </th>
                  <th scope="col" className="px-6 py-4 text-right font-medium">
                    Subtotal
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {RECENT_TRANSACTIONS.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition-colors duration-200 hover:bg-white/60 dark:hover:bg-zinc-800/40"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {transaction.tenant}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      {transaction.timestamp}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                      {transaction.sku}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-zinc-900 dark:text-zinc-100">
                      {formatKsh(transaction.subtotal)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${statusStyles[transaction.status]}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          <span>Radiant Regalia · Admin analytics</span>
          <span>Figures normalized to KSh · {isLive ? "API connected" : "Preview dataset"}</span>
        </footer>
      </main>
    </div>
  );
}
