import { randomUUID } from "node:crypto";
import { OrderStatus, PaymentStatus, Prisma } from "../generated/prisma";
import { Router } from "express";
import { z } from "zod";
import { ApiError, asyncHandler } from "../lib/http";
import { prisma } from "../lib/prisma";

const uuidSchema = z.string().uuid();

const lineItemSchema = z.object({
  tenantId: uuidSchema.optional(),
  productId: uuidSchema,
  variantId: uuidSchema,
  quantity: z.coerce.number().int().min(1).max(25)
});

const checkoutPayloadSchema = z.union([
  z.object({
    tenantId: uuidSchema.optional(),
    items: z.array(lineItemSchema).min(1).max(25)
  }),
  z.array(lineItemSchema).min(1).max(25)
]);

type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;

type NormalizedItem = {
  productId: string;
  variantId: string;
  quantity: number;
};

function normalizePayload(payload: CheckoutPayload): {
  tenantId: string;
  items: NormalizedItem[];
} {
  const items = Array.isArray(payload) ? payload : payload.items;
  const payloadTenantId = Array.isArray(payload) ? undefined : payload.tenantId;
  const tenantId = payloadTenantId ?? items[0]?.tenantId;

  if (!tenantId) {
    throw new ApiError(400, "tenantId is required for checkout");
  }

  const requestedByVariant = new Map<string, NormalizedItem>();

  for (const item of items) {
    if (item.tenantId && item.tenantId !== tenantId) {
      throw new ApiError(400, "All checkout items must belong to the same tenant");
    }

    const existing = requestedByVariant.get(item.variantId);

    if (existing && existing.productId !== item.productId) {
      throw new ApiError(400, "A variant cannot be checked out with multiple product IDs");
    }

    const quantity = (existing?.quantity ?? 0) + item.quantity;

    if (quantity > 25) {
      throw new ApiError(400, "A variant cannot exceed 25 units per checkout", {
        variantId: item.variantId
      });
    }

    requestedByVariant.set(item.variantId, {
      productId: item.productId,
      variantId: item.variantId,
      quantity
    });
  }

  return {
    tenantId,
    items: [...requestedByVariant.values()]
  };
}

export const checkoutRouter = Router();

checkoutRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { tenantId, items } = normalizePayload(checkoutPayloadSchema.parse(req.body));

    const result = await prisma.$transaction(
      async (tx) => {
        const variants = await tx.productVariant.findMany({
          where: {
            id: { in: items.map((item) => item.variantId) }
          },
          select: {
            id: true,
            productId: true,
            sku: true,
            color: true,
            size: true,
            inventoryCount: true,
            variantPrice: true,
            product: {
              select: {
                id: true,
                tenantId: true,
                title: true,
                isArchived: true
              }
            }
          }
        });

        if (variants.length !== items.length) {
          throw new ApiError(404, "One or more product variants could not be found");
        }

        const variantsById = new Map(variants.map((variant) => [variant.id, variant]));
        const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];
        let aggregateTotal = new Prisma.Decimal(0);

        for (const item of items) {
          const variant = variantsById.get(item.variantId);

          if (!variant) {
            throw new ApiError(404, "Product variant not found");
          }

          if (variant.productId !== item.productId) {
            throw new ApiError(400, "Variant does not belong to the supplied product");
          }

          if (variant.product.tenantId !== tenantId) {
            throw new ApiError(404, "Product variant not found for this tenant");
          }

          if (variant.product.isArchived) {
            throw new ApiError(409, "Product is no longer available", {
              variantId: variant.id,
              sku: variant.sku
            });
          }

          if (variant.inventoryCount < item.quantity) {
            throw new ApiError(409, "Insufficient inventory", {
              variantId: variant.id,
              sku: variant.sku,
              requested: item.quantity,
              available: variant.inventoryCount
            });
          }

          const inventoryUpdate = await tx.productVariant.updateMany({
            where: {
              id: variant.id,
              inventoryCount: { gte: item.quantity }
            },
            data: {
              inventoryCount: { decrement: item.quantity }
            }
          });

          if (inventoryUpdate.count !== 1) {
            throw new ApiError(409, "Inventory changed during checkout. Please retry.", {
              variantId: variant.id,
              sku: variant.sku
            });
          }

          const lineTotal = variant.variantPrice.mul(item.quantity);
          aggregateTotal = aggregateTotal.add(lineTotal);

          orderItems.push({
            product: { connect: { id: variant.productId } },
            variant: { connect: { id: variant.id } },
            quantity: item.quantity,
            unitPrice: variant.variantPrice,
            lineTotal
          });
        }

        const paymentReference = `mock_${randomUUID()}`;

        const order = await tx.order.create({
          data: {
            tenantId,
            status: OrderStatus.PROCESSING,
            paymentStatus: PaymentStatus.PAID,
            paymentReference,
            aggregateTotal,
            items: {
              create: orderItems
            }
          },
          include: {
            items: {
              select: {
                id: true,
                productId: true,
                variantId: true,
                quantity: true,
                unitPrice: true,
                lineTotal: true
              }
            }
          }
        });

        return { order, paymentReference };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5_000,
        timeout: 10_000
      }
    );

    res.status(201).json({
      orderId: result.order.id,
      tenantId: result.order.tenantId,
      status: result.order.status,
      paymentStatus: result.order.paymentStatus,
      paymentReference: result.paymentReference,
      aggregateTotal: result.order.aggregateTotal.toFixed(2),
      items: result.order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toFixed(2),
        lineTotal: item.lineTotal.toFixed(2)
      }))
    });
  })
);

export default checkoutRouter;
