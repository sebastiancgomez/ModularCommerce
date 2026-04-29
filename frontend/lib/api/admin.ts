// lib/api/admin.ts
import { fetchWithAuth } from './auth';
import {OrderItemRequest} from "@/types/Order";

export interface AdminOrder {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  address: string
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentFileUrl?: string; // La URL de Cloudinary
  items: OrderItemRequest[];
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
  },

  prepareOrder: async (id: string) => {
    await fetchWithAuth(`/admin/orders/${id}/prepare`, { method: 'POST' });
  },

  dispatchOrder: async (id: string) => {
    await fetchWithAuth(`/admin/orders/${id}/deliver`, { method: 'POST' });
  },

  markAsDelivered: async (id: string) => {
    await fetchWithAuth(`/admin/orders/${id}/delivered`, { method: 'POST' });
  },
 

};