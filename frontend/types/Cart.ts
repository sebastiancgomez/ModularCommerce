export interface CartItem {
  productId: string; // Guid del backend
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}
/*
interface CartStore {
  items: CartItem[];
  orderId: string | null; // Para persistir el GUID tras CreateOrder
  addItem: (product: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderId: (id: string) => void;
  getTotal: () => number;
}*/
export interface CreateOrderDto {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  items: { productId: string; quantity: number }[];
}