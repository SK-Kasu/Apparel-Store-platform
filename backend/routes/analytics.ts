import { PaymentStatus, Prisma } from "../generated/prisma";
import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/http";
import { prisma } from "../lib/prisma";

const analyticsQuerySchema = z.object({
  tenantId: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(12)
});

function money(value: Prisma.Decimal | number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  return Number(new Prisma.Decimal(value).toFixed(2));
}

export const analyticsRouter = Router();

analyticsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const { tenantId, limit } = analyticsQuerySchema.parse(req.query);
    const tenantFilter = tenantId ? { tenantId } : {};
    const paidFilter = { paymentStatus: PaymentStatus.PAID, ...tenantFilter };

    const [revenueByTenantRaw, totals, paidTotals, statusVolume, variantVolume] =
      await Promise.all([
        prisma.order.groupBy({
          by: ["tenantId"],
          where: paidFilter,
          _sum: { aggregateTotal: true },
          _count: { _all: true },
          _avg: { aggregateTotal: true },
          orderBy: { _sum: { aggregateTotal: "desc" } }
        }),
        prisma.order.aggregate({
          where: tenantFilter,
          _count: { _all: true },
          _sum: { aggregateTotal: true },
          _avg: { aggregateTotal: true }
        }),
        prisma.order.aggregate({
          where: paidFilter,
          _count: { _all: true },
          _sum: { aggregateTotal: true },
          _avg: { aggregateTotal: true }
        }),
        prisma.order.groupBy({
          by: ["status"],
          where: tenantFilter,
          _count: { _all: true },
          _sum: { aggregateTotal: true },
          orderBy: { status: "asc" }
        }),
        prisma.orderItem.groupBy({
          by: ["variantId"],
          where: {
            order: {
              is: paidFilter
            }
          },
          _sum: { quantity: true, lineTotal: true },
          _count: { _all: true },
          orderBy: { _sum: { quantity: "desc" } }
        })
      ]);

    const tenantIds = revenueByTenantRaw.map((group) => group.tenantId);
    const variantIds = variantVolume.map((group) => group.variantId);

    const [tenants, variants] = await Promise.all([
      tenantIds.length
        ? prisma.tenant.findMany({
            where: { id: { in: tenantIds } },
            select: { id: true, businessName: true, slug: true }
          })
        : Promise.resolve([]),
      variantIds.length
        ? prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
            select: {
              id: true,
              sku: true,
              color: true,
              size: true,
              product: {
                select: { id: true, title: true }
              }
            }
          })
        : Promise.resolve([])
    ]);

    const tenantsById = new Map(tenants.map((tenant) => [tenant.id, tenant]));
    const variantsById = new Map(variants.map((variant) => [variant.id, variant]));

    const revenueByTenant = revenueByTenantRaw
      .map((group) => {
        const tenant = tenantsById.get(group.tenantId);

        return {
          tenantId: group.tenantId,
          businessName: tenant?.businessName ?? "Unknown tenant",
          slug: tenant?.slug ?? null,
          grossRevenue: money(group._sum.aggregateTotal),
          orderCount: group._count._all,
          averageOrderValue: money(group._avg.aggregateTotal)
        };
      })
      .sort((a, b) => b.grossRevenue - a.grossRevenue);

    const orderVolumeByStatus = statusVolume
      .map((group) => ({
        status: group.status,
        count: group._count._all,
        aggregateTotal: money(group._sum.aggregateTotal)
      }))
      .sort((a, b) => b.count - a.count);

    const allVariants = variantVolume
      .map((group) => {
        const variant = variantsById.get(group.variantId);

        return {
          variantId: group.variantId,
          sku: variant?.sku ?? null,
          productId: variant?.product.id ?? null,
          productTitle: variant?.product.title ?? null,
          color: variant?.color ?? "Unknown",
          size: variant?.size ?? "Unknown",
          unitsSold: group._sum.quantity ?? 0,
          orderCount: group._count._all,
          revenue: money(group._sum.lineTotal)
        };
      })
      .filter((variant) => variant.unitsSold > 0)
      .sort(
        (a, b) =>
          b.unitsSold - a.unitsSold ||
          b.revenue - a.revenue ||
          a.color.localeCompare(b.color) ||
          a.size.localeCompare(b.size)
      );

    const topVariants = allVariants.slice(0, limit);

    const distribution = new Map<
      string,
      {
        color: string;
        size: string;
        unitsSold: number;
        orderCount: number;
        revenue: number;
      }
    >();

    for (const variant of allVariants) {
      const key = `${variant.color}\u0000${variant.size}`;
      const current = distribution.get(key);

      if (current) {
        current.unitsSold += variant.unitsSold;
        current.orderCount += variant.orderCount;
        current.revenue += variant.revenue;
      } else {
        distribution.set(key, {
          color: variant.color,
          size: variant.size,
          unitsSold: variant.unitsSold,
          orderCount: variant.orderCount,
          revenue: variant.revenue
        });
      }
    }

    const variantDistribution = [...distribution.values()]
      .map((option) => ({
        ...option,
        revenue: money(option.revenue)
      }))
      .sort(
        (a, b) =>
          b.unitsSold - a.unitsSold ||
          b.revenue - a.revenue ||
          a.color.localeCompare(b.color) ||
          a.size.localeCompare(b.size)
      )
      .slice(0, limit);

    res.json({
      generatedAt: new Date().toISOString(),
      currency: process.env.STORE_CURRENCY ?? "USD",
      filters: {
        tenantId: tenantId ?? null,
        limit
      },
      summary: {
        grossRevenue: money(paidTotals._sum.aggregateTotal),
        totalOrderVolume: totals._count._all,
        paidOrderVolume: paidTotals._count._all,
        unpaidOrderVolume: totals._count._all - paidTotals._count._all,
        averageOrderValue: money(paidTotals._avg.aggregateTotal)
      },
      revenueByTenant,
      orderVolumeByStatus,
      variantDistribution,
      topVariants
    });
  })
);

export default analyticsRouter;
