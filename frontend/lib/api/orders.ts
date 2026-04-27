import { apiFetch } from './client';
import { OrderRequest } from '@/types/Order';

export const orderService = {
  /**
   * Envía la orden al backend (.NET 8)
   * El backend debería responder con el ID de la orden generada
   */
  createOrder: async (order: OrderRequest): Promise<{ id: string }> => {
    const response = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
    
    return response.json();
  },

  /**
   * Verifica el código enviado al teléfono del cliente
   */
  verifyOtp: async (orderId: string, code: string): Promise<void> => {
    await apiFetch('/orders/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ orderId, code }),
    });
  },

  uploadReceipt: async (orderId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/upload-receipt`, {
      method: 'POST',
      body: formData,
      // IMPORTANTE: No enviar Content-Type header aquí
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error al subir comprobante' }));
      throw new Error(error.message || 'Error en el servidor');
    }
  }
};