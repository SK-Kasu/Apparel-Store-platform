"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X
} from "lucide-react";
import { formatKsh } from "@/lib/catalog";
import { useStore } from "@/lib/store-context";

type Confirmation = {
  orderId: string;
  total: number;
  message: string;
};

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartCount,
    subtotal,
    setQuantity,
    removeFromCart,
    clearCart
  } = useStore();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  useEffect(() => {
    if (!cartOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cartOpen, setCartOpen]);

  const close = () => {
    setCartOpen(false);
    setStatus("idle");
    setError("");
    if (confirmation) {
      setConfirmation(null);
    }
  };

  const checkout = async () => {
    if (!cart.length) return;

    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          currency: "KSh",
          items: cart.map((line) => ({
            productId: line.productId,
            name: line.name,
            price: line.price,
            quantity: line.quantity,
            size: line.size,
            color: line.color,
            image: line.image
          }))
        })
      });

      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : "We could not start checkout. Please try again.";
        throw new Error(message);
      }

      const data = payload as {
        orderId: string;
        total: number;
        payment?: { message?: string };
      };

      setConfirmation({
        orderId: data.orderId,
        total: data.total,
        message:
          data.payment?.message ??
          "An M-Pesa payment prompt will be sent to your phone to complete the order."
      });
      setStatus("success");
      clearCart();
    } catch (checkoutError) {
      setStatus("error");
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "We could not start checkout. Please try again."
      );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[60] ${cartOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!cartOpen}
    >
      <button
        type="button"
        tabIndex={cartOpen ? 0 : -1}
        aria-label="Close shopping bag"
        onClick={close}
        className={`absolute inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#151515] shadow-2xl transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/[0.08] px-5 py-5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-sand">Your selection</p>
            <h2 className="mt-1 flex items-center gap-2 font-serif text-2xl text-cream">
              Shopping Bag
              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] font-sans text-zinc-400">
                {cartCount}
              </span>
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close shopping bag"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-sand/50 hover:text-sand"
          >
            <X size={18} />
          </button>
        </header>

        {status === "success" && confirmation ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-300">
              <CheckCircle2 size={30} />
            </span>
            <h3 className="mt-6 font-serif text-3xl text-cream">Order received</h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{confirmation.message}</p>
            <div className="mt-6 w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 text-left">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <span>Order ID</span>
                <span className="font-mono text-sand">{confirmation.orderId}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <span>Total</span>
                <span className="text-cream">{formatKsh(confirmation.total)}</span>
              </div>
            </div>
            <Link
              href="/track-order"
              prefetch={true}
              onClick={close}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sand text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-[#E0B68E]"
            >
              Track this order
              <ArrowRight size={15} />
            </Link>
            <button
              type="button"
              onClick={close}
              className="mt-3 h-11 w-full rounded-full border border-white/10 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:border-sand/40 hover:text-sand"
            >
              Continue shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-500">
              <ShoppingBag size={26} />
            </span>
            <h3 className="mt-6 font-serif text-2xl text-cream">Your bag is empty</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">
              Discover the new season from our Nairobi atelier and build your edit.
            </p>
            <Link
              href="/shop/new-in"
              prefetch={true}
              onClick={close}
              className="mt-6 flex h-12 items-center justify-center rounded-full bg-sand px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-[#E0B68E]"
            >
              Shop new in
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {cart.map((line) => (
                  <li
                    key={line.key}
                    className="flex gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3"
                  >
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-panel">
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate font-serif text-lg leading-tight text-cream">
                            {line.name}
                          </h3>
                          <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-zinc-500">
                            {line.color} / {line.size}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(line.key)}
                          aria-label={`Remove ${line.name}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-600 transition hover:bg-white/[0.05] hover:text-red-300"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                        <div className="flex items-center rounded-full border border-white/10">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.key, line.quantity - 1)}
                            aria-label={`Decrease quantity of ${line.name}`}
                            className="flex h-8 w-8 items-center justify-center text-zinc-400 transition hover:text-sand"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-xs text-cream">{line.quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(line.key, line.quantity + 1)}
                            aria-label={`Increase quantity of ${line.name}`}
                            className="flex h-8 w-8 items-center justify-center text-zinc-400 transition hover:text-sand"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-sand">
                          {formatKsh(line.price * line.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-white/[0.08] px-5 py-5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <span>Subtotal</span>
                <span className="text-base font-medium tracking-normal text-cream">
                  {formatKsh(subtotal)}
                </span>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-zinc-600">
                Delivery calculated at checkout. Free Nairobi delivery over KSh 10,000.
              </p>
              {error ? (
                <p className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs text-red-300">
                  {error}
                </p>
              ) : null}
              <button
                type="button"
                onClick={checkout}
                disabled={status === "loading"}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sand px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-[#E0B68E] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Starting checkout
                  </>
                ) : (
                  <>
                    Proceed to Checkout
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                Secure checkout · M-Pesa · Airtel Money · Card
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
