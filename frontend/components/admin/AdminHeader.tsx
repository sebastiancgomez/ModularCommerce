"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, logout } from "@/hooks/useAuth";

export default function AdminHeader() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  function handleLogout() {
    logout();
    router.push("/login");
  }
  return (
    <header className="header">
      <div className="logo">Mis Bellas</div>
      <div className="actions">
        <span>
          <Link href="/">Home</Link>
        </span>
        |
        <span>
       {isAuthenticated && <Link href="/admin">Admin</Link>}
        </span>
        |
        <span>
          <button className="button-link" onClick={handleLogout}>Cerrar sesión</button>
        </span>
        |
        <span>♡</span>
      </div>
    </header>
  );
}