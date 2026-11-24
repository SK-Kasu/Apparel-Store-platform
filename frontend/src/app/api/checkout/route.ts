import { NextResponse } from "next/server";
import { findProduct } from "@/lib/catalog";
import { recordOrder, type StoredOrderItem } from "@/lib/order-store";

export const runtime = "nodejs";

const MAX_ITEMS = 50;
const FREE_DELIVERY_THRESHOLD = 10_000;
const NAIROBI_DELIVERY_FEE = 300;

type IncomingItem = Record<string, unknown>;

function asText(value: unknown, field: string, max = 120): string {
  if (typeof value !== "string" || value.trim().length === 0 || value.trim().length > max) {
    throw new Error(`${field} is invalid`);
  }

  return value.trim();
}

function asQuantity(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 99) {
    throw new Error("Item quantity is invalid");
  }

  return value;
}

function orderId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).toUpperCase().slice(2, 5);

  return `RR-${stamp}${random}`;
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const itemsInput =
    payload && typeof payload === "object" && "items" in payload
      ? (payload as { items?: unknown }).items
      : undefined;

  if (!Array.isArray(itemsInput) || itemsInput.length === 0) {
    return NextResponse.json({ error: "Your bag is empty" }, { status: 400 });
  }

  if (itemsInput.length > MAX_ITEMS) {
    return NextResponse.json(
      { error: "Your bag contains too many lines. Please reduce the selection." },
      { status: 400 }
    );
  }

  let items: StoredOrderItem[];

  try {
    items = itemsInput.map((raw) => {
      const item = raw as IncomingItem;
      const productId = asText(item.productId, "productId");
      const product = findProduct(productId);

      if (!product) {
        throw new Error(`Unknown product: ${productId}`);
      }

      const size = asText(item.size, "size", 12);
      const color = asText(item.color, "color", 40);

      if (!product.sizes.includes(size)) {
        throw new Error(`Size ${size} is not available for ${product.name}`);
      }

      if (!product.colors.includes(color)) {
        throw new Error(`Colour ${color} is not available for ${product.name}`);
      }

      return {
        productId,
        name: product.name,
        price: product.price,
        quantity: asQuantity(item.quantity),
        size,
        color
      };
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid cart item" },
      { status: 400 }
    );
  }

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : NAIROBI_DELIVERY_FEE;
  const total = subtotal + shipping;
  const id = orderId();
  const placedAt = new Date().toISOString();
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const status = "Processing";

  recordOrder({
    id,
    status,
    placedAt,
    subtotal,
    shipping,
    total,
    itemCount,
    items
  });

  return NextResponse.json(
    {
      orderId: id,
      status,
      currency: "KSh",
      subtotal,
      shipping,
      total,
      itemCount,
      placedAt,
      payment: {
        method: "M-Pesa",
        message:
          "Your order is reserved. Check your phone for the M-Pesa STK push, or pay on delivery in Nairobi."
      }
    },
    { status: 201 }
  );
}
