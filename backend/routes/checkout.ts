import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../database/client';
import { env } from '../config/env';
import { stripe } from '../services/stripe';
import { ApiError, asyncHandler } from '../utils/http';
import { centsToAmount, decimalToCents } from '../utils/money';

type CheckoutSession = Awaited<ReturnType<typeof stripe.checkout.sessions.create>>;

const checkoutRequestSchema = z
  .object({
    items: z
      .array(
        z.object({
          tenantId: z.string().uuid(),
          variantId: z.string().uuid(),
          quantity: z.number().int().min(1).max(20)
        })
      )
      .min(1)
      .max(50),
    customer: z.object({
      email: z.string().email().max(254),
      name: z.string().trim().min(1).max(120).optional(),
      metadata: z
        .record(z.string().max(40), z.string().max(500))
        .refine((value) => Object.keys(value).length <= 20, {
          message: 'Customer metadata cannot contain more than 20 keys'
        })
        .optional()
    })
  })
  .strict();

export const checkoutRouter = Router();

checkoutRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const parsed = checkoutRequestSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: 'Invalid checkout payload',
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message
        }))
      });
      return;
    }

    const { items, customer } = parsed.data;
    const tenantIds = new Set(items.map((item) => item.tenantId));

    if (tenantIds.size !== 1) {
      throw new ApiError(400, 'All checkout items must belong to a single tenant');
    }

    const quantities = new Map<string, number>();

    for (const item of items) {
      const quantity = (quantities.get(item.variantId) ?? 0) + item.quantity;

      if (quantity > 20) {
        throw new ApiError(400, 'Maximum quantity per variant is 20');
      }

      quantities.set(item.variantId, quantity);
    }

    const tenantId = items[0].tenantId;
    const variantIds = [...quantities.keys()];

    const { order, variants, totalCents } = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.findUnique({ where: { id: tenantId } });

      if (!tenant) {
        throw new ApiError(404, 'Tenant not found');
      }

      const variants = await tx.productVariant.findMany({
        where: { id: { in: variantIds } },
        include: { product: true }
      });

      if (variants.length !== variantIds.length) {
        throw new ApiError(400, 'One or more product variants are unavailable');
      }

      let totalCents = 0;

      for (const variant of variants) {
        const quantity = quantities.get(variant.id) ?? 0;

        if (variant.product.tenantId !== tenant.id) {
          throw new ApiError(400, 'A product variant does not belong to the requested tenant');
        }

        if (variant.product.isArchived) {
          throw new ApiError(409, `${variant.sku} is no longer available`);
        }

        if (variant.inventoryCount < quantity) {
          throw new ApiError(409, `Insufficient inventory for ${variant.sku}`);
        }

        const unitPrice = decimalToCents(variant.variantPrice.toString());

        if (unitPrice <= 0) {
          throw new ApiError(500, `Invalid price configured for ${variant.sku}`);
        }

        totalCents += unitPrice * quantity;

        if (!Number.isSafeInteger(totalCents)) {
          throw new ApiError(500, 'Order total exceeds the supported range');
        }
      }

      const order = await tx.order.create({
        data: {
          tenantId: tenant.id,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          aggregateTotal: centsToAmount(totalCents)
        }
      });

      return { order, variants, totalCents };
    });

    const metadata: Record<string, string> = {
      ...(customer.metadata ?? {}),
      orderId: order.id,
      tenantId
    };

    if (customer.name) {
      metadata.customerName = customer.name;
    }

    const paymentIntentMetadata = {
      orderId: order.id,
      tenantId
    };

    let session: CheckoutSession;

    try {
      session = await stripe.checkout.sessions.create(
        {
          mode: 'payment',
          customer_email: customer.email,
          client_reference_id: order.id,
          metadata,
          payment_intent_data: { metadata: paymentIntentMetadata },
          line_items: variants.map((variant) => ({
            quantity: quantities.get(variant.id) ?? 1,
            price_data: {
              currency: env.stripeCurrency,
              unit_amount: decimalToCents(variant.variantPrice.toString()),
              product_data: {
                name: variant.product.title,
                description: `${variant.size} / ${variant.color} · SKU ${variant.sku}`,
                metadata: {
                  variantId: variant.id,
                  productId: variant.productId
                }
              }
            }
          })),
          success_url: `${env.clientUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${env.clientUrl}/checkout/cancel?order_id=${order.id}`,
          billing_address_collection: 'auto',
          shipping_address_collection: {
            allowed_countries: [
              'US',
              'CA',
              'GB',
              'DE',
              'FR',
              'DK',
              'SE',
              'NO',
              'NL',
              'BE',
              'ES',
              'IT',
              'AU',
              'JP'
            ]
          },
          expires_at: Math.floor(Date.now() / 1000) + 1_860
        },
        { idempotencyKey: `checkout-${order.id}` }
      );
    } catch (error) {
      console.error('[checkout] Stripe session creation failed', error);
      await prisma.order
        .update({ where: { id: order.id }, data: { paymentStatus: 'FAILED' } })
        .catch(() => undefined);
      throw new ApiError(502, 'Unable to create checkout session');
    }

    if (!session.url) {
      await prisma.order
        .update({ where: { id: order.id }, data: { paymentStatus: 'FAILED' } })
        .catch(() => undefined);
      throw new ApiError(502, 'Stripe did not return a checkout URL');
    }

    await prisma.order
      .update({ where: { id: order.id }, data: { stripeSessionId: session.id } })
      .catch((error) => {
        console.error('[checkout] Failed to persist Stripe session id', error);
      });

    res.status(201).json({
      orderId: order.id,
      checkoutUrl: session.url,
      sessionId: session.id,
      amountTotal: totalCents,
      currency: env.stripeCurrency
    });
  })
);
