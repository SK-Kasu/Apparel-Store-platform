import { randomUUID } from "node:crypto";
import type {
  CreateInventoryInput,
  DeleteInventoryResult,
  InventoryPayload,
  InventoryProduct,
  InventoryVariant,
  InventoryVariantWithProduct,
  UpdateProductInput,
  UpdateVariantInput
} from "./inventory-types";

type Source = "database" | "mock";

type MutationResult<T> = {
  data: T;
  source: Source;
  warning?: string;
};

type DecimalLike = { toFixed(digits: number): string };

type VariantRecord = {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  inventoryCount: number;
  variantPrice: DecimalLike;
  createdAt: Date;
};

type ProductRecord = {
  id: string;
  title: string;
  description: string;
  categoryId: string | null;
  basePrice: DecimalLike;
  isArchived: boolean;
  createdAt: Date;
  category: { id: string; name: string; slug: string } | null;
  variants: VariantRecord[];
};

type MockState = { products: InventoryProduct[] };

const globalForInventory = globalThis as unknown as {
  radiantInventoryMock?: MockState;
};

const variantSelect = {
  id: true,
  productId: true,
  sku: true,
  size: true,
  color: true,
  inventoryCount: true,
  variantPrice: true,
  createdAt: true
} as const;

export class InventoryRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "InventoryRequestError";
    this.status = status;
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown database error";
}

function isDatabaseUnavailable(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const code = (error as Error & { code?: string }).code ?? "";
  const message = error.message.toLowerCase();

  return (
    /^(p1001|p1002|p1003|p1017|p2021)$/.test(code) ||
    message.includes("can't reach database") ||
    message.includes("cant reach database") ||
    message.includes("timed out") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("did not initialize")
  );
}

function fallbackEnabled(): boolean {
  return process.env.INVENTORY_DB_FALLBACK !== "false";
}

async function withDatabaseFallback<T>(
  operation: () => Promise<T>,
  fallback: () => T
): Promise<MutationResult<T>> {
  try {
    return { data: await operation(), source: "database" };
  } catch (error) {
    if (!isDatabaseUnavailable(error) || !fallbackEnabled()) {
      throw error;
    }

    return { data: fallback(), source: "mock", warning: errorMessage(error) };
  }
}

async function database() {
  const { prisma } = await import("../../../database/client");
  return prisma;
}

function refreshProduct(product: InventoryProduct): InventoryProduct {
  return {
    ...product,
    variantCount: product.variants.length,
    stockTotal: product.variants.reduce(
      (total, variant) => total + variant.inventoryCount,
      0
    )
  };
}

function seedMockState(): MockState {
  const now = Date.now();
  const at = (hoursAgo: number) => new Date(now - hoursAgo * 3_600_000).toISOString();

  const trenchId = "mock-product-trench";
  const dressId = "mock-product-dress";
  const knitId = "mock-product-knit";

  return {
    products: [
      refreshProduct({
        id: trenchId,
        title: "Beige Trench Coat",
        description: "Belted longline trench in warm beige.",
        category: "Outerwear",
        categoryId: "mock-category-outerwear",
        basePrice: 12999,
        isArchived: false,
        createdAt: at(2),
        variantCount: 0,
        stockTotal: 0,
        variants: [
          {
            id: "mock-variant-trench-m",
            productId: trenchId,
            sku: "OUT-TRENCH-M-BEIGE",
            size: "M",
            color: "Beige",
            inventoryCount: 12,
            variantPrice: 12999,
            createdAt: at(2)
          },
          {
            id: "mock-variant-trench-l",
            productId: trenchId,
            sku: "OUT-TRENCH-L-BEIGE",
            size: "L",
            color: "Beige",
            inventoryCount: 6,
            variantPrice: 12999,
            createdAt: at(3)
          }
        ]
      }),
      refreshProduct({
        id: dressId,
        title: "Pleated Midi Dress",
        description: "Fluid pleated midi with a tie waist.",
        category: "Dresses",
        categoryId: "mock-category-dresses",
        basePrice: 8999,
        isArchived: false,
        createdAt: at(20),
        variantCount: 0,
        stockTotal: 0,
        variants: [
          {
            id: "mock-variant-dress-s",
            productId: dressId,
            sku: "DRE-MIDI-S-SAGE",
            size: "S",
            color: "Sage",
            inventoryCount: 4,
            variantPrice: 8999,
            createdAt: at(20)
          },
          {
            id: "mock-variant-dress-m",
            productId: dressId,
            sku: "DRE-MIDI-M-SAGE",
            size: "M",
            color: "Sage",
            inventoryCount: 18,
            variantPrice: 8999,
            createdAt: at(21)
          }
        ]
      }),
      refreshProduct({
        id: knitId,
        title: "Ribbed Knit Top",
        description: "Soft rib-knit crew neck.",
        category: "Tops",
        categoryId: "mock-category-tops",
        basePrice: 4599,
        isArchived: false,
        createdAt: at(50),
        variantCount: 0,
        stockTotal: 0,
        variants: [
          {
            id: "mock-variant-knit-xs",
            productId: knitId,
            sku: "TOP-RIB-XS-CREAM",
            size: "XS",
            color: "Cream",
            inventoryCount: 0,
            variantPrice: 4599,
            createdAt: at(50)
          },
          {
            id: "mock-variant-knit-m",
            productId: knitId,
            sku: "TOP-RIB-M-CREAM",
            size: "M",
            color: "Cream",
            inventoryCount: 3,
            variantPrice: 4599,
            createdAt: at(51)
          }
        ]
      })
    ]
  };
}

