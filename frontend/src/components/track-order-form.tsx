"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, PackageSearch, Search } from "lucide-react";
import { formatKsh } from "@/lib/catalog";
import type { StoredOrder } from "@/lib/order-store";

const STEPS = ["Processing", "Packed", "Out for delivery", "Delivered"];

function stepIndex(status: string): number {
  const index = STEPS.findIndex((step) => step.toLowerCase() === status.toLowerCase());
  return index < 0 ? 0 : index;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function TrackOrderForm() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [order, setOrder] = useState<StoredOrder | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");
    setOrder(null);

    try {
      const response = await fetch("/api/track-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ orderId })
      });
      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          payload && typeof payload === "object" && "error" in payload
            ? String((payload as { error: unknown }).error)
            : "We could not find that order.";
        throw new Error(message);
      }

      setOrder((payload as { order: StoredOrder }).order);
      setStatus("success");
    } catch (trackError) {
      setStatus("error");
      setError(
        trackError instanceof Error ? trackError.message : "We could not find that order."
      );
    }
  };

  const activeStep = order ? stepIndex(order.status) : 0;

  return (
    <div className="space-y-6">
      <form
        onSubmit={submit}
        className="rounded-3xl border border-white/[0.07] bg-panel p-5 sm:p-6"
      >
        <label className="block">
          <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
            Order ID
          </span>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              required
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="e.g. RR-DEMO01"
              autoComplete="off"
              className="h-12 min-w-0 flex-1 rounded-xl border border-white/[0.09] bg-white/[0.03] px-4 text-sm uppercase tracking-[0.08em] text-cream outline-none transition placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-600 focus:border-sand/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-sand px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-[#E0B68E] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Checking
                </>
              ) : (
                <>
                  <Search size={14} />
                  Track order
                </>
              )}
            </button>
          </div>
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-zinc-600">
          <span>Testing the flow?</span>
          <button
            type="button"
            onClick={() => setOrderId("RR-DEMO01")}
            className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] text-sand transition hover:border-sand/40"
          >
            Use demo ID RR-DEMO01
          </button>
        </div>

        {status === "error" ? (
          <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-xs leading-relaxed text-red-300">
            {error}
          </p>
        ) : null}
      </form>

      {status === "success" && order ? (
        <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-panel">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.26em] text-zinc-500">Order</p>
              <p className="mt-1 font-mono text-lg text-cream">{order.id}</p>
              <p className="mt-1 text-[10px] text-zinc-600">Placed {formatDate(order.placedAt)}</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-sand/40 bg-sand/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sand">
              <PackageSearch size={13} />
              {order.status}
            </span>
          </div>

          <div className="border-b border-white/[0.07] p-5 sm:p-6">
            <div className="grid grid-cols-4 gap-1.5">
              {STEPS.map((step, index) => {
                const complete = index <= activeStep;

                return (
                  <div key={step} className="text-center">
                    <div
                      className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-semibold ${
                        complete
                          ? "border-sand bg-sand text-ink"
                          : "border-white/10 text-zinc-600"
                      }`}
                    >
                      {complete ? <CheckCircle2 size={14} /> : index + 1}
                    </div>
                    <p
                      className={`mt-2 text-[9px] uppercase tracking-[0.1em] ${
                        complete ? "text-zinc-300" : "text-zinc-600"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
              Items
            </p>
            <ul className="mt-3 divide-y divide-white/[0.06]">
              {order.items.map((item, index) => (
                <li
                  key={`${item.productId}-${item.size}-${item.color}-${index}`}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-cream">{item.name}</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                      {item.color} / {item.size} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-sand">
                    {formatKsh(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4 text-xs text-zinc-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatKsh(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{order.shipping === 0 ? "Complimentary" : formatKsh(order.shipping)}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm text-cream">
                <span>Total</span>
                <span className="font-medium text-sand">{formatKsh(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
