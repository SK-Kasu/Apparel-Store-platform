"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

type RevenuePoint = {
  x: number;
  y: number;
  label: string;
  value: number;
};

type VariantDistribution = {
  color: string;
  size: string;
  unitsSold: number;
  orderCount: number;
  revenue: number;
  percentage: number;
};

type TransactionStatus = "PAID" | "FULFILLED";

type RecentCheckout = {
  id: string;
  tenantId: string;
  tenantName: string;
  createdAt: string;
  sku: string;
  subtotal: number;
  status: TransactionStatus;
};

type AnalyticsData = {
  grossRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  activeTenants: number;
  revenuePoints: RevenuePoint[];
  variantDistribution: VariantDistribution[];
  recentCheckouts: RecentCheckout[];
  generatedAt: string | null;
  isLive: boolean;
  hasLiveCheckouts: boolean;
  revenueMode: "monthly" | "tenant";
};

type ApiSummary = {
  grossRevenue?: number;
  totalOrderVolume?: number;
  averageOrderValue?: number;
};

type ApiRevenueByTenant = {
  tenantId?: string;
  businessName?: string;
  slug?: string | null;
  grossRevenue?: number;
  orderCount?: number;
  averageOrderValue?: number;
};

type ApiVariantDistribution = {
  color?: string;
  size?: string;
  unitsSold?: number;
  orderCount?: number;
  revenue?: number;
  percentage?: number;
};

type ApiRecentCheckout = {
  id?: string;
  orderId?: string;
  tenantId?: string;
  tenantName?: string;
  businessName?: string;
  createdAt?: string;
  timestamp?: string;
  sku?: string;
  variantSku?: string;
  subtotal?: number;
  aggregateTotal?: number;
  status?: string;
  paymentStatus?: string;
};

type ApiRevenuePoint = {
  x?: number;
  y?: number;
  label?: string;
  value?: number;
  month?: string;
  revenue?: number;
};

type ApiAnalyticsPayload = {
  data?: ApiAnalyticsPayload;
  generatedAt?: string;
  currency?: string;
  summary?: ApiSummary;
  grossRevenue?: number;
  totalOrderVolume?: number;
  averageOrderValue?: number;
  activeTenants?: number;
  revenueByTenant?: ApiRevenueByTenant[];
  revenuePoints?: ApiRevenuePoint[];
  monthlyRevenue?: ApiRevenuePoint[];
  variantDistribution?: ApiVariantDistribution[];
  topVariants?: ApiVariantDistribution[];
  recentCheckouts?: ApiRecentCheckout[];
  recentTransactions?: ApiRecentCheckout[];
};

const CHART_WIDTH = 640;
const CHART_HEIGHT = 250;
const CHART_PADDING = 28;

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
const REVENUE_SERIES = [612000, 704000, 668000, 812000, 905000, 878000, 1094000, 1240500];

const FALLBACK_GROSS_REVENUE = 1240500;
const FALLBACK_TOTAL_ORDERS = 3842;
const FALLBACK_AOV = 3228;
const FALLBACK_ACTIVE_TENANTS = 24;

const FALLBACK_VARIANTS: VariantDistribution[] = [
  {
    color: "Onyx Black",
    size: "L",
    unitsSold: 412,
    orderCount: 318,
    revenue: 384000,
    percentage: 100
  },
  {
    color: "Sand",
    size: "M",
    unitsSold: 356,
    orderCount: 271,
    revenue: 318000,
    percentage: 86
  },
  {
    color: "Ivory",
    size: "S",
    unitsSold: 304,
    orderCount: 244,
    revenue: 276000,
    percentage: 74
  },
  {
    color: "Camel",
    size: "L",
    unitsSold: 261,
    orderCount: 208,
    revenue: 238000,
    percentage: 63
  },
  {
    color: "Charcoal",
    size: "M",
    unitsSold: 214,
    orderCount: 176,
    revenue: 194000,
    percentage: 52
  },
  {
    color: "Olive",
    size: "XL",
    unitsSold: 168,
    orderCount: 132,
    revenue: 151000,
    percentage: 41
  }
];

