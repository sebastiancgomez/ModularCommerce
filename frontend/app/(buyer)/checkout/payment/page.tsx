'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { orderService } from '@/lib/api/orders';
import { useNotificationStore } from '@/store/useNotificationStore';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const addNotification = useNotificationStore(s => s.addNotification);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !orderId) return;
    setUploading(true);
    
    try {
      await orderService.uploadReceipt(orderId, file);
      
      addNotification("¡Comprobante enviado! Validaremos tu pago en breve.", "success");
      
      // Redirigir a una página de "Gracias" o al Home
      router.push(`/checkout/success?orderId=${orderId}`); 
    } catch (err: unknown) {
      let msg = "Error al subir el archivo.";
      if (err instanceof Error) msg = err.message;
      addNotification(msg, "error");
    } finally {
      setUploading(false);
    }
  };

 return (
    <div className="page container-small">
      <h2 className="text-center">Confirmar Pago 🧾</h2>
      <p className="text-center" style={{ color: '#888' }}>ID de Orden: <small>{orderId}</small></p>
      
      <div className="card" style={{ marginTop: '20px', border: '1px solid #333' }}>
        <p>Por favor, realiza la transferencia y sube la captura aquí:</p>
        <div style={{ padding: '15px', background: '#111', borderRadius: '8px', margin: '15px 0' }}>
          <p><strong>Nequi / Daviplata:</strong></p>
          <p style={{ fontSize: '1.4rem', color: '#ff0000', margin: '5px 0' }}>300 123 4567</p>
          <p style={{ fontSize: '0.9rem' }}>A nombre de: Juan Cárdenas</p>
        </div>

        <div className="flex-col" style={{ gap: '15px' }}>
          <input 
            type="file" 
            accept="image/*" 
            className="input-file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          
          {file && <p style={{ fontSize: '0.8rem', color: '#4caf50' }}>✓ {file.name} seleccionado</p>}

          <button 
            className="button button-full" 
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Subiendo...' : 'Enviar Comprobante'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="page text-center">Cargando instrucciones...</div>}>
      <PaymentContent />
    </Suspense>
  );
}