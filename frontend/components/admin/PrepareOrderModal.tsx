'use client';

import { AdminOrder } from '@/lib/api/admin';

interface Props {
  order: AdminOrder;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export default function PrepareOrderModal({ order, onClose, onConfirm }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ minWidth: '450px', padding: '25px' }} onClick={e => e.stopPropagation()}>
        <div style={{ borderBottom: '1px solid #333', marginBottom: '20px', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0 }}>📦 Lista de Empaque</h3>
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>
            Cliente: {order.fullName}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>
            Email: {order.email}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>
            Dirección: {order.address}
          </p>
          <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>
            Teléfono: {order.phone}
          </p>
        </div>

        <div className="picking-list" style={{ marginBottom: '25px' }}>
          {order.items?.length ? order.items.map((item: any, index: number) => (
            // Usamos item.id O index como respaldo para evitar el error de la key
            <div key={item.id || `item-${index}`} style={itemRowStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', width: '100%' }}>
                <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem' }}>
                    <strong style={{ color: '#da1b1b', marginRight: '8px' }}>{item.quantity}x</strong> 
                    {item.productName}
                  </span>
                </div>
              </div>
            </div>
          )) : <p>No hay productos en esta orden.</p>}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            className="button-full" 
            style={{ flex: 2, background: '#2e7d32' }} 
            onClick={() => onConfirm(order.id)}
          >
            ✅ Todo empacado - Listo
          </button>
          <button 
            className="button-full" 
            style={{ flex: 1, background: '#444' }} 
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// Estilo para las filas, asegurando que no se muevan a los lados
const itemRowStyle: React.CSSProperties = {
  padding: '12px 0',
  borderBottom: '1px solid #222',
  display: 'flex',
  alignItems: 'center',
  width: '100%'
};