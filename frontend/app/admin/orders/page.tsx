'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminService, AdminOrder } from '@/lib/api/admin';
import { useNotificationStore } from '@/store/useNotificationStore';
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
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null); // Estado para el modal
  const [loading, setLoading] = useState(true);
  const addNotification = useNotificationStore(s => s.addNotification);

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

  if (loading) return <div className="page text-center">Cargando gestión...</div>;

  return (
    <div className="page container">
      <h2>Gestión de Órdenes 📦</h2>
      
      <div className="table-container" style={{ marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
            <tr key={order.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '12px' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>{order.customerEmail}</td>
                <td>${order.totalAmount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>                
                <td>
                <div className="flex-row" style={{ gap: '10px' }}>
                    {/* Botón Aprobar */}
                    <button 
                    onClick={() => handleApprove(order.id)}
                    className="button-small"
                    disabled={order.status === 'Approved'}
                    >
                    Aprobar
                    </button>

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
