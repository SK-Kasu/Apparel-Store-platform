import {
  COLOR_OPTIONS,
  PRODUCTS,
  SIZE_OPTIONS,
  type StoreProduct
} from "./catalog";

export { COLOR_OPTIONS, SIZE_OPTIONS };
export type Recommendation = StoreProduct;

export const RECOMMENDATIONS: StoreProduct[] = PRODUCTS.slice(0, 4);
