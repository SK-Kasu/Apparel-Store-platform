import express, { Router } from 'express';
import type Stripe from 'stripe';
import { prisma } from '../../database/client';
import { env } from '../config/env';
import { stripe } from '../services/stripe';
import { asyncHandler } from '../utils/http';
import { decimalToCents } from '../utils/money';

export const webhookRouter = Router();

webhookRouter.post(
  '/',
  express.raw({ type: 'application/json', limit: '1mb' }),
  asyncHandler(async (req, res) => {
    const signature = req.headers['stripe-signature'];

    if (typeof signature !== 'string') {
      res.status(400).json({ error: 'Missing Stripe signature' });
      return;
    }

    if (!Buffer.isBuffer(req.body)) {
      res.status(400).json({ error: 'Invalid webhook payload' });
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        env.stripeWebhookSecret
      );
    } catch (error) {
      console.error('[webhook] Stripe signature verification failed', error);
      res.status(400).json({ error: 'Invalid webhook signature' });
      return;
    }

    if (event.type !== 'checkout.session.completed') {
      res.json({ received: true, ignored: true });
      return;
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== 'paid') {
      res.json({ received: true, ignored: true });
      return;
    }

    const orderId = session.metadata?.orderId ?? session.client_reference_id;
    const tenantId = session.metadata?.tenantId;

    if (!orderId || !tenantId) {
      res.status(400).json({ error: 'Missing order metadata' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        tenantId: true,
        aggregateTotal: true,
        paymentStatus: true
      }
    });

    if (!order || order.tenantId !== tenantId) {
      console.error('[webhook] Order reference is missing or cross-tenant', {
        orderId,
        tenantId
      });
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.paymentStatus === 'PAID' || order.paymentStatus === 'REFUNDED') {
      res.json({ received: true, duplicate: true });
      return;
    }

    const expectedCents = decimalToCents(order.aggregateTotal.toString());

    if (session.amount_total !== expectedCents) {
      console.error('[webhook] Checkout amount does not match the order ledger', {
        orderId,
        expectedCents,
        receivedCents: session.amount_total
      });
      res.status(409).json({ error: 'Payment amount mismatch' });
      return;
    }

    if (session.currency && session.currency.toLowerCase() !== env.stripeCurrency) {
      console.error('[webhook] Checkout currency does not match configuration', {
        orderId,
        expectedCurrency: env.stripeCurrency,
        receivedCurrency: session.currency
      });
      res.status(409).json({ error: 'Payment currency mismatch' });
      return;
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const updated = await prisma.order.updateMany({
      where: {
        id: order.id,
        paymentStatus: { in: ['UNPAID', 'FAILED'] }
      },
      data: {
        paymentStatus: 'PAID',
        paidAt: new Date(),
        stripeSessionId: session.id,
        stripePaymentIntentId: paymentIntentId
      }
    });

    if (updated.count === 0) {
      const current = await prisma.order.findUnique({
        where: { id: order.id },
        select: { paymentStatus: true }
      });

      if (current?.paymentStatus === 'PAID' || current?.paymentStatus === 'REFUNDED') {
        res.json({ received: true, duplicate: true });
        return;
      }

      res.status(409).json({ error: 'Order cannot be marked as paid' });
      return;
    }

    res.json({ received: true });
  })
);
