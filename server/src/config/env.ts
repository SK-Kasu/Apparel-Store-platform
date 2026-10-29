import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017/seamwork'),
  JWT_SECRET: z.string().min(16).optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  COOKIE_NAME: z.string().default('sw_token'),
  COOKIE_SECURE: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_CURRENCY: z.string().default('usd'),
  TAX_RATE: z.coerce.number().min(0).max(0.3).default(0.0825),
  SHIPPING_FLAT: z.coerce.number().int().min(0).default(1200),
  FREE_SHIPPING_THRESHOLD: z.coerce.number().int().min(0).default(20000),
  ADMIN_EMAIL: z.string().email().default('admin@seamwork.test'),
  ADMIN_PASSWORD: z.string().min(8).default('admin12345')
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const raw = parsed.data;

if (raw.NODE_ENV === 'production' && (!raw.JWT_SECRET || raw.JWT_SECRET.length < 32)) {
  console.error('JWT_SECRET must be set to a random string of at least 32 characters in production.');
  process.exit(1);
}

if (raw.NODE_ENV === 'production' && !raw.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set. Checkout will return 503 in production.');
}

if (raw.STRIPE_SECRET_KEY && !raw.STRIPE_WEBHOOK_SECRET) {
  console.warn('STRIPE_WEBHOOK_SECRET is not set. The Stripe webhook will reject all events.');
}

export const env = {
  ...raw,
  JWT_SECRET: raw.JWT_SECRET ?? 'dev-only-secret-do-not-use-in-production'
};

export const isProd = env.NODE_ENV === 'production';
export const stripeEnabled = Boolean(env.STRIPE_SECRET_KEY);
export const clientOrigins = env.CLIENT_URL.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
