'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { orderService } from '@/lib/api/orders';
import { useNotificationStore } from '@/store/useNotificationStore';
import { OrderItemResponse, OrderResponse } from '@/types/Order';


export default function CheckoutRecoveryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const addNotification = useNotificationStore(s => s.addNotification);

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderResponse | null>(null);
  
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  

  useEffect(() => {
    if (!orderId) {
      router.push('/orders');
      return;
    }

    const fetchOrder = async () => {
      try {
        const data : OrderResponse = await orderService.getById(orderId);
        setOrder(data);
        setAddress(data.address);
        setPhone(data.phone);
      } catch {
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
      await orderService.updateRecoveryData(orderId!, { address, phone });
      router.push(`/checkout/payment?orderId=${orderId}`);
    } catch {
      addNotification("Error al actualizar datos", "error");
    }
  };

  if (loading) {
    return <div className="page container-small text-center">Cargando datos del pedido...</div>;
  }

  return (
    <div className="page container-small">
      
        <h2 >Verifica tus datos</h2>
        <p className="text-muted text-center" style={{ marginBottom: '25px' }}>
          Antes de proceder al pago, confirma que tu información de envío sea correcta.
        </p>

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="label-field">Nombre Completo</label>
            <input type="text" className="input-field" value={order?.fullName} disabled />
          </div>

          <div className="flex-col">
            <label className="label-field" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Correo Electrónico
                <input type="text" className="input-field" value={order?.email} disabled />
            </label>
          </div>
          <div className="flex-col">
            <label className="label-field" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Dirección de Envío
                <input 
                    type="text" 
                    className="input" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required 
                    placeholder="Ej: Calle 10 #20-30"
                />
            </label>            
          </div>
          <div className="flex-col">
            <label className="label-field" style={{ fontWeight: '600', fontSize: '0.9rem' }}>Teléfono de Contacto
                <input 
                type="text" 
                className="input" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
                placeholder="Ej: 3101234567"
                />
            </label>            
          </div>
          <div className="card-info">
          <h3>Resumen del Pedido</h3>
          <table width='100%'>
            <tbody>
          {order?.items.map(item => (
            <tr key={item.productId} className="flex-row justify-between">
              <td >{item.productName} (x{item.quantity})</td>
              <td >${(item.unitPrice * item.quantity).toLocaleString('es-CO')}</td>
            </tr>
          ))}
          <tr><td colSpan={2}><hr /></td></tr>
          <tr className="flex-row justify-between" style={{ fontWeight: 'bold' }}>
            <td>Total a pagar:</td>
            <td>${order?.items.reduce((acc: number, item: OrderItemResponse) => acc + (item.unitPrice * item.quantity),0).toLocaleString('es-CO')}</td>
          </tr>
          </tbody>
          </table>
        </div>
        <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
           <button type="submit" className="button button-full" >
             Confirmar y Pagar 💳
           </button>
        </div>
          {/*<div style={{ marginTop: '10px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
             <div className="justify-between" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                <span style={{ fontWeight: '500' }}>Total a pagar:</span>
                <strong >${order?.totalAmount.toLocaleString()}</strong>
             </div>             
             <button type="submit" className="button button-primary button-full">
               Confirmar y Pagar 💳
             </button>
          </div>*/}
        </form>
      </div>
 
  );
}