import type { Metadata } from "next";
import { StoreShell } from "@/components/store-shell";

export const metadata: Metadata = {
  title: "Terms & Conditions | Radiant Regalia Collection",
  description:
    "Terms of sale for Radiant Regalia Collection, including delivery, returns, payments, and Kenyan consumer rights."
};

const SECTIONS = [
  {
    title: "1. About these terms",
    body: [
      "These terms govern purchases from Radiant Regalia Collection through this storefront. By placing an order you agree to these terms. Our registered trading address is Westlands & CBD, Nairobi, Kenya.",
      "Nothing in these terms limits rights you have under the Kenyan Consumer Protection Act, 2012 or other applicable law."
    ]
  },
  {
    title: "2. Products and pricing",
    body: [
      "All prices are shown in Kenyan shillings (KSh) and include applicable taxes unless stated otherwise. We take care to describe colours, fabrics, and sizing accurately; slight variation may occur between screens and natural materials.",
      "We may correct pricing errors before dispatch. If the correct price is higher than the price shown, we will contact you before proceeding."
    ]
  },
  {
    title: "3. Orders and payment",
    body: [
      "An order is confirmed when you receive an order ID beginning with RR-. We accept M-Pesa, Airtel Money, Visa, and Mastercard. Payment must clear before dispatch, except where cash-on-delivery is expressly offered within Nairobi.",
      "We may decline or cancel an order where stock is unavailable, payment fails, or we suspect fraud. Any amount already paid will be refunded."
    ]
  },
  {
    title: "4. Delivery",
    body: [
      "We deliver within Nairobi and countrywide across Kenya. Delivery estimates are indicative and may be affected by weather, public holidays, or courier delays.",
      "Risk passes to you on delivery. Please check your parcel on arrival and report damage or missing items within 48 hours."
    ]
  },
  {
    title: "5. Returns and exchanges",
    body: [
      "Unworn items with original tags may be returned within 14 days of delivery. Intimate apparel, pierced jewellery, and final-sale pieces are not returnable for hygiene reasons.",
      "Contact info@radiantregalia.co.ke or call +254 700 000 000 to arrange a return. Refunds are made to the original payment method within 7–14 business days of inspection."
    ]
  },
  {
    title: "6. Intellectual property",
    body: [
      "The Radiant Regalia Collection name, logo, product photography, and site content are owned by us or licensed to us. You may not reproduce them for commercial use without written permission."
    ]
  },
  {
    title: "7. Privacy",
    body: [
      "We process personal data under our Privacy Policy and the Kenya Data Protection Act, 2019. Please read the Privacy Policy for details of your rights and how to contact our data protection team."
    ]
  },
  {
    title: "8. Liability",
    body: [
      "To the extent permitted by Kenyan law, our liability for any order is limited to the amount paid for that order. We are not liable for indirect or consequential losses. This does not exclude liability that cannot lawfully be excluded."
    ]
  },
  {
    title: "9. Governing law and disputes",
    body: [
      "These terms are governed by the laws of Kenya. We ask that you contact us first so we can resolve any concern. Disputes that cannot be resolved may be referred to the competent courts of Kenya or the relevant consumer authority."
    ]
  }
];

export default function TermsPage() {
  return (
    <StoreShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-[9px] uppercase tracking-[0.32em] text-sand">Legal</p>
        <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight text-cream sm:text-6xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-4 font-serif text-lg italic leading-relaxed text-zinc-400">
          Effective 1 January 2026 · Radiant Regalia Collection, Nairobi, Kenya
        </p>

        <div className="mt-8 space-y-7">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl text-cream">{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-10 text-xs leading-relaxed text-zinc-600">
          For questions about these terms, email{" "}
          <a
            href="mailto:info@radiantregalia.co.ke"
            className="break-all text-sand underline decoration-sand/30 underline-offset-2"
          >
            info@radiantregalia.co.ke
          </a>{" "}
          or call{" "}
          <a
            href="tel:+254700000000"
            className="text-sand underline decoration-sand/30 underline-offset-2"
          >
            +254 700 000 000
          </a>
          .
        </p>
      </div>
    </StoreShell>
  );
}
