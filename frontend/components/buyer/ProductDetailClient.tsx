'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Product } from '@/types/Product';
import { getProductById } from '@/lib/api';
import ProductSkeleton from '@/components/buyer/ProductSkeleton';

export default function ProductDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { addItem, items } = useCartStore();
  const addNotification = useNotificationStore(s => s.addNotification);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Calcular stock disponible considerando lo que ya hay en el carrito
  const cartItem = items.find(item => item.productId === id);
  const availableStock = product ? product.stock - (cartItem?.quantity || 0) : 0;

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then(data => {
          setProduct(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error:", err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <ProductSkeleton />;
  if (!product) return <div className="page text-center">Producto no encontrado.</div>;

  const handleAddToCart = () => {
    if (quantity > availableStock) {
      addNotification("No hay suficiente stock disponible", "error");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl
    }, product.stock); // Pasamos el stock total para la validación del store

    addNotification(`¡${product.name} añadido al carrito!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Si hay stock, redirigimos inmediatamente
    if (quantity <= availableStock) {
      router.push('/checkout');
    }
  };

  return (
    <div className="page">
      <div className="grid-2">
        <div className="card">
          <Image 
            src={product.imageUrl || "/placeholder.jpg"} 
            alt={product.name} 
            width={400} 
            height={400} 
            unoptimized 
          />
        </div>
        <div>
          <h1>{product.name}</h1>
          <p className="price">${product.price.toLocaleString('es-CO')}</p>
          <p className="stock-info">
            {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
          </p>
          <p>{product.description}</p>

          <div className="flex-col" style={{ gap: '15px', marginTop: '20px' }}>
            {/* Selector de cantidad reutilizando tus clases */}
            <div className={`selector-cantidad ${quantity >= availableStock ? 'at-limit' : ''}`}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}> - </button>
              <span className="quantity-display">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} disabled={quantity >= availableStock}> + </button>
            </div>

            <div className="flex-row" style={{ gap: '10px' }}>
              <button 
                className="button-secondary" 
                onClick={handleAddToCart}
                disabled={availableStock <= 0}
                style={{ flex: 1 }}
              >
                Añadir al Carrito
              </button>
              <button 
                className="button" 
                onClick={handleBuyNow}
                disabled={availableStock <= 0}
                style={{ flex: 1 }}
              >
                Comprar Ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}