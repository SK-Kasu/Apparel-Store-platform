import { randomBytes } from 'node:crypto';

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'on_hold',
  'cancelled'
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['processing', 'on_hold', 'cancelled'],
  processing: ['shipped', 'on_hold', 'cancelled'],
  shipped: ['delivered', 'on_hold'],
  on_hold: ['processing', 'cancelled'],
  delivered: [],
  cancelled: []
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return true;
  return TRANSITIONS[from].includes(to);
}

export function generateOrderNumber(now = new Date()): string {
  const year = String(now.getUTCFullYear()).slice(-2);
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const entropy = randomBytes(3).toString('hex').toUpperCase();
  return `SW-${year}${month}-${entropy}`;
}
