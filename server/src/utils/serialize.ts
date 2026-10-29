import type { UserDoc } from '../models/User';
import type { OrderDoc } from '../models/Order';
import type { ProductDoc } from '../models/Product';

export function serializeUser(user: UserDoc | { _id: unknown; name: string; email: string; role: string }) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export function serializeProduct(product: ProductDoc | Record<string, any>) {
  const doc = 'toObject' in product ? product.toObject() : product;
  const sizes = (doc.sizes ?? []).map((size: { size: string; stock: number }) => ({
    size: size.size,
    stock: size.stock
  }));

  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    code: doc.code,
    category: doc.category,
    price: doc.price,
    compareAt: doc.compareAt ?? null,
    description: doc.description,
    story: doc.story,
    details: doc.details ?? [],
    specs: doc.specs ?? [],
    care: doc.care ?? [],
    image: doc.image,
    images: doc.images?.length ? doc.images : [doc.image],
    sizes,
    totalStock: sizes.reduce((sum: number, size: { stock: number }) => sum + size.stock, 0),
    status: doc.status,
    featured: doc.featured,
    drop: doc.drop,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}

export function serializeOrder(order: OrderDoc | Record<string, any>, options = { admin: false }) {
  const doc = 'toObject' in order ? order.toObject() : order;

  return {
    id: String(doc._id),
    orderNumber: doc.orderNumber,
    email: doc.email,
    user: doc.user ? String(doc.user) : null,
    items: (doc.items ?? []).map((item: Record<string, any>) => ({
      product: String(item.product),
      name: item.name,
      slug: item.slug,
      image: item.image,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      lineTotal: item.lineTotal
    })),
    subtotal: doc.subtotal,
    shipping: doc.shipping,
    tax: doc.tax,
    total: doc.total,
    status: doc.status,
    paymentStatus: doc.paymentStatus,
    paymentMethod: doc.paymentMethod,
    shippingAddress: doc.shippingAddress,
    tracking: doc.tracking ?? {},
    timeline: doc.timeline ?? [],
    notes: doc.notes ?? '',
    paidAt: doc.paidAt,
    fulfilledAt: doc.fulfilledAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    ...(options.admin
      ? {
          stripeSessionId: doc.stripeSessionId ?? '',
          stripePaymentIntentId: doc.stripePaymentIntentId ?? ''
        }
      : {})
  };
}
