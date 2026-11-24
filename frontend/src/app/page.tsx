import { ProductHero } from "@/components/product-hero";
import { Recommendations } from "@/components/recommendations";
import { StoreShell } from "@/components/store-shell";
import { TrustBanner } from "@/components/trust-banner";

export default function Home() {
  return (
    <StoreShell>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-600">
          Women / New In / Trench
        </p>
        <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-600">
          Free Nairobi delivery over KSh 10,000
        </p>
      </div>

      <ProductHero />
      <Recommendations />
      <TrustBanner />
    </StoreShell>
  );
}
