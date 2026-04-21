"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  
  // Iniciamos en 'null' o 'false' para indicar que estamos "verificando"
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    // Función auxiliar para leer la cookie
    const checkToken = () => {
      const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
      const token = match ? match[2] : null;

      if (!token) {
        router.replace("/login"); // 'replace' es mejor que 'push' para auth
      } else {
        setIsAuthorized(true);
      }
      setChecking(false);
    };

    checkToken();
  }, [router]);

  // Mientras revisamos, mostramos un estado de carga
  if (checking) {
    return (
      <div className="flex-center" style={{ height: '100vh' }}>
        <p>Verificando acceso...</p>
      </div>
    );
  }

  // Si terminó de revisar y no está autorizado, no renderizamos nada (el router ya lo está mandando al login)
  if (!isAuthorized) return null;

  return (
    <div className="theme-light">
      {children}
    </div>
  );
}