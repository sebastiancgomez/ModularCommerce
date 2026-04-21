"use client";
import Link from "next/link";
import { isAuthenticated, logout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function BuyerHeader() {
  const router = useRouter();
  const logged = isAuthenticated();
  return (
    <header className="header">
      <div className="logo">Mis Bellas</div>
      <div className="search">
        <input placeholder="Buscar" />
        <button>🔍</button>
      </div>
      <div className="actions">
        <span>
          <Link href="/">Home</Link>
        </span>
        |
        <span>
          {logged ? (
            <>
            <span>
              <Link href="/admin">Admin</Link>
            </span>
            |
              <button className="button-link"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >Cerrar Sesión
              </button>
            </>
          ) : (
            
            <Link href="/login">Login</Link>
            
          )}
        </span>
        |
        <span>♡</span>
        |
        <span>🛒</span>
      </div>
    </header>
  );
}