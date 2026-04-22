"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  
  return (
    <nav className="navbar">
      <div
        className="dropdown"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <span style={{ cursor: "pointer" }}>
          Administrar Catálogo
        </span>

        {open && (
          <div className="dropdown-menu">
            <Link href="/admin/categories" prefetch={false}>Categorías</Link>
            <Link href="/admin/subcategories" prefetch={false}>Subcategorías</Link>
            <Link href="/admin/products" prefetch={false}>Productos</Link>
          </div>
        )}
      </div>
    </nav>
  );
}