const FALLBACK_CHECKOUTS: RecentCheckout[] = [
  {
    id: "a3f1c2e8-7b4d-4c1a-9f2e-8d6b5a4c3e21",
    tenantId: "aura-boutique",
    tenantName: "Aura Boutique Ltd",
    createdAt: "09 Nov 2026, 14:32",
    sku: "RAD-MFT-BLK-L",
    subtotal: 12480,
    status: "PAID"
  },
  {
    id: "c7d2e9f4-1a6b-4e8c-b3d5-9f0a2c4e6b18",
    tenantId: "vanguard-regalia",
    tenantName: "Vanguard Luxury Regalia",
    createdAt: "09 Nov 2026, 13:48",
    sku: "RAD-HKS-IND-M",
    subtotal: 18900,
    status: "FULFILLED"
  },
  {
    id: "e5b8a1d3-6c2f-4a7e-8d9b-3f1c5e7a2b46",
    tenantId: "aura-boutique",
    tenantName: "Aura Boutique Ltd",
    createdAt: "09 Nov 2026, 12:15",
    sku: "RAD-MFT-CRM-XL",
    subtotal: 24600,
    status: "PAID"
  },
  {
    id: "b9f4d6c2-8e1a-4b3d-9c7f-2a5e8d1b4c63",
    tenantId: "vanguard-regalia",
    tenantName: "Vanguard Luxury Regalia",
    createdAt: "09 Nov 2026, 11:04",
    sku: "RAD-HKS-OFW-L",
    subtotal: 9600,
    status: "FULFILLED"
  },
  {
    id: "d1a7c3e9-5b8f-4c2a-a6d4-7e9b1f3c5a82",
    tenantId: "aura-boutique",
    tenantName: "Aura Boutique Ltd",
    createdAt: "09 Nov 2026, 09:51",
    sku: "RAD-MFT-BLK-M",
    subtotal: 15750,
    status: "PAID"
  },
  {
    id: "f2c8b5d1-9a3e-4f7c-b1d6-8e4a2c9f6b37",
    tenantId: "vanguard-regalia",
    tenantName: "Vanguard Luxury Regalia",
    createdAt: "08 Nov 2026, 18:22",
    sku: "RAD-HKS-IND-XL",
    subtotal: 21300,
    status: "FULFILLED"
  }
];

const kesFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  minimumFractionDigits: 0
});

const numberFormatter = new Intl.NumberFormat("en-KE", {
  maximumFractionDigits: 0
});

