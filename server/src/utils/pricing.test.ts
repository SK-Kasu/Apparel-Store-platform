import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { calculateTotals } from './pricing';
import { canTransition, generateOrderNumber } from './order';

const config = { taxRate: 0.1, shippingFlat: 1000, freeShippingThreshold: 20000 };

describe('calculateTotals', () => {
  it('adds tax on subtotal and charges flat shipping below threshold', () => {
    const totals = calculateTotals([{ price: 5000, quantity: 2 }], config);
    assert.deepEqual(totals, { subtotal: 10000, shipping: 1000, tax: 1000, total: 12000 });
  });

  it('removes shipping at or above the free shipping threshold', () => {
    const totals = calculateTotals([{ price: 20000, quantity: 1 }], config);
    assert.equal(totals.shipping, 0);
    assert.equal(totals.tax, 2000);
    assert.equal(totals.total, 22000);
  });

  it('rejects invalid prices and quantities', () => {
    assert.throws(() => calculateTotals([{ price: -1, quantity: 1 }], config));
    assert.throws(() => calculateTotals([{ price: 100, quantity: 0 }], config));
    assert.throws(() => calculateTotals([{ price: 10.5, quantity: 1 }], config));
  });
});

describe('order helpers', () => {
  it('creates stable, prefixed order numbers', () => {
    const number = generateOrderNumber(new Date('2026-03-09T10:00:00Z'));
    assert.match(number, /^SW-2603-[A-F0-9]{6}$/);
  });

  it('protects terminal order states', () => {
    assert.equal(canTransition('pending', 'processing'), true);
    assert.equal(canTransition('processing', 'shipped'), true);
    assert.equal(canTransition('shipped', 'delivered'), true);
    assert.equal(canTransition('delivered', 'processing'), false);
    assert.equal(canTransition('cancelled', 'pending'), false);
  });
});