function mockState(): MockState {
  if (!globalForInventory.radiantInventoryMock) {
    globalForInventory.radiantInventoryMock = seedMockState();
  }

  return globalForInventory.radiantInventoryMock;
}

function decimalToNumber(value: DecimalLike): number {
  return Number(value.toFixed(2));
}

function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function serializeVariant(variant: VariantRecord): InventoryVariant {
  return {
    id: variant.id,
    productId: variant.productId,
    sku: variant.sku,
    size: variant.size,
    color: variant.color,
    inventoryCount: variant.inventoryCount,
    variantPrice: decimalToNumber(variant.variantPrice),
    createdAt: variant.createdAt.toISOString()
  };
}

function serializeProduct(product: ProductRecord): InventoryProduct {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    category: product.category?.name ?? "Uncategorized",
    categoryId: product.categoryId,
    basePrice: decimalToNumber(product.basePrice),
    isArchived: product.isArchived,
    createdAt: product.createdAt.toISOString(),
    variantCount: product.variants.length,
    stockTotal: product.variants.reduce(
      (total, variant) => total + variant.inventoryCount,
      0
    ),
    variants: product.variants.map(serializeVariant)
  };
}

export async function listInventory(): Promise<InventoryPayload> {
  const result = await withDatabaseFallback(
    async () => {
      const prisma = await database();
      const products = await prisma.product.findMany({
        where: { isArchived: false },
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          variants: { select: variantSelect, orderBy: { createdAt: "desc" } }
        }
      });

      return products.map(serializeProduct);
    },
    () =>
      mockState()
        .products.filter((product) => !product.isArchived)
        .map(refreshProduct)
  );

  return {
    currency: process.env.STORE_CURRENCY ?? "KSh",
    count: result.data.length,
    products: result.data,
    source: result.source,
    ...(result.warning ? { warning: result.warning } : {})
  };
}

async function createWithPrisma(input: CreateInventoryInput): Promise<InventoryProduct> {
  const prisma = await database();
  const price = input.basePrice.toFixed(2);

  const product = await prisma.$transaction(async (tx) => {
    let tenantId = input.tenantId;

    if (tenantId) {
      const tenant = await tx.tenant.findUnique({
        where: { id: tenantId },
        select: { id: true }
      });

      if (!tenant) {
        throw new InventoryRequestError(400, "tenantId does not reference an existing tenant");
      }
    } else {
      const configuredTenantId = process.env.INVENTORY_TENANT_ID;

      if (configuredTenantId) {
        const tenant = await tx.tenant.findUnique({
          where: { id: configuredTenantId },
          select: { id: true }
        });

        if (!tenant) {
          throw new InventoryRequestError(
            409,
            "INVENTORY_TENANT_ID does not reference an existing tenant"
          );
        }

        tenantId = tenant.id;
      } else {
        const tenant =
          (await tx.tenant.findFirst({
            where: { slug: "radiant-regalia-collection" },
            select: { id: true }
          })) ??
          (await tx.tenant.findFirst({
            select: { id: true },
            orderBy: { slug: "asc" }
          }));

        if (!tenant) {
          throw new InventoryRequestError(
            409,
            "No tenant exists. Seed the database or set INVENTORY_TENANT_ID."
          );
        }

        tenantId = tenant.id;
      }
    }

    const slug = categorySlug(input.category);
    const category = await tx.category.upsert({
      where: { slug },
      update: { name: input.category },
      create: { name: input.category, slug }
    });

    return tx.product.create({
      data: {
        tenantId,
        categoryId: category.id,
        title: input.title,
        description: input.description ?? "",
        basePrice: price,
        variants: {
          create: [
            {
              sku: input.sku,
              size: input.size,
              color: input.color,
              inventoryCount: input.inventoryCount,
              variantPrice: price
            }
          ]
        }
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { select: variantSelect, orderBy: { createdAt: "desc" } }
      }
    });
  });

  return serializeProduct(product);
}

