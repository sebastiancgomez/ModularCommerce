"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { isAuthenticated, logout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/Product";
import { searchProducts } from "@/lib/api"; // Asumimos que creas esta función

export default function BuyerHeader() {
  const router = useRouter();
  const logged = isAuthenticated();
  
  // ESTADOS PARA LA BÚSQUEDA INTERACTIVA
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null); // Para detectar clics fuera

  // 1. EFECTO DE DEBOUNCE (Espera 300ms antes de buscar)
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
        const data = await searchProducts(query); // Llamada a tu API
        setResults(data);
      } catch (error) {
        console.error("Error en Live Search:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms de pausa

    return () => clearTimeout(timer); // Limpia el timer si el usuario sigue escribiendo
  }, [query]);

  // 2. CERRAR PANEL AL CLICKEAR FUERA
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="logo">Mis Bellas</div>
      
      {/* CONTENEDOR DE BÚSQUEDA (searchRef aquí) */}
      <div className="search-container" ref={searchRef}>
        <div className="search-input-wrapper">
          <input 
            type="text"
            placeholder="Buscar productos..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowPanel(true)} // Reabre si hay texto
          />
          {/*<button className="search-icon">🔍</button>*/}
          <button type="button">🔍</button>
        </div>

        {/* 3. EL PANEL DE RESULTADOS (COMO EN TU IMAGEN) */}
        {showPanel && (
          <div className="search-results-panel">
            {loading && <p className="p-3 text-sm text-muted">Buscando...</p>}
            
            {!loading && results.length === 0 && (
              <p className="p-3 text-sm text-muted">No se encontraron productos.</p>
            )}

            {!loading && results.length > 0 && (
              <ul>
                {results.slice(0, 5).map(product => ( // Limitamos a 5 resultados
                  <li key={product.id} className="result-item">
                    <Link href={`/product/${product.id}`} onClick={() => setShowPanel(false)}>
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
            
            {/* Pie del panel como en tu imagen */}
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
            <span>
              <Link href="/admin" prefetch={false}>Admin </Link>
            </span>
            |
              <button className="button-link"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >Cerrar Sesión</button>
            </>
          ) : (
            
            <Link href="/login" prefetch={false}>Login</Link>
            
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