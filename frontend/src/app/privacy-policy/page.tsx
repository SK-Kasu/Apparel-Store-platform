import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { StoreShell } from "@/components/store-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | Radiant Regalia Collection",
  description:
    "How Radiant Regalia Collection collects, uses, stores, and protects personal data under the Kenya Data Protection Act, 2019 and ODPC requirements."
};

const SECTIONS = [
  {
    title: "1. Who we are",
    body: [
      "Radiant Regalia Collection is a Kenyan boutique retailer operating online and from Westlands and the Nairobi CBD. We are the data controller for personal information collected through this storefront.",
      "Our data protection contact is info@radiantregalia.co.ke. We are registered with the Office of the Data Protection Commissioner (ODPC) in Kenya."
    ]
  },
  {
    title: "2. Information we collect",
    body: [
      "Contact details you provide, such as name, email address, phone number, and delivery address. Order details including items purchased, sizes, colours, order value, and payment status. Communications you send through our contact form, email, or phone.",
      "We collect limited technical information required to operate and secure the storefront, such as device and browser information and basic usage logs. We do not collect payment card numbers on this site; payments are completed through M-Pesa, Airtel Money, or a secure card processor."
    ]
  },
  {
    title: "3. How we use your data",
    body: [
      "To process orders, arrange delivery, handle returns, and provide customer care. To send order confirmations and delivery updates. To answer enquiries and improve our products and service. To meet legal, tax, and accounting obligations in Kenya.",
      "We rely on contractual necessity, your consent, and our legitimate interests in operating a secure retail business. Where consent is required, you may withdraw it at any time."
    ]
  },
  {
    title: "4. Sharing and disclosure",
    body: [
      "We share only what is necessary with delivery partners, payment providers, and technology suppliers who help us run the store. These providers are required to protect your data and use it only for the services they provide to us.",
      "We do not sell your personal data. We may disclose information where required by Kenyan law, a court order, or a lawful request from the ODPC or another competent authority."
    ]
  },
  {
    title: "5. Retention and security",
    body: [
      "Order and accounting records are retained for the period required by Kenyan tax and consumer law. Contact enquiries are retained only as long as needed to resolve them and improve our service.",
      "We use access controls, encrypted connections, and limited staff access to protect your information. No online transmission is completely secure, so please avoid sending sensitive payment details by email."
    ]
  },
  {
    title: "6. Your rights under the Data Protection Act, 2019",
    body: [
      "You have the right to be informed about how your data is used, to access a copy of your personal data, to request correction of inaccurate data, to request deletion where applicable, to object to or restrict certain processing, and to withdraw consent.",
      "To exercise a right, email info@radiantregalia.co.ke with the subject \"Data request\". We may need to verify your identity. We respond within 30 days. If you are not satisfied, you may complain to the Office of the Data Protection Commissioner (ODPC) in Kenya."
    ]
  },
  {
    title: "7. Cookies",
    body: [
      "This storefront uses local browser storage to remember your bag, wishlist, and preferences. We do not use advertising cookies. You can clear this storage through your browser settings at any time."
    ]
  },
  {
    title: "8. Changes",
    body: [
      "We may update this policy to reflect changes in law or our services. The current version is always published on this page. Material changes will be highlighted on the storefront."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <StoreShell>
      <div className="mx-auto max-w-3xl">
        <p className="text-[9px] uppercase tracking-[0.32em] text-sand">Legal</p>
        <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight text-cream sm:text-6xl">
          Privacy Policy
        </h1>
        <p className="mt-4 font-serif text-lg italic leading-relaxed text-zinc-400">
          Effective 1 January 2026 · Radiant Regalia Collection, Nairobi, Kenya
        </p>

        <div className="mt-6 flex gap-3 rounded-2xl border border-sand/20 bg-sand/[0.06] p-4">
          <ShieldCheck size={20} className="mt-0.5 shrink-0 text-sand" />
          <p className="text-xs leading-relaxed text-zinc-300">
            <span className="font-semibold text-cream">Kenya ODPC compliance notice.</span> We
            process personal data in accordance with the Data Protection Act, 2019 and the
            regulations of the Office of the Data Protection Commissioner (ODPC). You may lodge a
            complaint with the ODPC if you believe your data protection rights have been
            infringed.
          </p>
        </div>

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
          Questions? Email{" "}
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
