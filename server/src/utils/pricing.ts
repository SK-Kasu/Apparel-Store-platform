import { env } from '../config/env';

export interface PricingLine {
  price: number;
  quantity: number;
}

export interface PricingConfig {
  taxRate: number;
  shippingFlat: number;
  freeShippingThreshold: number;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export function pricingConfigFromEnv(): PricingConfig {
  return {
    taxRate: env.TAX_RATE,
    shippingFlat: env.SHIPPING_FLAT,
    freeShippingThreshold: env.FREE_SHIPPING_THRESHOLD
  };
}

export function calculateTotals(lines: PricingLine[], config: PricingConfig): OrderTotals {
  const subtotal = lines.reduce((sum, line) => {
    if (!Number.isInteger(line.price) || line.price < 0) {
      throw new Error('Line price must be a non-negative integer amount in minor units');
    }
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      throw new Error('Line quantity must be a positive integer');
    }
    return sum + line.price * line.quantity;
  }, 0);

  const shipping =
    subtotal === 0 || subtotal >= config.freeShippingThreshold ? 0 : Math.round(config.shippingFlat);
  const tax = Math.round(subtotal * config.taxRate);
  const total = subtotal + shipping + tax;

  return { subtotal, shipping, tax, total };
}

export function formatMoney(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount / 100);
}
