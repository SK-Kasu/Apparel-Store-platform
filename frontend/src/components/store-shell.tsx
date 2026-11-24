"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { MobileMenu, Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { WishlistDrawer } from "@/components/wishlist-drawer";

export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-zinc-100">
      <Sidebar />

      <div className="lg:pl-[280px]">
        <TopBar />
        <main className="mx-auto w-full max-w-[1480px] px-4 pb-12 pt-6 sm:px-6 lg:px-8 xl:px-10">
          {children}
        </main>
      </div>

      <MobileMenu />
      <WishlistDrawer />
      <CartDrawer />
    </div>
  );
}
