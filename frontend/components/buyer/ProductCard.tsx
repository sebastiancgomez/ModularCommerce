'use client';

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/Product";
import { useCartStore } from "@/store/useCartStore";
import { useNotificationStore } from '@/store/useNotificationStore';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { items } = useCartStore();

  // Validación de stock (asumiendo que el objeto product tiene la propiedad 'stock')
  const cartItem = items.find(item => item.productId === product.id);
  const availableStock = product.stock - (cartItem?.quantity || 0);
  
  const handleIncrement = () => {
    if (quantity < availableStock) {
      setQuantity(q => q + 1);
    } else {
      addNotification("Límite de stock alcanzado", "error");
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Evita la navegación si el botón está dentro de un link
    addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.imageUrl
      },
      availableStock
    );
    addNotification(`¡${product.name} añadido al carrito!`);
    // OJO: Para que no se abra solo, debemos quitar "isOpen: true" del addItem en useCartStore.ts
  };

  return (
    <div className="card">
      {/* 4. Link a la página de detalle */}
      <Link href={`/product?id=${product.id}`} className="card-link">
        <Image
          src={product.imageUrl || "/placeholder.jpg"}
          alt={product.name}
          width={200}
          height={200}
          unoptimized
        />
        <h3>{product.name}</h3>
        <p style={{ color: 'var(--text-muted)' }}>{product.subCategoryName}</p>
        <div className="price" style={{ margin: '10px 0' }}>
          ${product.price.toLocaleString('es-CO')}
        </div>
      </Link>

      {/* 2. Selector de cantidad local */}
      <div className="stock-info">
        {product.stock > 0 ? (
          <span className="stock-available">{product.stock} disponibles</span>
        ) : (
          <span className="stock-out">Agotado</span>
        )}
      </div>

      <div className="quantity-selector">
        <button 
          onClick={handleDecrement} 
          disabled={quantity <= 1}
          className={quantity <= 1 ? 'btn-disabled' : ''}
        > - </button>
        
        <span className="quantity-display">{quantity}</span>
        
        <button 
          onClick={handleIncrement} 
          disabled={quantity >= availableStock}
          className={quantity >= availableStock ? 'btn-disabled' : ''}
        > + </button>
      </div>

      <button 
        className="button" 
        disabled={product.stock <= 0 || availableStock <= 0}
        onClick={handleAddToCart}
      >
        {product.stock <= 0 ? 'Agotado' : 'Añadir al carrito'}
      </button>
    </div>
  );
}