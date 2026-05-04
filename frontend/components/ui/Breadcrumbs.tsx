'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Diccionario de traducciones para las rutas
const routeLabels: Record<string, string> = {
  'admin': 'Panel de Control',
  'orders': 'Pedidos',
  'lookup': 'Consultar Pedidos',
  'checkout': 'Finalizar Compra',
  'payment': 'Pago',
  'success': 'Confirmación',
  'verify-recovery': 'Recuperar Pedido',
  'products': 'Productos',
  'inventory': 'Inventario',
  'categories': 'Categorías',
  'subcategories': 'Subcategorías'
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  const pathSegments = pathname
    .split('/')
    .filter((item) => item !== '' && !item.startsWith('('));

  if (pathSegments.length === 0) return null;

  return (
    <nav className="breadcrumbs container" aria-label="Breadcrumb" style={{ padding: '10px 20px' }}>
      <div className="breadcrumb-item">
        <Link href="/">Inicio</Link>
        <span className="breadcrumb-separator">/</span>
      </div>

      {pathSegments.map((segment, index) => {
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        
        // 1. Buscamos en el diccionario. 
        // 2. Si no existe, formateamos el texto original (capitalizado).
        const label = routeLabels[segment.toLowerCase()] || 
                      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        return (
          <div key={href} className="breadcrumb-item">
            {isLast ? (
              <span className="active">{label}</span>
            ) : (
              <>
                <Link href={href}>{label}</Link>
                <span className="breadcrumb-separator">/</span>
              </>
            )}
          </div>
        );
      })}
    </nav>
  );
}