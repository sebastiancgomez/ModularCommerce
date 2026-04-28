'use client';

import { useState } from 'react';
import { orderService } from '@/lib/api/orders';
import { useNotificationStore } from '@/store/useNotificationStore';
import Link from "next/link";

export default function OrdersLookupPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const addNotification = useNotificationStore(s => s.addNotification);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };


  const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await orderService.getByEmail(email);
            console.log("Datos recibidos del service:", data); // Mira la consola del navegador

            // Si data es el JSON que me pegaste, esto debería funcionar:
            setOrders(Array.isArray(data) ? data : []);
            
        } catch (error) {
            console.error("Error en búsqueda:", error);
            addNotification("Error al buscar pedidos", "error");
        } finally {
            setLoading(false);
        }
    };

  const handleCancel = async (id: string) => {
    if (!confirm("¿Seguro que quieres cancelar tu pedido?")) return;
    try {
      await ordersService.cancelOrder(id);
      addNotification("Pedido cancelado exitosamente", "success");
      // Refrescar la lista localmente
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
    } catch {
      addNotification("No se pudo cancelar el pedido", "error");
    }
  };

  return (
    <div className="container page">
      <h2>Mis Pedidos 🛍️</h2>
      <form onSubmit={handleSearch} style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <input 
          type="email" 
          placeholder="Tu correo electrónico" 
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Buscando...' : 'Consultar'}
        </button>
      </form>

      <div className="orders-list">
        {/* El encadenamiento opcional ?. y el fallback || [] aseguran que no explote */}
        {(Array.isArray(orders) ? orders : []).map(order => (
        <div key={order.id} className="card-button" style={{ marginBottom: '15px', cursor: 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
                <strong>Orden: #{order.id.split('-')[0]}</strong>
                <p style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Estado: <span className={`badge-${order.status.toLowerCase()}`}>{order.status}</span></p>
                <p>Total: <strong>{formatCurrency(order.totalAmount)}</strong></p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* BOTÓN DINÁMICO: Completar Flujo */}
                {order.status === 'Pending' && (
                <Link href={`/checkout/verify?orderId=${order.id}`} className="button-small" style={{ background: '#00796b', color: 'white', textDecoration: 'none' }}>
                    Completar Datos →
                </Link>
                )}

                {order.status === 'PaymentPending' && (
                <Link href={`/checkout/payment?orderId=${order.id}`} className="button-small" style={{ background: '#f57c00', color: 'white', textDecoration: 'none' }}>
                    Pagar Ahora 💳
                </Link>
                )}

                {/* BOTÓN: Cancelar (Solo si no ha sido procesada) */}
                {(order.status === 'Pending' || order.status === 'PaymentPending') && (
                <button 
                    onClick={() => handleCancel(order.id)} 
                    className="button-small" 
                    style={{ background: 'transparent', border: '1px solid #da1b1b', color: '#da1b1b' }}
                >
                    Cancelar
                </button>
                )}
            </div>
            </div>
        </div>
        ))}
        {!loading && orders.length === 0 && email && (
            <p style={{ textAlign: 'center', color: '#888' }}>No se encontraron pedidos.</p>
        )}
      </div>
    </div>
  );
}