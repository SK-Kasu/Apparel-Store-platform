"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Heart,
  Loader2,
  ShoppingBag,
  X
} from "lucide-react";
import { MobileNav, Sidebar, type Department } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import type { CategoryCatalog, ShopProduct } from "@/lib/category-catalog";
import { CATEGORY_LABELS, type CategorySlug } from "@/lib/categories";
import { useBagCount } from "@/lib/use-bag-count";

type CheckoutStatus = "idle" | "loading" | "success";

type Feedback = {
  tone: "success" | "error";
  message: string;
};

type CheckoutResponse = {
  url?: string;
  checkoutUrl?: string;
  orderNumber?: string;
  error?: string;
};

const GARMENT_PATHS: Record<CategorySlug, string> = {
  "new-in": "M100 34 L110 92 L168 102 L110 112 L100 170 L90 112 L32 102 L90 92 Z",
  dresses:
    "M74 30 L96 20 L104 20 L126 30 L118 72 L142 100 L152 232 Q100 248 48 232 L58 100 L82 72 Z",
  tops: "M64 38 L88 24 L112 24 L136 38 L158 82 L138 96 L128 72 L128 224 L72 224 L72 72 L62 96 L42 82 Z",
  outerwear:
    "M66 34 L90 22 L100 40 L110 22 L134 34 L156 84 L138 100 L128 74 L132 232 L68 232 L72 74 L62 100 L44 84 Z",
  pants: "M62 30 L138 30 L146 232 L112 232 L100 112 L88 232 L54 232 Z",
  shoes: "M38 166 Q68 138 100 158 L124 178 Q160 188 164 208 L164 224 L38 224 Z",
  bags: "M52 92 L148 92 L158 224 L42 224 Z",
  accessories:
    "M78 76 A28 28 0 1 0 78 132 A28 28 0 1 0 78 76 Z M122 128 A34 34 0 1 0 122 196 A34 34 0 1 0 122 128 Z"
};

const GARMENT_DETAIL_PATHS: Partial<Record<CategorySlug, string>> = {
  dresses: "M82 72 Q100 82 118 72",
  tops: "M100 30 L100 224",
  outerwear: "M100 40 L84 86 L100 104 L116 86 L100 40",
  pants: "M62 56 L138 56 M100 56 L100 112",
  shoes: "M150 224 L150 246 L172 246 L172 224",
  bags: "M72 92 Q72 42 100 42 Q128 42 128 92"
};

type CategoryShopProps = {
  catalog: CategoryCatalog;
};

