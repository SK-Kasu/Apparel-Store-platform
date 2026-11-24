import { NextResponse } from "next/server";
import {
  deleteInventoryProduct,
  deleteInventoryVariant,
  InventoryRequestError,
  updateInventoryProduct,
  updateInventoryVariant
} from "@/lib/inventory-data";
import {
  asChoice,
  asNumber,
  asText,
  CATEGORY_OPTIONS,
  inventoryErrorResponse,
  readJsonBody
} from "@/lib/inventory-http";
import type { UpdateProductInput, UpdateVariantInput } from "@/lib/inventory-types";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };
type InventoryKind = "variant" | "product";

function readKind(
  body: Record<string, unknown>,
  request: Request
): InventoryKind {
  const raw = body.kind ?? new URL(request.url).searchParams.get("kind");

  if (raw === undefined || raw === "variant") return "variant";
  if (raw === "product") return "product";

  throw new InventoryRequestError(400, "kind must be 'variant' or 'product'");
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await readJsonBody(request);
    const kind = readKind(body, request);

    if (kind === "variant") {
      const input: UpdateVariantInput = {};

      if (body.inventoryCount !== undefined) {
        input.inventoryCount = asNumber(body.inventoryCount, "inventoryCount", {
          integer: true
        });
      }

      if (body.variantPrice !== undefined) {
        input.variantPrice = asNumber(body.variantPrice, "variantPrice", { min: 0.01 });
      }

      if (input.inventoryCount === undefined && input.variantPrice === undefined) {
        throw new InventoryRequestError(400, "Provide inventoryCount or variantPrice");
      }

      const result = await updateInventoryVariant(id, input);

      return NextResponse.json({
        variant: result.data,
        source: result.source,
        ...(result.warning ? { warning: result.warning } : {})
      });
    }

    const input: UpdateProductInput = {};

    if (body.title !== undefined) {
      input.title = asText(body.title, "title", { min: 2, max: 200 });
    }

    if (body.category !== undefined) {
      input.category = asChoice(body.category, CATEGORY_OPTIONS, "category");
    }

    if (body.basePrice !== undefined) {
      input.basePrice = asNumber(body.basePrice, "basePrice", { min: 0.01 });
    }

    if (input.title === undefined && input.category === undefined && input.basePrice === undefined) {
      throw new InventoryRequestError(400, "Provide title, category, or basePrice");
    }

    const result = await updateInventoryProduct(id, input);

    return NextResponse.json({
      product: result.data,
      source: result.source,
      ...(result.warning ? { warning: result.warning } : {})
    });
  } catch (error) {
    return inventoryErrorResponse(error);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await readJsonBody(request);
    const kind = readKind(body, request);
    const result =
      kind === "product"
        ? await deleteInventoryProduct(id)
        : await deleteInventoryVariant(id);

    return NextResponse.json({
      ...result.data,
      source: result.source,
      ...(result.warning ? { warning: result.warning } : {})
    });
  } catch (error) {
    return inventoryErrorResponse(error);
  }
}
