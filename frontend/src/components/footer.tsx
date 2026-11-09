import {
  ArrowUpRight,
  CreditCard,
  Mail,
  MapPin,
  PackageSearch,
  Phone,
  Ruler,
  ShieldCheck,
  Truck
} from "lucide-react";

const CUSTOMER_CARE_LINKS = [
  {
    label: "Size Guides",
    href: "#size-guides",
    icon: Ruler,
    detail: "Find your fit across every silhouette"
  },
  {
    label: "Delivery Matrix",
    href: "#delivery-matrix",
    icon: Truck,
    detail: "Nairobi same-day · Countrywide G4S / Wells Fargo"
  },
  {
    label: "Order Tracking",
    href: "#order-tracking",
    icon: PackageSearch,
    detail: "Follow your parcel from atelier to doorstep"
  }
];

const PAYMENT_METHODS = [
  {
    name: "M-Pesa",
    className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
  },
  {
    name: "Airtel Money",
    className: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-400"
  },
  {
    name: "Visa",
    className: "border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-400"
  },
  {
    name: "Mastercard",
    className: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400"
  }
];

export function Footer() {
  return (
    <footer id="contact" className="mt-10 scroll-mt-24 bg-[#f5f0e7] transition-colors duration-300 dark:bg-[#0f0f0f]">
      <div className="mx-auto w-full max-w-[1480px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12 px-6 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-sand">
              Contact Us
            </p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight text-zinc-900 dark:text-zinc-100">
              Radiant Regalia
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
              Personal styling and client care from our Nairobi studio.
            </p>

            <ul className="mt-6 space-y-4 text-sm text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
              <li>
                <a
                  href="tel:+254700000000"
                  className="group flex items-start gap-3 transition-colors duration-300 hover:text-sand"
                >
                  <Phone size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-sand" />
                  <span>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">
                      Mobile
                    </span>
                    +254 700 000000
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+254200000000"
                  className="group flex items-start gap-3 transition-colors duration-300 hover:text-sand"
                >
                  <Phone size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-sand" />
                  <span>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">
                      Nairobi line
                    </span>
                    +254 20 0000000
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@radiantregalia.co.ke"
                  className="group flex items-start gap-3 transition-colors duration-300 hover:text-sand"
                >
                  <Mail size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-sand" />
                  <span>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">
                      Email
                    </span>
                    info@radiantregalia.co.ke
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-sand" />
                <span>
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-400">
                    Studio
                  </span>
                  Mombasa Road, Nairobi, Kenya
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-sand">
              Customer Care
            </p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight text-zinc-900 dark:text-zinc-100">
              Operations
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
              Clear pathways for sizing, delivery, and order visibility.
            </p>

            <nav aria-label="Customer care and operations" className="mt-6">
              <ul className="space-y-4 text-sm text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
                {CUSTOMER_CARE_LINKS.map(({ label, href, icon: Icon, detail }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="group flex items-start gap-3 transition-colors duration-300 hover:text-sand"
                    >
                      <Icon size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-sand" />
                      <span>
                        <span className="flex items-center gap-1.5 font-medium text-zinc-800 transition-colors duration-300 group-hover:text-sand dark:text-zinc-200">
                          {label}
                          <ArrowUpRight
                            size={12}
                            className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          />
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
                          {detail}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-sand">
              Regulatory
            </p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight text-zinc-900 dark:text-zinc-100">
              Compliance
            </h2>
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/60 p-4 transition-colors duration-300 dark:border-zinc-800 dark:bg-white/[0.03]">
              <ShieldCheck size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-sand" />
              <p className="text-xs leading-relaxed text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
                Data privacy protected in line with the Office of the Data Protection
                Commissioner (ODPC - Kenya).
              </p>
            </div>

            <ul className="mt-5 space-y-3 text-sm text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
              <li>
                <a
                  href="#privacy-policy"
                  className="group inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-sand"
                >
                  Privacy Policy
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </a>
              </li>
              <li>
                <a
                  href="#terms-and-conditions"
                  className="group inline-flex items-center gap-1.5 transition-colors duration-300 hover:text-sand"
                >
                  Terms &amp; Conditions
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-sand">
              Payments
            </p>
            <h2 className="mt-3 font-serif text-2xl tracking-tight text-zinc-900 dark:text-zinc-100">
              Secure Gateways
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
              Local mobile money and international card payments accepted.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {PAYMENT_METHODS.map(({ name, className }) => (
                <span
                  key={name}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 ${className}`}
                >
                  {name === "Mastercard" ? (
                    <span className="flex -space-x-1" aria-hidden="true">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    </span>
                  ) : (
                    <CreditCard size={12} strokeWidth={1.8} aria-hidden="true" />
                  )}
                  {name}
                </span>
              ))}
            </div>

            <p className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-zinc-600 transition-colors duration-300 dark:text-zinc-400">
              <ShieldCheck size={13} strokeWidth={1.7} className="text-sand" />
              Encrypted checkout
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-zinc-200 px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-zinc-600 transition-colors duration-300 dark:border-zinc-800 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Radiant Regalia Studio · Nairobi, Kenya</p>
          <p>Modern essentials · ODPC-aligned data handling</p>
        </div>
      </div>
    </footer>
  );
}
