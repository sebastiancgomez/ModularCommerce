import { apiFetch } from './client';
import { OrderRequest } from '@/types/Order';
import { apiFetchWithAuthBuyer } from './auth';

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
  verifyOtp: async (email: string, code: string, purpose: string) => {
     const response =  await apiFetch(`/orders/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, code, purpose })
    });
    return response.json();
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
  },
  getByEmail: async (email: string) => {
    const response = await apiFetchWithAuthBuyer(`/orders/getByEmail?email=${encodeURIComponent(email)}`);
    return response.json();
  },
  // Cancelar pedido (Buyer)
  cancelOrder: async (id: string) => {
    await apiFetch(`/orders/${id}/cancel`, { method: 'POST' });
  },
  requestLookupOtp: async (email: string) => {
    // Usamos query string como definimos en el controller
    const response =await apiFetch(`/orders/request-lookup?email=${encodeURIComponent(email)}`, {
      method: 'POST'
    });
    return response.json();
  },
  getById: async (id: string) => {
    const response = await apiFetch(`/orders/${id}`);
    return response.json();
  },

  /**
   * Actualiza parcialmente la dirección y el teléfono.
   * Usado justo antes de saltar a la pasarela de pago.
   */
  updateRecoveryData: async (id: string, data: { address: string; phone: string; mapUrl:string }) => {
    const response = await apiFetchWithAuthBuyer(`/orders/${id}/recovery-update`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
};
 