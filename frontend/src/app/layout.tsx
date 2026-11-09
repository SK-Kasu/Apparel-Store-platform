import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const brandName = "Radiant Regalia Collection";
const brandMotto = "All under one roof";
const brandTitle = `${brandName} - ${brandMotto}`;
const brandDescription = `${brandTitle}. A considered collection of modern essentials, softly tailored for everyday dressing.`;

export const metadata: Metadata = {
  title: {
    default: brandTitle,
    template: `%s | ${brandTitle}`
  },
  description: brandDescription,
  applicationName: brandName,
  keywords: [brandName, brandMotto, "modern essentials", "apparel", "Radiant Regalia Collection atelier"],
  openGraph: {
    title: brandTitle,
    description: brandDescription,
    siteName: brandName,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: brandTitle,
    description: brandDescription
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
