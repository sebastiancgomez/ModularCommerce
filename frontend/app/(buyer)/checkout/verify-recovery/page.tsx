'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { orderService } from '@/lib/api/orders';
import { useNotificationStore } from '@/store/useNotificationStore';
import { OrderResponse } from '@/types/Order';

export default function CheckoutRecoveryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const addNotification = useNotificationStore(s => s.addNotification);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  
  // Campos editables
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!orderId) {
      router.push('/orders');
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await orderService.getById(orderId); // Necesitas este método en tu service
        setOrder(data);
        setAddress(data.address);
        setPhone(data.phone);
      } catch  {
        addNotification("Error al cargar la orden", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router, addNotification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Guardar cambios
      await orderService.updateRecoveryData(orderId!, { address, phone });
      
      // 2. Saltar a la pasarela de pago (Punto 2 de tu lista original)
      router.push(`/checkout/payment?orderId=${orderId}`);
    } catch  {
      addNotification("Error al actualizar datos", "error");
    }
  };

  if (loading) return <div className="container page">Cargando datos del pedido...</div>;

  return (
    <div className="page container-small">
      <h2>Verifica tus datos</h2>
      <p style={{ color: '#888', marginBottom: '20px' }}>
        Antes de proceder al pago, confirma que tu información de envío sea correcta.
      </p>

      <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '15px' }}>
        
        <div className="form-group">
          <label>Nombre Completo</label>
          <input type="text" className="input-field disabled" value={order?.fullName} disabled />
        </div>

        <div className="form-group">
          <label>Correo Electrónico</label>
          <input type="text" className="input-field disabled" value={order?.email} disabled />
        </div>

        <div className="form-group">
          <label>Dirección de Envío</label>
          <input 
            type="text" 
            className="input-field" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Teléfono de Contacto</label>
          <input 
            type="text" 
            className="input-field" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </div>
        

        <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
           <p>Total a pagar: <strong>{order?.totalAmount}</strong></p>
           <button type="submit" className="button button-full" >
             Confirmar y Pagar 💳
           </button>
        </div>
      </form>

      <style jsx>{`
        .disabled { background-color: #222; color: #777; cursor: not-allowed; }
        .form-group label { display: block; margin-bottom: 5px; font-size: 0.9rem; color: #ccc; }
      `}</style>
    </div>
  );
}