export function CategoryShop({ catalog }: CategoryShopProps) {
  const [department, setDepartment] = useState<Department>("Women");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => new Set());
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");
  const [checkoutError, setCheckoutError] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const { bagCount, addToBag } = useBagCount();

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

  const openProduct = (product: ShopProduct) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] ?? "");
    setSelectedColor(product.colors[0]?.name ?? "");
    setCheckoutError("");
    setCheckoutStatus("idle");
  };

  const closeProduct = useCallback(() => {
    setSelectedProduct(null);
    setCheckoutError("");
    setCheckoutStatus("idle");
  }, []);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeProduct();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedProduct, closeProduct]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => setFeedback(null), 3600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleAddToBag = async () => {
    if (!selectedProduct || !selectedSize || !selectedColor || isAdding) {
      return;
    }

    setIsAdding(true);
    setCheckoutError("");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 550));
      addToBag();
      setFeedback({
        tone: "success",
        message: `${selectedProduct.title} in ${selectedColor}, size ${selectedSize} added to your bag.`
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedProduct || !selectedSize || !selectedColor || checkoutStatus === "loading") {
      return;
    }

    setCheckoutStatus("loading");
    setCheckoutError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode: "buy-now",
          items: [
            {
              id: selectedProduct.id,
              title: selectedProduct.title,
              price: selectedProduct.price,
              amount: selectedProduct.amount,
              size: selectedSize,
              color: selectedColor,
              quantity: 1,
              category: selectedProduct.category
            }
          ]
        })
      });

      const payload = (await response.json().catch(() => ({}))) as CheckoutResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Checkout could not be started.");
      }

      const redirectUrl = payload.url ?? payload.checkoutUrl;

      if (redirectUrl) {
        window.location.assign(redirectUrl);
        return;
      }

      setCheckoutStatus("success");
      setFeedback({
        tone: "success",
        message: payload.orderNumber
          ? `Order ${payload.orderNumber} reserved for checkout.`
          : "Checkout session created."
      });
      window.setTimeout(() => setCheckoutStatus("idle"), 1600);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Checkout could not be started.";
      setCheckoutStatus("idle");
      setCheckoutError(message);
      setFeedback({ tone: "error", message });
    }
  };

  return (
    <div className="min-h-screen bg-ink text-zinc-100">
      <Sidebar
        activeCategory={catalog.label}
        department={department}
        onSelectDepartment={setDepartment}
      />

      <div className="animate-fade-in lg:pl-[280px]">
        <TopBar favoriteCount={favoriteIds.size} bagCount={bagCount} />
        <MobileNav activeCategory={catalog.label} />

        <main className="mx-auto w-full max-w-[1480px] px-4 pb-12 pt-6 sm:px-6 lg:px-8 xl:px-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-zinc-600"
          >
            <Link href="/" className="transition hover:text-sand">
              <span className="inline-flex items-center gap-1.5">
                <ArrowLeft size={12} />
                Home
              </span>
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-400">{catalog.label}</span>
          </nav>

          <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/[0.07] bg-panel shadow-[0_30px_120px_-40px_rgba(0,0,0,0.9)]">
            <div className="relative p-6 sm:p-9 lg:p-11">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sand/10 blur-3xl" />
              <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full border border-sand/10" />
              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-sand">
                    {catalog.eyebrow}
                  </p>
                  <h1 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tight text-cream sm:text-6xl xl:text-7xl">
                    {catalog.title}
                  </h1>
                  <p className="mt-5 max-w-xl font-serif text-lg italic leading-relaxed text-zinc-400 sm:text-xl">
                    {catalog.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 border-t border-white/[0.08] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <span className="font-serif text-4xl text-sand">
                    {String(catalog.products.length).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.24em] text-zinc-500">
                      Pieces in
                    </p>
                    <p className="mt-1 text-sm text-cream">The {catalog.label} edit</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-9">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">
                  Curated selection
                </p>
                <h2 className="mt-2 font-serif text-3xl tracking-tight text-cream">
                  Shop {catalog.label}
                </h2>
              </div>
              <p className="hidden text-[9px] uppercase tracking-[0.24em] text-zinc-600 sm:block">
                Sorted by newness
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {catalog.products.map((product) => (
                <ShopCard
                  key={product.id}
                  product={product}
                  isFavorite={favoriteIds.has(product.id)}
                  onOpen={openProduct}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>

          <footer className="mt-10 flex flex-col gap-2 border-t border-white/[0.06] pt-6 text-[9px] uppercase tracking-[0.22em] text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
            <p>Radiant Regalia Collection — Modern essentials</p>
            <p>All under one roof · Complimentary shipping over KSh 10,000</p>
          </footer>
        </main>
      </div>

      {selectedProduct ? (
        <ProductModal
          product={selectedProduct}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          isAdding={isAdding}
          checkoutStatus={checkoutStatus}
          checkoutError={checkoutError}
          onClose={closeProduct}
          onSelectSize={setSelectedSize}
          onSelectColor={setSelectedColor}
          onAddToBag={handleAddToBag}
          onBuyNow={handleBuyNow}
        />
      ) : null}

      {feedback ? <FeedbackToast feedback={feedback} /> : null}
    </div>
  );
}

type ShopCardProps = {
  product: ShopProduct;
  isFavorite: boolean;
  onOpen: (product: ShopProduct) => void;
  onToggleFavorite: (id: string) => void;
};

function ShopCard({ product, isFavorite, onOpen, onToggleFavorite }: ShopCardProps) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[1.5rem]">
        <ProductArtwork product={product} />
        <button
          type="button"
          onClick={() => onOpen(product)}
          aria-label={`View ${product.title}`}
          className="absolute inset-0 z-10 cursor-pointer"
        >
          <span className="sr-only">View {product.title}</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-label={isFavorite ? `Remove ${product.title} from favorites` : `Save ${product.title}`}
          className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md transition ${
            isFavorite
              ? "border-sand/60 bg-black/30 text-sand"
              : "border-white/15 bg-black/25 text-cream/80 hover:border-sand/50 hover:text-sand"
          }`}
        >
          <Heart size={16} strokeWidth={1.7} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onOpen(product)}
        className="mt-4 block w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[8px] uppercase tracking-[0.26em] text-zinc-600">
              {CATEGORY_LABELS[product.category]}
            </p>
            <h3 className="mt-1.5 font-serif text-[21px] leading-tight text-cream">
              {product.title}
            </h3>
          </div>
          <p className="pt-4 text-[13px] font-medium tracking-tight text-sand">
            {product.price}
          </p>
        </div>
        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-zinc-500">
          {product.details}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.22em] text-zinc-500 transition group-hover:text-sand">
          View details
          <ArrowUpRight size={12} />
        </span>
      </button>
    </article>
  );
}

type ProductModalProps = {
  product: ShopProduct;
  selectedSize: string;
  selectedColor: string;
  isAdding: boolean;
  checkoutStatus: CheckoutStatus;
  checkoutError: string;
  onClose: () => void;
  onSelectSize: (size: string) => void;
  onSelectColor: (color: string) => void;
  onAddToBag: () => void;
  onBuyNow: () => void;
};

function ProductModal({
  product,
  selectedSize,
  selectedColor,
  isAdding,
  checkoutStatus,
  checkoutError,
  onClose,
  onSelectSize,
  onSelectColor,
  onAddToBag,
  onBuyNow
}: ProductModalProps) {
  const isBusy = isAdding || checkoutStatus === "loading";
  const canPurchase = Boolean(selectedSize && selectedColor);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close product details"
        onClick={onClose}
        className="animate-overlay-in absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`product-title-${product.id}`}
        className="animate-modal-in relative z-10 max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] border border-white/[0.09] bg-[#171717] shadow-[0_40px_140px_-30px_rgba(0,0,0,0.95)] sm:rounded-[2rem]"
      >
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative bg-[#1b1b1b] p-4 sm:p-5">
            <ProductArtwork product={product} />
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.28em] text-sand">
                  {CATEGORY_LABELS[product.category]}
                </p>
                <h2
                  id={`product-title-${product.id}`}
                  className="mt-2 font-serif text-4xl leading-[1.02] tracking-tight text-cream"
                >
                  {product.title}
                </h2>
                <p className="mt-3 text-lg font-medium tracking-tight text-sand">
                  {product.price}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close product details"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.1] text-zinc-400 transition hover:border-sand/50 hover:text-sand"
              >
                <X size={17} />
              </button>
            </div>

            <p className="mt-6 font-serif text-lg italic leading-relaxed text-zinc-300">
              {product.description}
            </p>
            <p className="mt-4 text-[11px] leading-relaxed tracking-wide text-zinc-500">
              {product.details}
            </p>

            <div className="mt-7">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                  Colour
                </p>
                <p className="text-[11px] text-zinc-300">{selectedColor}</p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {product.colors.map((color) => {
                  const active = selectedColor === color.name;

                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => onSelectColor(color.name)}
                      aria-label={`Select ${color.name}`}
                      aria-pressed={active}
                      disabled={isBusy}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        active
                          ? "border-sand ring-1 ring-sand/40 ring-offset-2 ring-offset-[#171717]"
                          : "border-white/20 hover:border-white/50"
                      }`}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-black/20"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-zinc-500">
                  Size
                </p>
                <p className="text-[10px] text-zinc-600">True to size</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onSelectSize(size)}
                      aria-pressed={active}
                      disabled={isBusy}
                      className={`flex h-11 min-w-12 items-center justify-center rounded-xl border px-4 text-xs font-semibold tracking-[0.12em] transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        active
                          ? "border-sand bg-sand text-ink"
                          : "border-white/[0.09] bg-white/[0.02] text-zinc-400 hover:border-sand/40 hover:text-cream"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onAddToBag}
                disabled={isBusy || !canPurchase}
                className="flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-sand px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-[#E0B68E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAdding ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ShoppingBag size={16} />
                )}
                {isAdding ? "Adding..." : "Add To Bag"}
              </button>
              <button
                type="button"
                onClick={onBuyNow}
                disabled={isBusy || !canPurchase}
                className="flex h-14 items-center justify-center gap-2.5 rounded-2xl border border-white/[0.14] px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream transition hover:border-sand/50 hover:bg-white/[0.03] hover:text-sand disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutStatus === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : checkoutStatus === "success" ? (
                  <Check size={16} />
                ) : (
                  <ArrowUpRight size={16} />
                )}
                {checkoutStatus === "loading"
                  ? "Starting..."
                  : checkoutStatus === "success"
                    ? "Reserved"
                    : "Buy Now"}
              </button>
            </div>

            {checkoutError ? (
              <p
                role="alert"
                className="mt-3 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-3 py-2 text-[11px] text-red-200"
              >
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {checkoutError}
              </p>
            ) : null}

            <p className="mt-5 text-[9px] uppercase tracking-[0.2em] text-zinc-600">
              Free shipping over KSh 10,000 · 14-day returns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductArtwork({
  product,
  className = ""
}: {
  product: ShopProduct;
  className?: string;
}) {
  const accent = product.colors[0]?.hex ?? "#D4A373";
  const detail = GARMENT_DETAIL_PATHS[product.category];
  const strokeOnly = product.category === "accessories";

  return (
    <div
      className={`relative aspect-[3/4] overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-[#181818] ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle at 28% 18%, ${accent}40, transparent 42%), linear-gradient(155deg, #222222 0%, #131313 72%)`
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "34px 34px"
        }}
      />
      <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/20 px-2.5 py-1.5 text-[8px] uppercase tracking-[0.2em] text-cream/70 backdrop-blur-md">
        {product.badge ?? CATEGORY_LABELS[product.category]}
      </span>
      <svg
        viewBox="0 0 200 260"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full p-9 transition duration-700 group-hover:scale-[1.03]"
      >
        <path
          d={GARMENT_PATHS[product.category]}
          fill={strokeOnly ? "none" : accent}
          fillOpacity={strokeOnly ? 0 : 0.16}
          stroke={accent}
          strokeWidth={strokeOnly ? 6 : 1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {detail ? (
          <path
            d={detail}
            fill="none"
            stroke={accent}
            strokeOpacity="0.7"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </svg>
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <span className="max-w-[60%] text-[8px] uppercase leading-relaxed tracking-[0.18em] text-cream/50">
          {product.description.split(":")[0]}
        </span>
        <span className="shrink-0 text-[11px] font-medium tracking-tight text-sand">
          {product.price}
        </span>
      </div>
    </div>
  );
}

function FeedbackToast({ feedback }: { feedback: Feedback }) {
  const isSuccess = feedback.tone === "success";

  return (
    <div
      role="status"
      className={`animate-modal-in fixed bottom-5 right-4 z-[80] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl sm:bottom-6 sm:right-6 ${
        isSuccess
          ? "border-sand/30 bg-[#201d18] text-cream"
          : "border-red-400/30 bg-[#211616] text-red-100"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          isSuccess ? "bg-sand text-ink" : "bg-red-400/20 text-red-200"
        }`}
      >
        {isSuccess ? <Check size={13} /> : <AlertCircle size={13} />}
      </span>
      <p className="text-[11px] leading-relaxed">{feedback.message}</p>
    </div>
  );
}
