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
            <Link href="/admin/categories">Categorías</Link>
            <Link href="/admin/subcategories">Subcategorías</Link>
            <Link href="/admin/products">Productos</Link>
          </div>
        )}
      </div>
    </nav>
  );
}