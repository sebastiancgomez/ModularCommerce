// types/Order.ts
export interface OrderRequest {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  priceAtPurchase: number; // Guardamos el precio del momento de la venta
}