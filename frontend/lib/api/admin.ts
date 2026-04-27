// lib/api/admin.ts
import { fetchWithAuth } from './auth';

export interface AdminOrder {
  id: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentFileUrl?: string; // La URL de Cloudinary
}

export const adminService = {
  getOrders: async (): Promise<AdminOrder[]> => {
    const res = await fetchWithAuth('/admin/orders');
    return res.json();
  },

  getOrderById: async (id: string): Promise<AdminOrder> => {
    const res = await fetchWithAuth(`/admin/orders/${id}`);
    return res.json();
  },

  approveOrder: async (id: string) => {
    await fetchWithAuth(`/admin/orders/${id}/approve`, { method: 'POST' });
  },

  rejectOrder: async (id: string) => {
    await fetchWithAuth(`/admin/orders/${id}/reject`, { method: 'POST' });
  }
};