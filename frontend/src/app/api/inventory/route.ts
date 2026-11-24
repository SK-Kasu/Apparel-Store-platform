import { NextResponse } from "next/server";
import { createInventoryItem, listInventory } from "@/lib/inventory-data";
import type { CreateInventoryInput } from "@/lib/inventory-types";
import {
  asChoice,
  asNumber,
  asText,
  CATEGORY_OPTIONS,
  inventoryErrorResponse,
  readJsonBody,
  SIZE_OPTIONS
} from "@/lib/inventory-http";

export const runtime = "nodejs";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET() {
  try {
    return NextResponse.json(await listInventory());
  } catch (error) {
    return inventoryErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await readJsonBody(request);

    const tenantId =
      body.tenantId === undefined ? undefined : asText(body.tenantId, "tenantId", { max: 100 });

    if (tenantId && !UUID_PATTERN.test(tenantId)) {
      throw new Error("tenantId must be a valid UUID");
    }

    const input: CreateInventoryInput = {
      title: asText(body.title, "title", { min: 2, max: 200 }),
      category: asChoice(body.category, CATEGORY_OPTIONS, "category"),
      basePrice: asNumber(body.basePrice, "basePrice", { min: 0.01 }),
      sku: asText(body.sku, "sku", { min: 2, max: 64 }),
      size: asChoice(body.size, SIZE_OPTIONS, "size"),
      color: asText(body.color, "color", { min: 2, max: 64 }),
      inventoryCount: asNumber(body.inventoryCount, "inventoryCount", { integer: true }),
      description:
        body.description === undefined
          ? undefined
          : asText(body.description, "description", { min: 0, max: 2000 }),
      tenantId
    };

    const result = await createInventoryItem(input);

    return NextResponse.json(
      {
        product: result.data,
        source: result.source,
        ...(result.warning ? { warning: result.warning } : {})
      },
      { status: 201 }
    );
  } catch (error) {
    return inventoryErrorResponse(error);
  }
}
