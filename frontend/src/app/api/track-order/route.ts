import { NextResponse } from "next/server";
import { findOrder, normalizeOrderId } from "@/lib/order-store";

export const runtime = "nodejs";

function readOrderId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 40) return null;
  return normalizeOrderId(trimmed);
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const raw =
    payload && typeof payload === "object" && "orderId" in payload
      ? (payload as { orderId?: unknown }).orderId
      : undefined;
  const id = readOrderId(raw);

  if (!id) {
    return NextResponse.json(
      { error: "Enter a valid order ID, for example RR-DEMO01." },
      { status: 400 }
    );
  }

  const order = findOrder(id);

  if (!order) {
    return NextResponse.json(
      {
        error:
          "We could not find an order with that ID. Check the reference in your confirmation email or contact us on +254 700 000 000."
      },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}
