import { RotateCcw, ShieldCheck, Truck } from "lucide-react";

const BENEFITS = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On orders over KSh 10,000",
    detail: "Nairobi same-day, countrywide 2–4 days"
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "14-day return policy",
    detail: "Complimentary Nairobi collection"
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "M-Pesa · Airtel Money · Card",
    detail: "Encrypted and ODPC compliant"
  }
];

export function TrustBanner() {
  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-white/[0.06] bg-panel/60">
      <div className="grid divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {BENEFITS.map(({ icon: Icon, title, description, detail }) => (
          <div key={title} className="flex items-start gap-4 px-5 py-6 sm:px-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-sand/25 bg-sand/[0.06] text-sand">
              <Icon size={18} strokeWidth={1.6} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream">
                {title}
              </p>
              <p className="mt-1 text-xs text-zinc-400">{description}</p>
              <p className="mt-1 text-[10px] text-zinc-600">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
