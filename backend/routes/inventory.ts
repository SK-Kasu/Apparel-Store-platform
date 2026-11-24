import { Prisma } from "../generated/prisma";
import { Router } from "express";
import { z } from "zod";
import { ApiError, asyncHandler } from "../lib/http";
import { prisma } from "../lib/prisma";

const CATEGORY_OPTIONS = [
  "Dresses",
  "Tops",
  "Outerwear",
  "Pants",
  "Shoes",
  "Bags",
  "Accessories"
] as const;

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const uuidSchema = z.string().uuid();
const priceSchema = z.coerce
  .number()
  .positive("Price must be greater than zero")
  .max(1_000_000, "Price is too large")
  .refine((value) => Number.isFinite(value), { message: "Price must be a valid number" });
const stockSchema = z.coerce.number().int().min(0).max(1_000_000);

const createSchema = z.object({
  title: z.string().trim().min(2).max(200),
  category: z.enum(CATEGORY_OPTIONS),
  basePrice: priceSchema,
  sku: z.string().trim().min(2).max(64),
  size: z.enum(SIZE_OPTIONS),
  color: z.string().trim().min(2).max(64),
  inventoryCount: stockSchema,
  tenantId: uuidSchema.optional(),
  description: z.string().trim().max(2000).optional()
});

const updateVariantSchema = z
  .object({
    inventoryCount: stockSchema.optional(),
    variantPrice: priceSchema.optional()
  })
  .refine(
    (value) => value.inventoryCount !== undefined || value.variantPrice !== undefined,
    { message: "Provide inventoryCount or variantPrice" }
  );

const updateProductSchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),
    category: z.enum(CATEGORY_OPTIONS).optional(),
    basePrice: priceSchema.optional()
  })
  .refine(
    (value) =>
      value.title !== undefined || value.category !== undefined || value.basePrice !== undefined,
    { message: "Provide title, category, or basePrice" }
  );

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

type VariantRecord = {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  inventoryCount: number;
  variantPrice: Prisma.Decimal;
  createdAt: Date;
};

type ProductRecord = {
  id: string;
  title: string;
  description: string;
  categoryId: string | null;
  basePrice: Prisma.Decimal;
  isArchived: boolean;
  createdAt: Date;
  category: { id: string; name: string; slug: string } | null;
  variants: VariantRecord[];
};

function decimalToNumber(value: Prisma.Decimal): number {
  return Number(value.toFixed(2));
}

function decimalFromNumber(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value.toFixed(2));
}

function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function resolveTenantId(
  tx: Prisma.TransactionClient,
  requestedTenantId?: string
): Promise<string> {
  if (requestedTenantId) {
    const tenant = await tx.tenant.findUnique({
      where: { id: requestedTenantId },
      select: { id: true }
    });

    if (!tenant) {
      throw new ApiError(400, "tenantId does not reference an existing tenant");
    }

    return tenant.id;
  }

  const configuredTenantId = process.env.INVENTORY_TENANT_ID;

  if (configuredTenantId) {
    const tenant = await tx.tenant.findUnique({
      where: { id: configuredTenantId },
      select: { id: true }
    });

    if (!tenant) {
      throw new ApiError(409, "INVENTORY_TENANT_ID does not reference an existing tenant");
    }

    return tenant.id;
  }

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
    throw new ApiError(409, "No tenant exists. Seed the database or set INVENTORY_TENANT_ID.");
  }

  return tenant.id;
}

function serializeVariant(variant: VariantRecord) {
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

function serializeProduct(product: ProductRecord) {
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
    stockTotal: product.variants.reduce((total, variant) => total + variant.inventoryCount, 0),
    variants: product.variants.map(serializeVariant)
  };
}

export const inventoryRouter = Router();

inventoryRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: { select: variantSelect, orderBy: { createdAt: "desc" } }
      }
    });

    res.json({
      currency: process.env.STORE_CURRENCY ?? "KSh",
      count: products.length,
      products: products.map(serializeProduct)
    });
  })
);

inventoryRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = createSchema.parse(req.body);
    const price = decimalFromNumber(payload.basePrice);

    const product = await prisma.$transaction(async (tx) => {
      const tenantId = await resolveTenantId(tx, payload.tenantId);
      const slug = categorySlug(payload.category);
      const category = await tx.category.upsert({
        where: { slug },
        update: { name: payload.category },
        create: { name: payload.category, slug }
      });

      return tx.product.create({
        data: {
          tenantId,
          categoryId: category.id,
          title: payload.title,
          description: payload.description ?? "",
          basePrice: price,
          variants: {
            create: [
              {
                sku: payload.sku,
                size: payload.size,
                color: payload.color,
                inventoryCount: payload.inventoryCount,
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

    res.status(201).json({ product: serializeProduct(product) });
  })
);

inventoryRouter.patch(
  "/variants/:id",
  asyncHandler(async (req, res) => {
    const id = uuidSchema.parse(req.params.id);
    const payload = updateVariantSchema.parse(req.body);
    const data: Prisma.ProductVariantUpdateInput = {};

    if (payload.inventoryCount !== undefined) {
      data.inventoryCount = payload.inventoryCount;
    }

    if (payload.variantPrice !== undefined) {
      data.variantPrice = decimalFromNumber(payload.variantPrice);
    }

    const variant = await prisma.productVariant.update({
      where: { id },
      data,
      select: {
        ...variantSelect,
        product: { select: { id: true, title: true } }
      }
    });

    res.json({
      variant: {
        ...serializeVariant(variant),
        productTitle: variant.product.title
      }
    });
  })
);

inventoryRouter.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = uuidSchema.parse(req.params.id);
    const payload = updateProductSchema.parse(req.body);

    const product = await prisma.$transaction(async (tx) => {
      const data: Prisma.ProductUpdateInput = {};

      if (payload.title !== undefined) data.title = payload.title;
      if (payload.basePrice !== undefined) data.basePrice = decimalFromNumber(payload.basePrice);

      if (payload.category !== undefined) {
        const slug = categorySlug(payload.category);
        const category = await tx.category.upsert({
          where: { slug },
          update: { name: payload.category },
          create: { name: payload.category, slug }
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

    res.json({ product: serializeProduct(product) });
  })
);

inventoryRouter.delete(
  "/variants/:id",
  asyncHandler(async (req, res) => {
    const id = uuidSchema.parse(req.params.id);

    const result = await prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findUnique({
        where: { id },
        select: { id: true, productId: true, sku: true }
      });

      if (!variant) {
        throw new ApiError(404, "Product variant not found");
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

    res.json(result);
  })
);

inventoryRouter.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = uuidSchema.parse(req.params.id);
    const product = await prisma.product.update({
      where: { id },
      data: { isArchived: true },
      select: { id: true, title: true }
    });

    res.json({
      action: "archived-product" as const,
      productId: product.id,
      title: product.title
    });
  })
);

export default inventoryRouter;
