export type InventoryVariant = {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  inventoryCount: number;
  variantPrice: number;
  createdAt: string;
};

export type InventoryProduct = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: string | null;
  basePrice: number;
  isArchived: boolean;
  createdAt: string;
  variantCount: number;
  stockTotal: number;
  variants: InventoryVariant[];
};

export type InventoryPayload = {
  currency: string;
  count: number;
  products: InventoryProduct[];
  source?: "database" | "mock";
  warning?: string;
};

export type InventoryVariantWithProduct = InventoryVariant & {
  productTitle: string;
};

export type CreateInventoryInput = {
  title: string;
  category: string;
  basePrice: number;
  sku: string;
  size: string;
  color: string;
  inventoryCount: number;
  description?: string;
  tenantId?: string;
};

export type UpdateVariantInput = {
  inventoryCount?: number;
  variantPrice?: number;
};

export type UpdateProductInput = {
  title?: string;
  category?: string;
  basePrice?: number;
};

export type DeleteInventoryResult = {
  action: "archived-product" | "deleted-variant";
  productId: string;
  variantId?: string;
  sku?: string;
  title?: string;
  source?: "database" | "mock";
  warning?: string;
};
