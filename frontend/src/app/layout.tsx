import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { NavigationProgress } from "@/components/NavigationProgress";
import { StoreProvider } from "@/lib/store-context";
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

export const metadata: Metadata = {
  title: "Radiant Regalia Collection | All under one roof",
  description:
    "Radiant Regalia Collection is a considered edit of modern apparel, footwear, and accessories - all under one roof."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} bg-ink text-zinc-100 antialiased`}
      >
        <StoreProvider>
          <NavigationProgress />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
