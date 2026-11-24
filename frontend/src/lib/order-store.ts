export type StoredOrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
};

export type StoredOrder = {
  id: string;
  status: string;
  placedAt: string;
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  items: StoredOrderItem[];
};

type OrderState = {
  orders: Map<string, StoredOrder>;
};

const globalForOrders = globalThis as unknown as {
  radiantOrders?: OrderState;
};

function state(): OrderState {
  if (!globalForOrders.radiantOrders) {
    const orders = new Map<string, StoredOrder>();
    const placedAt = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    const subtotal = 18500;

    orders.set("RR-DEMO01", {
      id: "RR-DEMO01",
      status: "Out for delivery",
      placedAt,
      subtotal,
      shipping: 0,
      total: subtotal,
      itemCount: 1,
      items: [
        {
          productId: "nairobi-dawn-trench",
          name: "Nairobi Dawn Trench",
          price: 18500,
          quantity: 1,
          size: "M",
          color: "Beige"
        }
      ]
    });

    globalForOrders.radiantOrders = { orders };
  }

  return globalForOrders.radiantOrders;
}

export function recordOrder(order: StoredOrder): void {
  state().orders.set(order.id.toUpperCase(), order);
}

export function findOrder(id: string): StoredOrder | undefined {
  return state().orders.get(id.trim().toUpperCase());
}

export function normalizeOrderId(value: string): string {
  return value.trim().toUpperCase();
}
