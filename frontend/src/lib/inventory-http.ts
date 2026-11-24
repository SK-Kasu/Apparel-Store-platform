import { NextResponse } from "next/server";
import { InventoryRequestError } from "./inventory-data";

export const CATEGORY_OPTIONS = [
  "Dresses",
  "Tops",
  "Outerwear",
  "Pants",
  "Shoes",
  "Bags",
  "Accessories"
] as const;

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export function inventoryErrorResponse(error: unknown) {
  const status = error instanceof InventoryRequestError ? error.status : 500;
  const message = error instanceof Error ? error.message : "Unexpected inventory error";

  return NextResponse.json({ error: message }, { status });
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  const text = await request.text();

  if (!text.trim()) {
    return {};
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new InventoryRequestError(400, "Request body must be valid JSON");
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new InventoryRequestError(400, "Request body must be a JSON object");
  }

  return parsed as Record<string, unknown>;
}

export function asText(
  value: unknown,
  field: string,
  { min = 1, max = 200 }: { min?: number; max?: number } = {}
): string {
  if (typeof value !== "string") {
    throw new InventoryRequestError(400, `${field} must be a string`);
  }

  const text = value.trim();

  if (text.length < min || text.length > max) {
    throw new InventoryRequestError(400, `${field} must be between ${min} and ${max} characters`);
  }

  return text;
}

export function asNumber(
  value: unknown,
  field: string,
  {
    min = 0,
    max = 1_000_000,
    integer = false
  }: { min?: number; max?: number; integer?: boolean } = {}
): number {
  const numeric =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(numeric) || numeric < min || numeric > max) {
    throw new InventoryRequestError(400, `${field} must be a number between ${min} and ${max}`);
  }

  if (integer && !Number.isInteger(numeric)) {
    throw new InventoryRequestError(400, `${field} must be a whole number`);
  }

  return numeric;
}

export function asChoice<T extends string>(
  value: unknown,
  options: readonly T[],
  field: string
): T {
  if (typeof value !== "string" || !options.includes(value as T)) {
    throw new InventoryRequestError(400, `${field} must be one of ${options.join(", ")}`);
  }

  return value as T;
}
