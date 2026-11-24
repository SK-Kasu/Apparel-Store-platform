import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

const SHOP_LINKS = [
  { href: "/shop/new-in", label: "New In" },
  { href: "/shop/dresses", label: "Dresses" },
  { href: "/shop/outerwear", label: "Outerwear" },
  { href: "/shop/bags", label: "Bags" },
  { href: "/shop/accessories", label: "Accessories" }
];

const CARE_LINKS = [
  { href: "/contact", label: "Contact Us" },
  { href: "/track-order", label: "Track Order" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" }
];

const PAYMENTS = [
  { label: "M-Pesa", className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" },
  { label: "Airtel Money", className: "border-red-400/30 bg-red-400/10 text-red-300" },
  { label: "Visa", className: "border-blue-400/30 bg-blue-400/10 text-blue-200" },
  { label: "Mastercard", className: "border-orange-400/30 bg-orange-400/10 text-orange-200" }
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#0e0e0e]">
      <div className="mx-auto w-full max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-sand/40 font-serif text-lg text-sand">
                R
              </span>
              <div>
                <p className="font-serif text-xl leading-tight tracking-tight text-cream">
                  Radiant Regalia Collection
                </p>
                <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-sand/80">
                  All under one roof
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-500">
              A Kenyan boutique edit of considered apparel, footwear, and accessories. Designed
              with local ateliers, made for Nairobi days and coastal evenings.
            </p>
          </div>

          <div>
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.3em] text-sand">Shop</h2>
            <ul className="mt-4 space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.3em] text-sand">
              Customer Care & Legal
            </h2>
            <ul className="mt-4 space-y-2.5">
              {CARE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-sand" />
              <p className="text-[10px] leading-relaxed text-zinc-500">
                Compliant with the Kenya Data Protection Act, 2019 and registered with the Office
                of the Data Protection Commissioner (ODPC).
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-[9px] font-semibold uppercase tracking-[0.3em] text-sand">
              Visit & Contact
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-400">
              <li>
                <a
                  href="tel:+254700000000"
                  className="flex items-start gap-2.5 transition hover:text-cream"
                >
                  <Phone size={15} className="mt-0.5 shrink-0 text-sand" />
                  <span>+254 700 000 000</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@radiantregalia.co.ke"
                  className="flex items-start gap-2.5 break-all transition hover:text-cream"
                >
                  <Mail size={15} className="mt-0.5 shrink-0 text-sand" />
                  <span>info@radiantregalia.co.ke</span>
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-sand" />
                  <address className="not-italic">
                    Westlands &amp; CBD, Nairobi, Kenya
                    <span className="mt-1 block text-[11px] text-zinc-600">
                      Mon–Sat, 9:00–18:00 EAT
                    </span>
                  </address>
                </span>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-[9px] uppercase tracking-[0.24em] text-zinc-600">
                Kenyan payments accepted
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PAYMENTS.map((payment) => (
                  <span
                    key={payment.label}
                    className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] ${payment.className}`}
                  >
                    {payment.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.08] pt-6 text-[9px] uppercase tracking-[0.2em] text-zinc-600 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Radiant Regalia Collection. All rights reserved.</p>
          <p className="text-zinc-500">
            Data controller registered with the ODPC · Nairobi, Kenya
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="transition hover:text-sand">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-sand">
              Terms
            </Link>
            <Link href="/contact" className="transition hover:text-sand">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
