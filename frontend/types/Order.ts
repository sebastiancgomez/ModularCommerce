// types/Order.ts
export interface OrderRequest {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  items: OrderItemRequest[];
  total: number;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  priceAtPurchase: number; // Guardamos el precio del momento de la venta
}