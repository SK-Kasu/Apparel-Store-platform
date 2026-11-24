import { proxyInventory } from "@/lib/inventory-api";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;

  return proxyInventory(`/api/inventory/variants/${id}`, {
    method: "PATCH",
    body: await request.text()
  });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  return proxyInventory(`/api/inventory/variants/${id}`, { method: "DELETE" });
}
