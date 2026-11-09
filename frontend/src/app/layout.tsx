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
const brandTitle = `${brandName} - All under one roof`;
const brandDescription =
  "Radiant Regalia Collection is a considered edit of modern apparel, footwear, and accessories - all under one roof.";

export const metadata: Metadata = {
  title: {
    default: brandTitle,
    template: `%s | ${brandName}`
  },
  description: brandDescription,
  applicationName: brandName,
  keywords: [
    "Radiant Regalia Collection",
    "Radiant Regalia",
    "apparel",
    "footwear",
    "accessories",
    "modern essentials",
    "all under one roof"
  ],
  openGraph: {
    title: brandTitle,
    description: brandDescription,
    siteName: brandName,
    locale: "en_KE",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: brandTitle,
    description: brandDescription
  },
  robots: {
    index: true,
    follow: true
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
