import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { StoreShell } from "@/components/store-shell";

export const metadata: Metadata = {
  title: "Contact Us | Radiant Regalia Collection",
  description:
    "Speak to the Radiant Regalia Collection client care team in Nairobi, Kenya. Order support, sizing advice, returns, and data protection requests."
};

export default function ContactPage() {
  return (
    <StoreShell>
      <div className="mx-auto max-w-5xl">
        <p className="text-[9px] uppercase tracking-[0.32em] text-sand">Client care</p>
        <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight text-cream sm:text-6xl">
          Contact Us
        </h1>
        <p className="mt-4 max-w-2xl font-serif text-lg italic leading-relaxed text-zinc-400 sm:text-xl">
          Our Nairobi team is here for sizing advice, order support, returns, and wholesale
          enquiries. We reply within one business day.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <ContactForm />

          <div className="space-y-4">
            <div className="rounded-3xl border border-white/[0.07] bg-panel p-5 sm:p-6">
              <h2 className="text-[9px] font-semibold uppercase tracking-[0.24em] text-sand">
                Reach us directly
              </h2>
              <ul className="mt-4 space-y-4 text-sm text-zinc-300">
                <li>
                  <a
                    href="tel:+254700000000"
                    className="flex items-start gap-3 transition hover:text-sand"
                  >
                    <Phone size={16} className="mt-0.5 shrink-0 text-sand" />
                    <span>+254 700 000 000</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@radiantregalia.co.ke"
                    className="flex items-start gap-3 break-all transition hover:text-sand"
                  >
                    <Mail size={16} className="mt-0.5 shrink-0 text-sand" />
                    <span>info@radiantregalia.co.ke</span>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-sand" />
                  <address className="not-italic">
                    Westlands &amp; CBD
                    <br />
                    Nairobi, Kenya
                  </address>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={16} className="mt-0.5 shrink-0 text-sand" />
                  <span>
                    Monday–Saturday
                    <br />
                    9:00–18:00 EAT
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl border border-white/[0.07] bg-panel p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-sand">
                <ShieldCheck size={14} />
                Data protection
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500">
                For access, correction, or deletion requests under the Kenya Data Protection Act,
                2019, email{" "}
                <a
                  href="mailto:info@radiantregalia.co.ke"
                  className="break-all text-sand underline decoration-sand/30 underline-offset-2"
                >
                  info@radiantregalia.co.ke
                </a>{" "}
                with the subject &quot;Data request&quot;. We respond within 30 days. Our data
                controller is registered with the Office of the Data Protection Commissioner
                (ODPC).
              </p>
            </div>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
