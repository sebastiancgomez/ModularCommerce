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

// types/Order.ts
export interface OrderResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  productName:string;
  quantity: number;
  unitPrice: number; // Guardamos el precio del momento de la venta
}