function numberOr(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function formatKsh(value: number) {
  return kesFormatter.format(Math.round(value)).replace(/^Ksh\s?/i, "KSh ");
}

function formatCheckoutDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function normalizeStatus(value?: string): TransactionStatus {
  const status = value?.toUpperCase();

  if (status === "FULFILLED" || status === "DELIVERED" || status === "SHIPPED") {
    return "FULFILLED";
  }

  return "PAID";
}

function buildRevenuePoints(values: number[], labels: string[]): RevenuePoint[] {
  if (values.length === 0) {
    return [];
  }

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const usableWidth = CHART_WIDTH - CHART_PADDING * 2;
  const usableHeight = CHART_HEIGHT - CHART_PADDING * 2;
  const stepX = values.length > 1 ? usableWidth / (values.length - 1) : 0;

  return values.map((value, index) => ({
    x: values.length > 1 ? CHART_PADDING + index * stepX : CHART_WIDTH / 2,
    y:
      max === min
        ? CHART_HEIGHT / 2
        : CHART_PADDING + (1 - (value - min) / range) * usableHeight,
    label: labels[index] ?? `M${index + 1}`,
    value
  }));
}

function normalizeRevenuePoints(payload: ApiAnalyticsPayload): {
  points: RevenuePoint[];
  mode: "monthly" | "tenant";
} {
  const apiPoints = payload.revenuePoints ?? payload.monthlyRevenue;

  if (apiPoints && apiPoints.length > 0) {
    const values = apiPoints.map((point) => numberOr(point.value ?? point.revenue, 0));
    const labels = apiPoints.map(
      (point, index) => point.label ?? point.month ?? MONTHS[index] ?? `M${index + 1}`
    );

    return { points: buildRevenuePoints(values, labels), mode: "monthly" };
  }

  const tenants = payload.revenueByTenant;

  if (tenants && tenants.length > 0) {
    const values = tenants.map((tenant) => numberOr(tenant.grossRevenue, 0));
    const labels = tenants.map(
      (tenant, index) => tenant.businessName ?? tenant.slug ?? `Boutique ${index + 1}`
    );

    return { points: buildRevenuePoints(values, labels), mode: "tenant" };
  }

  return { points: buildRevenuePoints(REVENUE_SERIES, MONTHS), mode: "monthly" };
}

function normalizeVariants(rows?: ApiVariantDistribution[]): VariantDistribution[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  const normalized = rows.map((row) => ({
    color: row.color ?? "Unknown",
    size: row.size ?? "—",
    unitsSold: numberOr(row.unitsSold, 0),
    orderCount: numberOr(row.orderCount, 0),
    revenue: numberOr(row.revenue, 0),
    percentage: numberOr(row.percentage, 0)
  }));

  const maxUnits = Math.max(...normalized.map((variant) => variant.unitsSold), 1);

  return normalized
    .map((variant) => ({
      ...variant,
      percentage:
        variant.percentage > 0
          ? Math.min(100, Math.round(variant.percentage))
          : variant.unitsSold > 0
            ? Math.max(4, Math.round((variant.unitsSold / maxUnits) * 100))
            : 0
    }))
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 6);
}

function normalizeCheckouts(
  rows: ApiRecentCheckout[] | undefined,
  tenantNames: Map<string, string>
): RecentCheckout[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.slice(0, 8).map((row, index) => {
    const tenantId = row.tenantId ?? "—";

    return {
      id: row.id ?? row.orderId ?? `checkout-${index + 1}`,
      tenantId,
      tenantName:
        row.tenantName ??
        row.businessName ??
        tenantNames.get(tenantId) ??
        "Unknown boutique",
      createdAt: formatCheckoutDate(row.createdAt ?? row.timestamp),
      sku: row.sku ?? row.variantSku ?? "—",
      subtotal: numberOr(row.subtotal ?? row.aggregateTotal, 0),
      status: normalizeStatus(row.status ?? row.paymentStatus)
    };
  });
}

function normalizeAnalytics(payload: ApiAnalyticsPayload): AnalyticsData {
  const source = payload.data ?? payload;
  const tenants = source.revenueByTenant ?? [];
  const tenantNames = new Map<string, string>();

  for (const tenant of tenants) {
    if (tenant.tenantId) {
      tenantNames.set(
        tenant.tenantId,
        tenant.businessName ?? tenant.slug ?? "Unknown boutique"
      );
    }
  }

  const { points, mode } = normalizeRevenuePoints(source);
  const variants = normalizeVariants(source.variantDistribution ?? source.topVariants);
  const checkouts = normalizeCheckouts(
    source.recentCheckouts ?? source.recentTransactions,
    tenantNames
  );

  return {
    grossRevenue: numberOr(
      source.grossRevenue ?? source.summary?.grossRevenue,
      FALLBACK_GROSS_REVENUE
    ),
    totalOrders: numberOr(
      source.totalOrderVolume ?? source.summary?.totalOrderVolume,
      FALLBACK_TOTAL_ORDERS
    ),
    averageOrderValue: numberOr(
      source.averageOrderValue ?? source.summary?.averageOrderValue,
      FALLBACK_AOV
    ),
    activeTenants:
      source.activeTenants ??
      (source.revenueByTenant ? source.revenueByTenant.length : FALLBACK_ACTIVE_TENANTS),
    revenuePoints: points,
    variantDistribution: variants.length > 0 ? variants : FALLBACK_VARIANTS,
    recentCheckouts: checkouts.length > 0 ? checkouts : FALLBACK_CHECKOUTS,
    generatedAt: source.generatedAt ?? null,
    isLive: true,
    hasLiveCheckouts: checkouts.length > 0,
    revenueMode: mode
  };
}

