import { Schema, model, type HydratedDocument, type InferSchemaType } from 'mongoose';
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  type OrderStatus,
  type PaymentStatus
} from '../utils/order';

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0, validate: Number.isInteger },
    quantity: { type: Number, required: true, min: 1, max: 20, validate: Number.isInteger },
    lineTotal: { type: Number, required: true, min: 0, validate: Number.isInteger }
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    line1: { type: String, required: true, trim: true, maxlength: 160 },
    line2: { type: String, trim: true, maxlength: 160, default: '' },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    postalCode: { type: String, required: true, trim: true, maxlength: 20 },
    country: { type: String, required: true, trim: true, uppercase: true, maxlength: 2 },
    phone: { type: String, trim: true, maxlength: 40, default: '' }
  },
  { _id: false }
);

const timelineSchema = new Schema(
  {
    status: { type: String, required: true, enum: [...ORDER_STATUSES, 'payment_failed'] },
    note: { type: String, trim: true, maxlength: 300, default: '' },
    at: { type: Date, default: () => new Date() }
  },
  { _id: false }
);

const trackingSchema = new Schema(
  {
    carrier: { type: String, trim: true, maxlength: 60, default: '' },
    number: { type: String, trim: true, maxlength: 80, default: '' },
    url: { type: String, trim: true, maxlength: 400, default: '' }
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(items: unknown[]) => items.length > 0, 'Order must contain at least one item']
    },
    subtotal: { type: Number, required: true, min: 0, validate: Number.isInteger },
    shipping: { type: Number, required: true, min: 0, validate: Number.isInteger },
    tax: { type: Number, required: true, min: 0, validate: Number.isInteger },
    total: { type: Number, required: true, min: 0, validate: Number.isInteger },
    status: {
      type: String,
      enum: [...ORDER_STATUSES],
      default: 'pending',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: [...PAYMENT_STATUSES],
      default: 'unpaid',
      index: true
    },
    paymentMethod: { type: String, enum: ['stripe', 'mock'], default: 'stripe' },
    stripeSessionId: { type: String, index: true, sparse: true },
    stripePaymentIntentId: { type: String, default: '' },
    shippingAddress: { type: addressSchema, required: true },
    tracking: { type: trackingSchema, default: () => ({}) },
    timeline: { type: [timelineSchema], default: [] },
    notes: { type: String, trim: true, maxlength: 1000, default: '' },
    paidAt: { type: Date, default: null },
    fulfilledAt: { type: Date, default: null }
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ email: 1, createdAt: -1 });

export type Order = InferSchemaType<typeof orderSchema>;
export type OrderDoc = HydratedDocument<Order>;
export type { OrderStatus, PaymentStatus };

export const OrderModel = model('Order', orderSchema);
