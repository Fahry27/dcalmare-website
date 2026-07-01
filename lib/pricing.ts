import type { Product } from "@prisma/client";

export const PRE_ORDER_PRICE = 218888;
export const REGULAR_PRICE = 248888;

export function getActiveProductPrice(product: Pick<Product, "isPreOrder" | "price">) {
  return product.isPreOrder ? PRE_ORDER_PRICE : REGULAR_PRICE;
}
