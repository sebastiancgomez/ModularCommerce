'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// 1. Definimos el contenido que usa los hooks de búsqueda
function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="page container-small text-center">
      <div style={{ fontSize: '5rem', marginBottom: '20px' }}>🎉</div>
      <h2 style={{ color: '#4caf50' }}>¡Pedido Recibido!</h2>
      <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
        Gracias por tu compra. Hemos recibido tu comprobante de pago.
      </p>

      <div className="card" style={{ background: '#111', border: '1px solid #333', padding: '20px' }}>
        <p style={{ color: '#888', margin: '0 0 10px 0' }}>Número de Orden:</p>
        {/* Usamos un fallback por si el orderId no llega por alguna razón */}
        <strong style={{ fontSize: '1rem', color: '#fff', wordBreak: 'break-all' }}>
          {orderId || 'No disponible'}
        </strong>
      </div>
      
      <p style={{ marginTop: '30px', color: '#ccc' }}>
        Ahora nuestro equipo validará el pago. Te enviaremos un correo electrónico cuando tu pedido sea despachado.
      </p>

      <div className="flex-col" style={{ gap: '15px', marginTop: '40px' }}>
        <button 
          className="button button-full" 
          onClick={() => router.push('/')}
        >
          Volver a la Tienda
        </button>
        
        <button 
          type="button"
          className="button-continue button-full"
          style={{ background: 'transparent', border: '1px solid #333' }}
          onClick={() => window.print()}
        >
          GUARDAR COMO PDF
        </button>
      </div>
    </div>
  );
}

// 2. Exportación por defecto obligatoria para Next.js
// La envolvemos en Suspense para que useSearchParams() funcione en el build de producción
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="page text-center">Cargando confirmación...</div>}>
      <SuccessContent />
    </Suspense>
  );
}