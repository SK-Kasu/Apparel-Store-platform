import type { Metadata } from "next";
import { StoreShell } from "@/components/store-shell";
import { TrackOrderForm } from "@/components/track-order-form";

export const metadata: Metadata = {
  title: "Track Order | Radiant Regalia Collection",
  description:
    "Track your Radiant Regalia Collection order with your RR order ID. Nairobi and countrywide delivery updates."
};

export default function TrackOrderPage() {
  return (
    <StoreShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-[9px] uppercase tracking-[0.32em] text-sand">Order care</p>
        <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight text-cream sm:text-6xl">
          Track Order
        </h1>
        <p className="mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-zinc-400 sm:text-xl">
          Enter the order ID from your confirmation to see where your pieces are on their way to
          you.
        </p>

        <div className="mt-8">
          <TrackOrderForm />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-zinc-600">
          Orders placed through this storefront begin with <span className="font-mono text-zinc-400">RR-</span>.
          If you have lost your ID, call{" "}
          <a
            href="tel:+254700000000"
            className="text-sand underline decoration-sand/30 underline-offset-2"
          >
            +254 700 000 000
          </a>{" "}
          or email{" "}
          <a
            href="mailto:info@radiantregalia.co.ke"
            className="break-all text-sand underline decoration-sand/30 underline-offset-2"
          >
            info@radiantregalia.co.ke
          </a>
          .
        </p>
      </div>
    </StoreShell>
  );
}
