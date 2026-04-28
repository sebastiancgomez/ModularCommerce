'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminService, AdminOrder } from '@/lib/api/admin';
import { useNotificationStore } from '@/store/useNotificationStore';
import PrepareOrderModal from '@/components/admin/PrepareOrderModal';
import Image from 'next/image';

function ImageModal({ url, onClose }: { url: string; onClose: () => void }) {
  // Aplicamos la transformación directamente en la URL para que Cloudinary trabaje por nosotros
  const optimizedUrl = url.replace('/upload/', '/upload/w_1200,q_auto,f_auto/');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        {/* Contenedor con tamaño controlado para el componente Image */}
        <div style={{ 
          position: 'relative', 
          width: '80vw', 
          height: '70vh', 
          maxWidth: '1000px' 
        }}>
          <Image 
            src={optimizedUrl} 
            alt="Comprobante de pago" 
            fill
            style={{ objectFit: 'contain', borderRadius: '8px' }}
            unoptimized // Al ser una imagen dinámica de admin, podemos saltarnos la optimización extra de Next.js
          />
        </div>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <a href={url} target="_blank" rel="noreferrer" className="button-small">
            📂 Ver Original
          </a>
        </div>
      </div>
    </div>
  );
}


export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [orderToPrepare, setOrderToPrepare] = useState<AdminOrder | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null); // Estado para el modal
  const [filter, setFilter] = useState<'All' | 'UnderReview' | 'Approved' | 'Preparing' | 'Delivering' | 'Delivered'>('All');
  const [loading, setLoading] = useState(true);
  const addNotification = useNotificationStore(s => s.addNotification);
  const [searchTerm, setSearchTerm] = useState('');
  const filterOptions = [
  { label: 'Todas', value: 'All', color: '#666' },
  { label: 'Por Aprobar', value: 'UnderReview', color: '#da1b1b' },
  { label: 'Por Empacar', value: 'Paid', color: '#f57c00' },
  { label: 'Por Enviar', value: 'Preparing', color: '#2e7d32' },
  { label: 'En Camino', value: 'Delivering', color: '#00796b' },
  { label: 'Entregadas', value: 'Delivered', color: '#1b5e20' },
];

  const fetchOrders = useCallback(async () => {
        try {
            const data = await adminService.getOrders();
            setOrders(data);
        } catch {
            addNotification("Error al cargar órdenes", "error");
        } finally {
            setLoading(false);
        }
    }, [addNotification]); // addNotification es estable, así que no causará loops

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

  const handleApprove = async (id: string) => {
    if (!confirm("¿Aprobar este pago?")) return;
    try {
      await adminService.approveOrder(id);
      addNotification("Orden aprobada", "success");
      fetchOrders(); // Recargar lista
    } catch {
      addNotification("Error al aprobar", "error");
    }
  };

  const handleDispatch = async (id: string) => {
    try {
      await adminService.dispatchOrder(id);
      addNotification("Pedido en camino 🚚", "success");
      fetchOrders();
    } catch { addNotification("Error al despachar", "error"); }
  };

  const handleFinishPrepare = async (id: string) => {
    try {
      await adminService.prepareOrder(id);
      addNotification("Pedido preparado y listo", "success");
      setOrderToPrepare(null);
      fetchOrders();
    } catch { addNotification("Error al marcar como preparado", "error"); }
  };
  const handleReject = async (id: string) => {
    const reason = confirm("¿Estás seguro de rechazar este pago? El inventario será devuelto automáticamente.");
    if (!reason) return;

    try {
      await adminService.rejectOrder(id);
      addNotification("Orden rechazada y stock devuelto", "info");
      fetchOrders(); // Refrescar lista
    } catch (err) {
      addNotification("Error al rechazar la orden", "error");
    }
  };
  const handleDelivered = async (id: string) => {
    try {
      await adminService.markAsDelivered(id);
      addNotification("Orden entregada", "succes");
      fetchOrders(); // Refrescar lista
    } catch (err) {
      addNotification("Error marcar la orden como entregada", "error");
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filter === 'All' || order.status === filter;
    
    // Usamos (order.customerEmail || '') para que si es null, use un string vacío y no estalle
    const email = (order.email || '').toLowerCase();
    const fullName = (order.fullName || '').toLowerCase();
    const orderId = (order.id || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = email.includes(search) || orderId.includes(search) || fullName.includes(search);
    
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="page text-center">Cargando gestión...</div>;

  return (
    <div className="page container">
      <h2>Gestión de Órdenes 📦</h2>
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="🔍 Buscar por email o ID de orden..." 
          className="input-field" // Usa tu clase de estilos de inputs
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px' }}
        />
      </div>
      <div className="filter-bar" style={{ display: 'flex', gap: '12px', marginBottom: '25px', flexWrap: 'wrap' }}>
        {filterOptions.map((opt) => {
          const isActive = filter === opt.value;
          const count = opt.value === 'All' 
            ? orders.length 
            : orders.filter(o => o.status === opt.value).length;

          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value as any)}
              className={`filter-btn ${isActive ? 'active' : ''}`}
              style={{ 
                // Forzamos el borde izquierdo solo si está activo
                borderColor: isActive ? `${opt.color}` : '#333',
                borderLeft: `4px solid ${opt.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: isActive ? '12px' : '16px', // Ajuste visual para compensar el borde grueso
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {opt.label}
              <span style={{ 
                background: isActive ? opt.color : '#333', 
                padding: '2px 8px', 
                borderRadius: '10px', 
                fontSize: '0.75rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      
      <div className="table-container" style={{ marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Fecha</th>
              <th>Cliente</th>
              <th>e-mail</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
            <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '12px' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>{order.fullName}</td>
                <td>{order.email}</td>
                <td>${order.totalAmount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>                
                <td>
                <div className="flex-row" style={{ gap: '10px' }}>
                    {/* BOTÓN 1: APROBAR (Si está en revisión) */}
                    {order.status === 'UnderReview' && (
                      <>
                        <button onClick={() => handleApprove(order.id)} className="button-small">
                          Aprobar
                        </button>
                        <button 
                          onClick={() => handleReject(order.id)} 
                          className="button-small" 
                          style={{ background: '#da1b1b', marginLeft: '5px' }}
                        >
                          Rechazar
                        </button>
                      </>
                    )}

                    {/* BOTÓN 2: PREPARAR (Si ya está pagado/aprobado) */}
                    {order.status === 'Paid' && (
                      <button 
                        onClick={() => setOrderToPrepare(order)} 
                        className="button-small" 
                        style={{ background: '#f57c00' }}
                      >
                        📦 Preparar
                      </button>
                    )}

                    {/* BOTÓN 3: DESPACHAR (Si está preparado) */}
                    {order.status === 'Preparing' && (
                      <button 
                        onClick={() => handleDispatch(order.id)} 
                        className="button-small" 
                        style={{ background: '#00796b' }}
                      >
                        🚚 Enviar
                      </button>
                    )}
                     {/* BOTÓN 4: ENTREGADO (Si está en entrega) */}
                    {order.status === 'Delivering' && (
                      <button 
                        onClick={() => handleDelivered(order.id)} 
                        className="button-small" 
                        style={{ background: '#2e7d32' }}
                      >
                        ✅ Entregado
                      </button>
                    )}
                    {/* Botón Ver Recibo (Solo si existe la URL) */}
                    {order.paymentFileUrl ? (
                    <button 
                        onClick={() => setSelectedImageUrl(order.paymentFileUrl!)} // Abrir modal
                        className="button-small"
                        style={{ background: '#0288d1' }}
                    >
                        👁️ Ver Recibo
                    </button>
                    ) : (
                    <span className="text-muted">Pendiente</span>
                    )}
                </div>
                </td>
            </tr>
            ))}
          </tbody>
        </table>
        {/* MODAL DE PICKING */}
        {orderToPrepare && (
          <PrepareOrderModal 
            order={orderToPrepare} 
            onClose={() => setOrderToPrepare(null)} 
            onConfirm={handleFinishPrepare}
          />
        )}
      </div>
      {/* Renderizado condicional del Modal */}
      {selectedImageUrl && (
        <ImageModal 
          url={selectedImageUrl} 
          onClose={() => setSelectedImageUrl(null)} 
        />
      )}
    </div>
  );
}
  // Componente de Modal reutilizable
  // Componente de Modal reutilizable
