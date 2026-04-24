'use client';

import { useSearchParams } from 'next/navigation';
import ProductDetailClient from '@/components/buyer/ProductDetailClient';
import ProductSkeleton from '@/components/buyer/ProductSkeleton';
import { Suspense } from 'react';

export default function ProductPage() {
  return (
    // Suspense es obligatorio cuando usas useSearchParams en Next.js 14/15
    <Suspense fallback={<ProductSkeleton />}>
      <ProductPageContent />
    </Suspense>
  );
}

function ProductPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Ahora lo sacamos de ?id=...

  if (!id) return <div className="page text-center">ID de producto no proporcionado.</div>;

  return <ProductDetailClient id={id} />;
}