const FALLBACK_ANALYTICS: AnalyticsData = {
  grossRevenue: FALLBACK_GROSS_REVENUE,
  totalOrders: FALLBACK_TOTAL_ORDERS,
  averageOrderValue: FALLBACK_AOV,
  activeTenants: FALLBACK_ACTIVE_TENANTS,
  revenuePoints: buildRevenuePoints(REVENUE_SERIES, MONTHS),
  variantDistribution: FALLBACK_VARIANTS,
  recentCheckouts: FALLBACK_CHECKOUTS,
  generatedAt: null,
  isLive: false,
  hasLiveCheckouts: false,
  revenueMode: "monthly"
};

const statusStyles: Record<TransactionStatus, string> = {
  PAID: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-300",
  FULFILLED:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
};

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

function DashboardSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading analytics dashboard</span>

      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-sand/30 border-t-sand"
        />
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted">
          Loading live analytics
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-3 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-12 w-72 max-w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-44 rounded-2xl border border-zinc-200 bg-zinc-100 p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div className="h-2.5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="mt-6 h-9 w-36 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-4 h-3 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="h-[430px] animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />
        <div className="h-[430px] animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />
      </div>

      <div className="mt-8 h-[420px] animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900" />
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics?limit=8", {
          signal: controller.signal,
          headers: { Accept: "application/json" },
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error(`Analytics request failed with ${response.status}`);
        }

        const payload = (await response.json()) as ApiAnalyticsPayload;
        setAnalyticsData(normalizeAnalytics(payload));
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setAnalyticsData(FALLBACK_ANALYTICS);
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

  const data = analyticsData ?? FALLBACK_ANALYTICS;

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");

    root.classList.toggle("dark", !isDark);
    root.classList.toggle("light", isDark);
  };

  const revenueLinePoints = data.revenuePoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");

  const revenueAreaPoints =
    data.revenuePoints.length > 0
      ? [
          `${data.revenuePoints[0].x},${CHART_HEIGHT - CHART_PADDING}`,
          revenueLinePoints,
          `${data.revenuePoints[data.revenuePoints.length - 1].x},${CHART_HEIGHT - CHART_PADDING}`
        ].join(" ")
      : "";

  const peakPoint = data.revenuePoints.reduce<RevenuePoint | null>(
    (peak, point) => (!peak || point.value > peak.value ? point : peak),
    null
  );

  const lastPoint = data.revenuePoints[data.revenuePoints.length - 1];
  const previousPoint = data.revenuePoints[data.revenuePoints.length - 2];
  const revenueTrend =
    data.revenueMode === "monthly" && lastPoint && previousPoint && previousPoint.value > 0
      ? `${lastPoint.value >= previousPoint.value ? "+" : ""}${(
          ((lastPoint.value - previousPoint.value) / previousPoint.value) *
          100
        ).toFixed(1)}%`
      : undefined;

  const generatedAt = data.generatedAt ? new Date(data.generatedAt) : null;
  const updatedLabel =
    generatedAt && !Number.isNaN(generatedAt.getTime())
      ? generatedAt.toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })
      : "Just now";

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
              {isLoading ? "Syncing" : data.isLive ? "Live data" : "Preview data"}
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
        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
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
                  A live read on gross revenue, order health, and the variant velocity moving
                  across every boutique on the network.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {data.isLive
                  ? `Updated ${updatedLabel}`
                  : "Preview snapshot · API offline"}
              </div>
            </div>

            <section className="mb-8 mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Gross Revenue"
                value={formatKsh(data.grossRevenue)}
                detail={data.revenueMode === "tenant" ? "live network total" : "this month"}
                trend={revenueTrend}
                icon={Wallet}
              />
              <MetricCard
                label="Total Orders"
                value={numberFormatter.format(data.totalOrders)}
                detail="fulfilled orders"
                icon={ShoppingBag}
              />
              <MetricCard
                label="Average Order Value"
                value={formatKsh(data.averageOrderValue)}
                detail="per paid order"
                icon={Receipt}
              />
              <MetricCard
                label="Active Apparel Tenants"
                value={`${data.activeTenants} Stores`}
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
                      {data.revenueMode === "tenant"
                        ? "Revenue by boutique"
                        : "Monthly sales volume"}
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {data.revenueMode === "tenant"
                        ? "Live gross merchandise value by tenant · KSh"
                        : "Gross merchandise value · KSh"}
                    </p>
                  </div>

                  {revenueTrend ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {revenueTrend} MoM
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
                      <Activity className="h-3.5 w-3.5" />
                      Live
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <svg
                    viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                    role="img"
                    aria-label="Live revenue trend"
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

                    <polygon points={revenueAreaPoints} fill="url(#revenueGradient)" />
                    <polyline
                      points={revenueLinePoints}
                      className="fill-none stroke-[#D4A373] stroke-2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />

                    {data.revenuePoints.map((point, index) => (
                      <circle
                        key={`${point.label}-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r={index === data.revenuePoints.length - 1 ? 4 : 2.5}
                        className="fill-[#D4A373]"
                      />
                    ))}
                  </svg>

                  <div className="mt-3 flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                    {data.revenuePoints.map((point, index) => (
                      <span
                        key={`${point.label}-${index}`}
                        className="min-w-0 flex-1 truncate text-center"
                        title={point.label}
                      >
                        {point.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {data.revenueMode === "tenant" ? "Top boutique" : "Peak month"}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {peakPoint
                      ? `${formatKsh(peakPoint.value)} · ${peakPoint.label}`
                      : "—"}
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
                    Top {data.variantDistribution.length}
                  </span>
                </div>

                <div className="mt-7 space-y-5">
                  {data.variantDistribution.map((item) => (
                    <div key={`${item.color}-${item.size}`} className="space-y-2">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <span className="font-medium text-zinc-800 dark:text-zinc-100">
                          {item.color} — {item.size}
                        </span>
                        <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                          {numberFormatter.format(item.unitsSold)} units
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                        <div
                          className="h-3 rounded-full bg-[#D4A373] transition-[width] duration-700 ease-out"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between gap-4 border-t border-line pt-4 text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">Highest velocity</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {data.variantDistribution[0]
                      ? `${data.variantDistribution[0].color} — ${data.variantDistribution[0].size}`
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
                  {data.hasLiveCheckouts ? "Live checkout stream" : "Preview ledger"} · Last{" "}
                  {data.recentCheckouts.length}
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
                    {data.recentCheckouts.map((checkout) => (
                      <tr
                        key={checkout.id}
                        className="transition-colors duration-200 hover:bg-white/60 dark:hover:bg-zinc-800/40"
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                          {checkout.id}
                        </td>
                        <td className="px-6 py-4">
                          <span className="block font-medium text-zinc-900 dark:text-zinc-100">
                            {checkout.tenantName}
                          </span>
                          <span className="mt-0.5 block font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                            {checkout.tenantId}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-zinc-500 dark:text-zinc-400">
                          {checkout.createdAt}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-[11px] text-zinc-600 dark:text-zinc-300">
                          {checkout.sku}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-zinc-900 dark:text-zinc-100">
                          {formatKsh(checkout.subtotal)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${statusStyles[checkout.status]}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {checkout.status}
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
              <span>
                Figures normalized to KSh · {data.isLive ? "API connected" : "Preview dataset"}
              </span>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
