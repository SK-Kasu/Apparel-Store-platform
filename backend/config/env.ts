import { resolve } from 'node:path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../.env') });
config({ path: resolve(__dirname, '../../.env') });

function required(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

const port = Number(process.env.PORT ?? 4001);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error('PORT must be a positive integer');
}

export const env = {
  port,
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:3000',
  stripeSecretKey: required('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: required('STRIPE_WEBHOOK_SECRET'),
  stripeCurrency: (process.env.STRIPE_CURRENCY ?? 'usd').toLowerCase()
};
