"use client";

import { useRef } from "react";
import { Product } from "../types/Product";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    const scrollAmount = 300;

    containerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

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