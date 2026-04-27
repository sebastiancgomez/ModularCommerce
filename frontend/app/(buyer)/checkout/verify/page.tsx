'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import { orderService } from '@/lib/api/orders';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const clearCart = useCartStore(s => s.clearCart);
  const addNotification = useNotificationStore(s => s.addNotification);

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Redirigir si no hay OrderId
  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return; // Solo números

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Mover al siguiente cuadro si se escribió un número
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    if (data.length !== 6 || isNaN(Number(data))) return;

    const pasteData = data.split("");
    setOtp(pasteData);
    inputsRef.current[5]?.focus(); // Enfocar el último
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;

    setLoading(true);
    try {
      await orderService.verifyOtp(orderId!, code);
      
      addNotification("¡Código verificado con éxito!", "success");
      clearCart(); // AHORA SÍ limpiamos el carrito
      
      // Siguiente paso: subir comprobante
      router.push(`/checkout/payment?orderId=${orderId}`);
    } catch (err: unknown) {
      let msg = "Código inválido o expirado.";
      if (err instanceof Error) msg = err.message;
      addNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page container-small text-center">
      <h2>Verifica tu Pedido</h2>
      <p>Hemos enviado un código de 6 dígitos a tu correo.</p>
      
      <form onSubmit={handleVerify} className="flex-col" style={{ gap: '30px', marginTop: '20px' }}>
        <div className="flex-row justify-center" style={{ gap: '10px' }}>
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="otp-input"
              value={data}
              ref={(el) => { inputsRef.current[index] = el; }}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
            />
          ))}
        </div>

        <button type="submit" className="button button-full" disabled={loading || otp.includes("")}>
          {loading ? 'Verificando...' : 'Confirmar Código'}
        </button>
      </form>
    </div>
  );
}

// Next.js requiere Suspense para usar useSearchParams en Client Components
export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Cargando verificador...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}