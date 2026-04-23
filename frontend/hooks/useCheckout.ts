import { useCartStore } from '@/store/useCartStore';
import { CreateOrderDto } from '@/types/Cart';

export const useCheckout = () => {
  const { items, setOrderId } = useCartStore();

  const processOrder = async (customerData: Omit<CreateOrderDto, 'items'>) => {
    const dto: CreateOrderDto = {
      ...customerData,
      items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
    };

    try {
      const response = await fetch('TU_API_URL/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
      });

      if (!response.ok) throw new Error('Error al crear la orden');

      const orderGuid = await response.json(); // Tu backend devuelve Task<Guid>
      setOrderId(orderGuid); // Guardamos el ID en Zustand para el paso de OTP
      
      return orderGuid;
    } catch (error) {
      console.error(error);
      alert("Hubo un problema con tu orden");
    }
  };

  return { processOrder };
};