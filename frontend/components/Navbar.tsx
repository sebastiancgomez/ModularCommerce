"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      
      <div
        style={{ position: "relative" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <span style={{ cursor: "pointer" }}>
          Administrar Catálogo
        </span>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              background: "#111",
              border: "1px solid #333",
              borderRadius: 6,
              padding: 8,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              minWidth: 180,
              zIndex: 10
            }}
          >
            <Link href="/admin/categories">
              Categorías
            </Link>

            <Link href="/admin/subcategories">
              Subcategorías
            </Link>

            <Link href="/admin/products">
              Productos
            </Link>
          </div>
        )}
      </div>

    </nav>
  );
}