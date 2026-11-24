import { proxyInventory } from "@/lib/inventory-api";

export const runtime = "nodejs";

export function GET() {
  return proxyInventory("/api/inventory");
}

export async function POST(request: Request) {
  return proxyInventory("/api/inventory", {
    method: "POST",
    body: await request.text()
  });
}
