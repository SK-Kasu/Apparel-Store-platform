import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory | Radiant Regalia Collection"
};

export default function InventoryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
