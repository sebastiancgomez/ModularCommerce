'use client';

import { useState, useRef, useEffect } from 'react';
import { orderService } from '@/lib/api/orders';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useRouter } from 'next/navigation';

export default function OrderLookupPage() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const addNotification = useNotificationStore(s => s.addNotification);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  // app/(buyer)/orders/lookup/page.tsx
  useEffect(() => {
    const token = sessionStorage.getItem('buyer_token');
    const email = sessionStorage.getItem('buyer_email');
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === 'session_expired') {
      addNotification("Tu sesión ha expirado por seguridad. Por favor, solicita un nuevo código.", "error");
    }

    if (token && email) {
      // Podríamos validar el token aquí o dejar que la página de destino 
      // lo maneje, pero por UX, si existen, intentamos el salto.
      router.push('/orders');
    }
  });

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

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Paso 1: Pedir OTP al backend
      await orderService.requestLookupOtp(email);
      addNotification("Código enviado a tu correo", "success");
      setStep('otp');
    } catch (error: unknown) {
      let msg = "Error al solicitar código";
      if (error instanceof Error) msg = error.message;
      addNotification(msg, "error");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    setLoading(true);
    try {
      // Paso 2: Verificar y obtener token de acceso temporal o las órdenes
      const data = await orderService.verifyOtp(email, code, "OrderLookup");
      // Guardamos la llave y el email
      sessionStorage.setItem('buyer_token', data.token);
      sessionStorage.setItem('buyer_email', data.email);
      
      addNotification("Identidad verificada", "success");

      // Guardamos el token o email en una sesión rápida y mostramos pedidos
      router.push('/orders');
    } catch  {
      addNotification("Código inválido o expirado", "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="container page" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      {step === 'email' ? (
        <form onSubmit={handleRequestOtp}>
          <h2>Consultar mis pedidos</h2>
          <p>Ingresa tu correo para recibir un código de acceso.</p>
          <input 
            type="email" 
            className="input-field" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="ejemplo@correo.com"
          />
          <button className="button button-full" disabled={loading}>
            {loading ? 'Enviando...' : 'Recibir Código'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex-col" style={{ gap: '30px', marginTop: '20px' }}>
          <h2>Verifica tu identidad</h2>
          <p>Ingresa el código enviado a <strong>{email}</strong></p>
          <div className="otp-div justify-center">
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
        <div className="flex-row justify-center" style={{ gap: '10px', width: '480px' }}>
          <button className="button otp-button"  disabled={loading || otp.includes("")}>
            {loading ? 'Verificar' : 'Acceder'}
          </button>
        </div>
        <div className="flex-row justify-center" style={{ gap: '10px', width: '480px' }}>
          <button 
            type="button" 
            onClick={() => setStep('email')} 
            className='otp-secondary-button'
          >
            ← Volver a editar correo
          </button>
         </div>
        </form>
      )}
    </div>
  );
}