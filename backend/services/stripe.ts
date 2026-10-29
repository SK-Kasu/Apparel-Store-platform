import Stripe from 'stripe';
import { env } from '../config/env';

export const stripe = new Stripe(env.stripeSecretKey, {
  apiVersion: Stripe.API_VERSION,
  maxNetworkRetries: 2,
  timeout: 15_000,
  appInfo: {
    name: 'Seamwork Backend',
    version: '1.0.0'
  }
});
