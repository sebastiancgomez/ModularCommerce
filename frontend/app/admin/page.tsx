'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { adminService, AdminOrder } from "@/lib/api/admin";

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminService.getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error cargando estadísticas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- CÁLCULOS DE ESTADÍSTICAS ---
  
  // 1. Total de ventas (Órdenes pagadas o en proceso logístico)
  const totalSales = orders
    .filter(o => ['Paid', 'Delivering', 'Delivered', 'Approved', 'Preparing'].includes(o.status))
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  // 2. Órdenes que requieren atención inmediata
  const pendingActions = orders.filter(o => o.status === 'UnderReview' || o.status === 'Approved').length;

  // 3. Órdenes en manos de la transportadora
  const ordersInTransit = orders.filter(o => o.status === 'Delivering').length;

  // 4. Ticket promedio
  const averageTicket = orders.length > 0 ? totalSales / orders.length : 0;

  // 5. Órdenes creadas hoy (Opcional pero útil)
  const ordersToday = orders.filter(o => {
    const today = new Date().toLocaleDateString();
    const orderDate = new Date(o.createdAt).toLocaleDateString();
    return today === orderDate;
  }).length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="page">
        <p>Cargando panel de control...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Panel de Administración</h1>
      <p style={{ marginTop: 8, color: '#888' }}>
        Gestiona el catálogo y controla las ventas de tu tienda
      </p>

      {/* SECCIÓN PRINCIPAL: GESTIÓN DE ÓRDENES */}
      <div style={{ marginTop: 24 }}>
        <Link href="/admin/orders" className="card-link" prefetch={false}>
          <div className="card-button" >
            <h3 style={{ fontSize: '1.4rem' }}>📦 Gestión de Órdenes</h3>
            <p>Revisa pagos, aprueba pedidos y gestiona envíos</p>
          </div>
        </Link>
      </div>

      {/* RESUMEN DE VENTAS */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Resumen de Ventas</h2>
        <div className="stats-grid grid-4" >
          <div className="card-stat" >
            <span className="card-label">Ventas Totales</span>
            <h3 className="card-value">{formatCurrency(totalSales)}</h3>
          </div>

          <div className="card-stat" style={{ borderLeft: '4px solid #da1b1b' }}>
            <span className="card-label">Pendientes por Gestión</span>
            <h3 className="card-value">{pendingActions} pedidos</h3>
          </div>

          <div className="card-stat" style={{ borderLeft: '4px solid #2e7d32' }}>
            <span className="card-label">En Camino 🚚</span>
            <h3 className="card-value">{ordersInTransit} pedidos</h3>
          </div>

          <div className="card-stat" >
            <span className="card-label">Ticket Promedio</span>
            <h3 className="card-value">{formatCurrency(averageTicket)}</h3>
          </div>
        </div>
      </div>

      {/* SECCIÓN SECUNDARIA: CATÁLOGO */}
      <h2 style={{ marginTop: 40, fontSize: '1.2rem' }}>Configuración del Catálogo</h2>
      <div className="grid-3 stats-grid">
        <Link href="/admin/categories" className="card-link" prefetch={false}>
          <div className="card-button" >
            <h3>Categorías</h3>
            <p>Estructura principal</p>
          </div>
        </Link>

        <Link href="/admin/subcategories" className="card-link" prefetch={false}>
          <div className="card-button" >
            <h3>Subcategorías</h3>
            <p>Filtros específicos</p>
          </div>
        </Link>

        <Link href="/admin/products" className="card-link" prefetch={false}>
          <div className="card-button" >
            <h3>Productos</h3>
            <p>Inventario y precios</p>
          </div>
        </Link>
      </div>

      {/* MINI ESTADÍSTICAS ADICIONALES */}
      <div className="grid-2 stats-grid" >
         <div className="card-stat">
            <strong>Órdenes hoy:</strong> {ordersToday}
         </div>
         <div className="card-stat">
            <strong>Total órdenes:</strong> {orders.length}
         </div>
      </div>
    </div>
  );
}

