"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { isAuthenticated, logout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/Product";
import { searchProducts } from "@/lib/api";
import { useCartStore } from "@/store/useCartStore"; // 1. Importamos el store

export default function BuyerHeader() {
  const router = useRouter();
  const logged = isAuthenticated();
  
  // 2. Extraemos los items para mostrar el contador
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const openCart = useCartStore((state) => state.openCart);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowPanel(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      setShowPanel(true);
      try {
        const data = await searchProducts(query);
        setResults(data);
      } catch (error) {
        console.error("Error en Live Search:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  function handleLogout() {
    logout();
    router.push("/");
    router.refresh();
  }
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return (
      <header className="header">
        <div className="header-container">
           <div className="logo">Cargando Tienda...</div>
           <div className="actions">
             <span className="skeleton-text" style={{ width: '100px', height: '20px', background: '#eee' }}></span>
           </div>
        </div>
      </header>
    ); // O un esqueleto simple del header
  }
  return (
    <header className="header">
      <div className="logo">Mis Bellas</div>
      
      <div className="search-container" ref={searchRef}>
        <div className="search-input-wrapper">
          <input 
            type="text"
            placeholder="Buscar productos..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowPanel(true)}
          />
          <button type="button">🔍</button>
        </div>

        {showPanel && (
          <div className="search-results-panel">
            {loading && <p className="p-3 text-sm text-muted">Buscando...</p>}
            
            {!loading && results.length === 0 && (
              <p className="p-3 text-sm text-muted">No se encontraron productos.</p>
            )}

            {!loading && results.length > 0 && (
              <ul>
                {results.slice(0, 5).map(product => (
                  <li key={product.id} className="result-item">
                    <Link href={`/product?id=${product.id}`} onClick={() => setShowPanel(false)}>
                      <div className="result-image">
                        <Image 
                          src={product.imageUrl || "/placeholder.jpg"} 
                          alt={product.name}
                          width={50}
                          height={50}
                          unoptimized
                        />
                      </div>
                      <div className="result-info">
                        <p className="result-name">{product.name}</p>
                        <p className="result-price">${product.price.toLocaleString('es-CO')}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="search-panel-footer">
              <Link href={`/?search=${encodeURIComponent(query)}`} onClick={() => setShowPanel(false)}>
                 Busque {query} <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="actions">
        <span>
          <Link href="/" prefetch={false}>Home</Link>
        </span>
        |
        <span>
          {logged ? (
            <>
              <Link href="/admin" prefetch={false}>Admin </Link>
              |
              <button className="button-link" onClick={handleLogout}
              >Cerrar Sesión</button>
            </>
          ) : (
            <Link href="/login" prefetch={false}>Login</Link>
          )}
        </span>
        |
        <span>♡</span>
        |
        <button className="cart-btn" onClick={openCart}>
        <span>🛒</span>
        {cartCount > 0 && (
          <span className="cart-badge">
            {cartCount}
          </span>
        )}
      </button>
      </div>
    </header>
  );
}