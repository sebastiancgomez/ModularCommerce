"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  
  return (
    <nav className="navbar">
      {/* Contenedor para agrupar los links a la izquierda */}
      <div className="nav-links-container" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        
        <Link href="/admin/orders" prefetch={false} className="nav-link-item">
          Órdenes
        </Link>

        <div
          className="dropdown"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <span className="dropdown-label">
            Administrar Catálogo {open ? '▴' : '▾'}
          </span>

          {open && (
            <div className="dropdown-menu">
              <Link href="/admin/categories" prefetch={false} className="dropdown-item">Categorías</Link>
              <Link href="/admin/subcategories" prefetch={false} className="dropdown-item">Subcategorías</Link>
              <Link href="/admin/products" prefetch={false} className="dropdown-item">Productos</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}