import { NextResponse } from "next/server";

type CheckoutItem = {
  id?: string;
  title?: string;
  price?: string;
  amount?: number;
  size?: string;
  color?: string;
  quantity?: number;
  category?: string;
};

type CheckoutPayload = {
  mode?: string;
  items?: CheckoutItem[];
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as CheckoutPayload | null;
  const items = payload?.items;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  }

  const invalidItem = items.some(
    (item) =>
      !item.id ||
      !item.title ||
      !item.size ||
      !item.color ||
      typeof item.amount !== "number" ||
      item.amount <= 0
  );

  if (invalidItem) {
    return NextResponse.json(
      { error: "Select a size and colour before starting checkout." },
      { status: 422 }
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 650));

  const orderNumber = `DL-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({
    success: true,
    orderNumber,
    message: "Checkout session created."
  });
}
