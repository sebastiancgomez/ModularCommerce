// store/useCartStore.ts
import { create } from 'zustand';
import { CartItem } from '@/types/Cart';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  orderId: string | null;
  isOpen: boolean; 
  addItem: (newItem: CartItem, availableStock: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setOrderId: (id: string) => void;
  openCart: () => void;  // <-- Nueva acción
  closeCart: () => void; // <-- Nueva acción
  getTotal: () => number;
  getItemCount: () => number;
}

// Importante: pasar CartStore como genérico a create
export const useCartStore = create<CartStore>()(
persist(
  (set, get) => ({
  items: [],
  orderId: null,
  isOpen: false,
  addItem: (newItem, availableStock) => {
    set((state) => {
      const existingItem = state.items.find(i => i.productId === newItem.productId);
      if (existingItem) {
        const totalFutureQuantity = existingItem.quantity + newItem.quantity;
        if (totalFutureQuantity > availableStock) return state;

        return {
          items: state.items.map(i =>
            i.productId === newItem.productId
              ? { ...i, quantity: totalFutureQuantity }
              : i
          ),
        };
      }
      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (productId) => set((state) => ({
    items: state.items.filter(i => i.productId !== productId)
  })),
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(i => 
      i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i
    )
  })),
  setOrderId: (id) => set({ orderId: id }),
  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  // Solución al error de 'any' en el reduce
  getTotal: () => {
    const items = get().items;
    return items.reduce((acc: number, item: CartItem) => acc + (item.price * item.quantity), 0);
  },

  getItemCount: () => {
    const items = get().items;
    return items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
  }
}),
    {
      name: 'cart-storage', // Nombre de la llave en localStorage
      storage: createJSONStorage(() => localStorage), // Usar localStorage
    }
  )
);