'use client';
import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { OrderRequest } from '@/types/Order';
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Cali' // Por defecto tu ciudad
  });
   // 2. Activamos el cliente después del montaje
  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const order: OrderRequest = {
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.price
      })),
      total: getTotal()
    };

    try {
      // Aquí llamaremos a tu API de .NET
      // const response = await createOrder(order);
      console.log("Enviando orden a .NET:", order);
      
      // Simulación de éxito
      setTimeout(() => {
        alert("¡Orden creada con éxito! Pronto recibirás un código de confirmación.");
        clearCart();
        setLoading(false);
      }, 2000);

    } catch (error) {
      console.error("Error al crear la orden", error);
      setLoading(false);
    }
  };

  // 3. Si no es el cliente, mostramos un estado de carga o nada
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
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            required 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
           <input 
            type="tel" 
            placeholder="Whatsapp / Número telefónico" 
            required 
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Dirección de entrega" 
            required 
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>

        <div className="card">
          <h3>Resumen del Pedido</h3>
          {/* Aquí el reduce/map ya no chillará porque estamos en el cliente */}
          {items.map(item => (
            <div key={item.productId} className="flex-row justify-between">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toLocaleString('es-CO')}</span>
            </div>
          ))}
          <hr />
          <div className="flex-row justify-between" style={{ fontWeight: 'bold' }}>
            <span>Total a pagar:</span>
            {/* 4. Ahora el servidor y el cliente no pelearán por este valor */}
            <span>${getTotal().toLocaleString('es-CO')}</span>
          </div>
        </div>

        <button type="submit" className="button button-full" disabled={loading || items.length === 0}>
          {loading ? 'Procesando...' : 'Confirmar Pedido'}
        </button>
        <div></div>
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