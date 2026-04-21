"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavBar"; // Ajusta la ruta si es distinta
import AdminHeader from "@/components/admin/AdminHeader"; // Ajusta la ruta si es distinta


type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkToken = () => {
      // Buscamos la cookie 'token'
      const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
      const token = match ? match[2] : null;

      if (!token) {
        router.replace("/login");
      } else {
        setIsAuthorized(true);
      }
      setChecking(false);
    };

    checkToken();
  }, [router]);

  // 1. Estado de carga inicial
  if (checking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Verificando credenciales...</p>
      </div>
    );
  }

  // 2. Si no está autorizado, no renderizamos nada (el useEffect ya está haciendo el redirect)
  if (!isAuthorized) return null;

  // 3. Si está autorizado, mostramos toda la interfaz administrativa
  return (
      <div>
        <AdminHeader />
        <AdminNavbar />
        <main style={{ flex: 1, padding: '20px' }}>
          {children}
        </main>
      </div>
  );
}