'use client';

import { useCartStore } from '@/store/useCartStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { orderService } from '@/lib/api/orders';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { OrderRequest } from '@/types/Order';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const addNotification = useNotificationStore(s => s.addNotification);
  
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Cali'
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const order: OrderRequest = {
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.price
      }))
    };

   try {
      const response = await orderService.createOrder(order);
      addNotification("¡Orden creada! Revisa tu correo.", "success");
      console.log(response);
      router.push(`/checkout/verify?orderId=${response}`);

    } catch (err: unknown) { // 1. Cambiamos 'any' por 'unknown'
      console.error("Error al crear la orden", err);
      
      // 2. Extraemos el mensaje de forma segura
      let errorMessage = "No se pudo crear la orden. Intenta de nuevo.";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      addNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return <div className="page text-center">Cargando resumen de compra...</div>;
  }

  return (
    <div className="page container-small">
      <h2>Finalizar Compra</h2>
      
      <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '20px' }}>
        <div className="card">
          <h3>Datos de Envío</h3>
          <input 
            type="text" 
            placeholder="Nombre completo" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="tel" 
            placeholder="Whatsapp / Número telefónico" 
            required 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Dirección de entrega" 
            required 
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div className="card">
          <h3>Resumen del Pedido</h3>
          {items.map(item => (
            <div key={item.productId} className="flex-row justify-between">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toLocaleString('es-CO')}</span>
            </div>
          ))}
          <hr />
          <div className="flex-row justify-between" style={{ fontWeight: 'bold' }}>
            <span>Total a pagar:</span>
            <span>${getTotal().toLocaleString('es-CO')}</span>
          </div>
        </div>

        <button type="submit" className="button button-full" disabled={loading || items.length === 0}>
          {loading ? 'Procesando...' : 'Confirmar Pedido'}
        </button>

        <button 
            type="button"
            className="button-continue button-full"
            onClick={() => router.push('/')}
        >
            ← Seguir Comprando
        </button>
      </form>
    </div>
  );
}