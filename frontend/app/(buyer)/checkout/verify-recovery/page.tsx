'use client';

import { Suspense } from 'react';
import CheckoutRecoveryContent from '@/components/buyer/VerifyRecoveryContent';

export default function CheckoutRecoveryPage() {
  return (
    <Suspense fallback={
      <div className="page container-small text-center">
        <p className="text-muted">Cargando datos del pedido...</p>
      </div>
    }>
      <CheckoutRecoveryContent />
    </Suspense>
  );
}