function createMock(input: CreateInventoryInput): InventoryProduct {
  const store = mockState();
  const duplicateSku = store.products.some((product) =>
    product.variants.some(
      (variant) => variant.sku.toLowerCase() === input.sku.toLowerCase()
    )
  );

  if (duplicateSku) {
    throw new InventoryRequestError(409, "A product with that SKU already exists");
  }

  const productId = randomUUID();
  const createdAt = new Date().toISOString();

  const product = refreshProduct({
    id: productId,
    title: input.title,
    description: input.description ?? "",
    category: input.category,
    categoryId: randomUUID(),
    basePrice: input.basePrice,
    isArchived: false,
    createdAt,
    variantCount: 0,
    stockTotal: 0,
    variants: [
      {
        id: randomUUID(),
        productId,
        sku: input.sku,
        size: input.size,
        color: input.color,
        inventoryCount: input.inventoryCount,
        variantPrice: input.basePrice,
        createdAt
      }
    ]
  });

  store.products.unshift(product);
  return product;
}

export async function createInventoryItem(
  input: CreateInventoryInput
): Promise<MutationResult<InventoryProduct>> {
  return withDatabaseFallback(
    () => createWithPrisma(input),
    () => createMock(input)
  );
}

async function updateVariantWithPrisma(
  id: string,
  input: UpdateVariantInput
): Promise<InventoryVariantWithProduct> {
  const prisma = await database();
  const data: { inventoryCount?: number; variantPrice?: string } = {};

  if (input.inventoryCount !== undefined) data.inventoryCount = input.inventoryCount;
  if (input.variantPrice !== undefined) data.variantPrice = input.variantPrice.toFixed(2);

  const variant = await prisma.productVariant.update({
    where: { id },
    data,
    select: {
      ...variantSelect,
      product: { select: { id: true, title: true } }
    }
  });

  return { ...serializeVariant(variant), productTitle: variant.product.title };
}

function updateMockVariant(
  id: string,
  input: UpdateVariantInput
): InventoryVariantWithProduct {
  const store = mockState();

  for (let productIndex = 0; productIndex < store.products.length; productIndex += 1) {
    const product = store.products[productIndex];
    const variantIndex = product.variants.findIndex((variant) => variant.id === id);

    if (variantIndex < 0) continue;

    const current = product.variants[variantIndex];
    const updated: InventoryVariant = {
      ...current,
      ...(input.inventoryCount !== undefined
        ? { inventoryCount: input.inventoryCount }
        : {}),
      ...(input.variantPrice !== undefined ? { variantPrice: input.variantPrice } : {})
    };

    const variants = [...product.variants];
    variants[variantIndex] = updated;

    store.products[productIndex] = refreshProduct({ ...product, variants });

    return { ...updated, productTitle: product.title };
  }

  throw new InventoryRequestError(404, "Product variant not found");
}

export async function updateInventoryVariant(
  id: string,
  input: UpdateVariantInput
): Promise<MutationResult<InventoryVariantWithProduct>> {
  return withDatabaseFallback(
    () => updateVariantWithPrisma(id, input),
    () => updateMockVariant(id, input)
  );
}

