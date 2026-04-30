'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { orderService } from '@/lib/api/orders';
import { useNotificationStore } from '@/store/useNotificationStore';
import Link from "next/link";
import { OrderResponse } from '@/types/Order';

export default function OrdersPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const addNotification = useNotificationStore(s => s.addNotification);
  const router = useRouter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Función para cargar órdenes (memorizada para evitar re-renders)
  const loadOrders = useCallback(async (userEmail: string) => {
    setLoading(true);
    try {
      const data = await orderService.getByEmail(userEmail);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      let msg = "Error al solicitar código";
      if (error instanceof Error) msg = error.message;
      console.error("Error en búsqueda:", msg);
      // Si el error es 401, el interceptor de apiFetch ya debería manejarlos,
      // pero aquí nos aseguramos de notificar al usuario.
      addNotification("No se pudieron cargar tus pedidos", "error");
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Efecto inicial: Validar sesión y cargar datos
  useEffect(() => {
    const sessionEmail = sessionStorage.getItem('buyer_email');
    const sessionToken = sessionStorage.getItem('buyer_token');

    if (!sessionToken || !sessionEmail) {
      addNotification("Debes verificar tu identidad para ver tus pedidos", "success");
      router.push('/orders/lookup');
      return;
    }

    setEmail(sessionEmail);
    loadOrders(sessionEmail);
  }, [router, addNotification, loadOrders]);

  const handleLogout = () => {
    sessionStorage.removeItem('buyer_token');
    sessionStorage.removeItem('buyer_email');
    router.push('/orders/lookup');
  };

  const handleCancel = async (id: string) => {
    if (!confirm("¿Seguro que quieres cancelar tu pedido?")) return;
    try {
      await orderService.cancelOrder(id);
      addNotification("Pedido cancelado exitosamente", "success");
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
    } catch {
      addNotification("No se pudo cancelar el pedido", "error");
    }
  };

  if (loading && orders.length === 0) {
    return <div className="container page"><p>Cargando tus pedidos...</p></div>;
  }

  return (
    <div className="container page">
      {/* ENCABEZADO INFORMATIVO */}
      <header style={{ 
        marginBottom: '30px', 
        borderBottom: '1px solid #333', 
        paddingBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <div>
          <h2 style={{ margin: 0 }}>Mis Pedidos 🛍️</h2>
          <p style={{ margin: '5px 0 0', color: '#888', fontSize: '0.9rem' }}>
            Resultados para: <strong>{email}</strong>
          </p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#DC143C', 
            cursor: 'pointer', 
            fontSize: '0.8rem',
            textDecoration: 'underline'
          }}
        >
          Consultar otro correo
        </button>
      </header>

      <div className="orders-list">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="card-button" style={{ marginBottom: '15px', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <strong>Orden: #{order.id.split('-')[0]}</strong>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>Estado: <span className={`badge-${order.status.toLowerCase()}`}>{order.status}</span></p>
                  <p>Total: <strong>{formatCurrency(order.totalAmount)}</strong></p>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {order.status === 'Pending' && (
                    <Link href={`/checkout/verify-recovery?orderId=${order.id}`} className="button-small" style={{ background: '#00796b', color: 'white', textDecoration: 'none' }}>
                        Completar Datos →
                    </Link>
                  )}

                  {order.status === 'PaymentPending' && (
                    <Link href={`/checkout/verify-recovery?orderId=${order.id}`} className="button-small" style={{ background: '#f57c00', color: 'white', textDecoration: 'none' }}>
                        Pagar Ahora 💳
                    </Link>
                  )}

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
          ))
        ) : (
          !loading && <p style={{ textAlign: 'center', color: '#888' }}>No tienes pedidos registrados con este correo.</p>
        )}
      </div>
    </div>
  );
}