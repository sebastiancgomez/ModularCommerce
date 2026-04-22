"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation"; // Para leer la búsqueda
import { Product } from "../types/Product";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/api";

type Props = {
  products: Product[];
};

export default function ProductGrid({ products: initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  
  // Obtenemos el término de búsqueda de la URL
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    }
    load();
  }, []);

  // FILTRO DINÁMICO
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery) || 
      p.brand?.toLowerCase().includes(searchQuery) ||
      p.description?.toLowerCase().includes(searchQuery)
    );
  }, [products, searchQuery]);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = 300;
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="section">
      {/* Título dinámico si hay búsqueda */}
      {searchQuery && (
        <h2 className="section-title">Resultados para: {searchQuery}</h2>
      )}

      {filteredProducts.length === 0 ? (
        <p className="text-center">No encontramos productos que coincidan.</p>
      ) : (
        <div className="carousel-wrapper">
          <button className="arrow left" onClick={() => scroll("left")}>◀</button>
          <div className="carousel" ref={containerRef}>
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <button className="arrow right" onClick={() => scroll("right")}>▶</button>
        </div>
      )}
    </div>
  );
}