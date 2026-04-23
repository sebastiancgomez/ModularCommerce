'use client';

import { useCartStore } from '@/store/useCartStore';
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, isOpen, closeCart } = useCartStore();
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const router = useRouter();
  const handleGoToCheckout = () => {
    closeCart(); // Cerramos el drawer/modal antes de navegar
    router.push('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      
      <div className="cart-drawer">
        <div className="cart-header">
          <h2 className="section-title" style={{padding: 0}}>Tu Carrito</h2>
          <button onClick={closeCart} className="button-link" style={{fontSize: '24px'}}>&times;</button>
        </div>
        
        <div className="cart-items-container">
          {items.length === 0 ? (
            <p className="text-center text-muted">
              El carrito está vacío
            </p>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.name}</p>
                  <div className="flex-row-sm" style={{ marginTop: '8px' }}>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="button button-secondary" style={{padding: '2px 8px'}}>-</button>
                    <span style={{alignSelf: 'center'}}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="button button-secondary" style={{padding: '2px 8px'}}>+</button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="price">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="button-link" 
                    style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '5px' }}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ fontWeight: 'bold' }}>Total:</span>
              <span className="price" style={{ fontSize: '1.2rem' }}>
                ${total.toLocaleString('es-CO')}
              </span>
            </div>
            <button 
              className="button button-full"
              onClick={handleGoToCheckout}
              disabled={items.length === 0}              
            >
              CONTINUAR COMPRA
            </button>
          </div>
        )}
      </div>
    </>
  );
}