"use client";

import { useRef, useEffect, useState } from "react"; // 1. Añadimos useEffect y useState
import { Product } from "../types/Product";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/api"; // 2. Importa tu función de API

type Props = {
  products: Product[]; // Estos serán los productos iniciales (del build)
};

export default function ProductGrid({ products: initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts); // 3. Estado local
  const containerRef = useRef<HTMLDivElement>(null);

  // 4. EFECTO PARA CARGAR PRODUCTOS EN EL NAVEGADOR
  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error cargando productos en el Home:", error);
      }
    }
    load();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = 300;
    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // 5. Si no hay productos, podemos mostrar un mensaje amigable o esqueletos
  if (!products || products.length === 0) {
    return <p className="text-center">Cargando productos destacados...</p>;
  }

  return (
    <div className="carousel-wrapper">
      <button className="arrow left" onClick={() => scroll("left")}>
        ◀
      </button>

      <div className="carousel" ref={containerRef}>
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <button className="arrow right" onClick={() => scroll("right")}>
        ▶
      </button>
    </div>
  );
}