async function updateProductWithPrisma(
  id: string,
  input: UpdateProductInput
): Promise<InventoryProduct> {
  const prisma = await database();

  const product = await prisma.$transaction(async (tx) => {
    const data: {
      title?: string;
      basePrice?: string;
      category?: { connect: { id: string } };
    } = {};

    if (input.title !== undefined) data.title = input.title;
    if (input.basePrice !== undefined) data.basePrice = input.basePrice.toFixed(2);

    if (input.category !== undefined) {
      const slug = categorySlug(input.category);
      const category = await tx.category.upsert({
        where: { slug },
        update: { name: input.category },
        create: { name: input.category, slug }
      });

      data.category = { connect: { id: category.id } };
    }

    return tx.product.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { select: variantSelect, orderBy: { createdAt: "desc" } }
      }
    });
  });

  return serializeProduct(product);
}

function updateMockProduct(id: string, input: UpdateProductInput): InventoryProduct {
  const store = mockState();
  const productIndex = store.products.findIndex((product) => product.id === id);

  if (productIndex < 0) {
    throw new InventoryRequestError(404, "Product not found");
  }

  const product = store.products[productIndex];
  const updated = refreshProduct({
    ...product,
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.category !== undefined ? { category: input.category } : {}),
    ...(input.basePrice !== undefined ? { basePrice: input.basePrice } : {})
  });

  store.products[productIndex] = updated;
  return updated;
}

export async function updateInventoryProduct(
  id: string,
  input: UpdateProductInput
): Promise<MutationResult<InventoryProduct>> {
  return withDatabaseFallback(
    () => updateProductWithPrisma(id, input),
    () => updateMockProduct(id, input)
  );
}

async function deleteVariantWithPrisma(id: string): Promise<DeleteInventoryResult> {
  const prisma = await database();

  return prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.findUnique({
      where: { id },
      select: { id: true, productId: true, sku: true }
    });

    if (!variant) {
      throw new InventoryRequestError(404, "Product variant not found");
    }

    const remaining = await tx.productVariant.count({
      where: { productId: variant.productId }
    });

    if (remaining <= 1) {
      await tx.product.update({
        where: { id: variant.productId },
        data: { isArchived: true }
      });

      return {
        action: "archived-product" as const,
        productId: variant.productId,
        variantId: variant.id,
        sku: variant.sku
      };
    }

    await tx.productVariant.delete({ where: { id } });

    return {
      action: "deleted-variant" as const,
      productId: variant.productId,
      variantId: variant.id,
      sku: variant.sku
    };
  });
}

function deleteMockVariant(id: string): DeleteInventoryResult {
  const store = mockState();

  for (let productIndex = 0; productIndex < store.products.length; productIndex += 1) {
    const product = store.products[productIndex];
    const variant = product.variants.find((item) => item.id === id);

    if (!variant) continue;

    if (product.variants.length <= 1) {
      store.products[productIndex] = refreshProduct({ ...product, isArchived: true });

      return {
        action: "archived-product",
        productId: product.id,
        variantId: variant.id,
        sku: variant.sku
      };
    }

    store.products[productIndex] = refreshProduct({
      ...product,
      variants: product.variants.filter((item) => item.id !== id)
    });

    return {
      action: "deleted-variant",
      productId: product.id,
      variantId: variant.id,
      sku: variant.sku
    };
  }

  throw new InventoryRequestError(404, "Product variant not found");
}

export async function deleteInventoryVariant(
  id: string
): Promise<MutationResult<DeleteInventoryResult>> {
  return withDatabaseFallback(
    () => deleteVariantWithPrisma(id),
    () => deleteMockVariant(id)
  );
}

async function deleteProductWithPrisma(id: string): Promise<DeleteInventoryResult> {
  const prisma = await database();
  const product = await prisma.product.update({
    where: { id },
    data: { isArchived: true },
    select: { id: true, title: true }
  });

  return {
    action: "archived-product",
    productId: product.id,
    title: product.title
  };
}

function deleteMockProduct(id: string): DeleteInventoryResult {
  const store = mockState();
  const productIndex = store.products.findIndex((product) => product.id === id);

  if (productIndex < 0) {
    throw new InventoryRequestError(404, "Product not found");
  }

  const product = store.products[productIndex];
  store.products[productIndex] = refreshProduct({ ...product, isArchived: true });

  return {
    action: "archived-product",
    productId: product.id,
    title: product.title
  };
}

export async function deleteInventoryProduct(
  id: string
): Promise<MutationResult<DeleteInventoryResult>> {
  return withDatabaseFallback(
    () => deleteProductWithPrisma(id),
    () => deleteMockProduct(id)
  );
}
