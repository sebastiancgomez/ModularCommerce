"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [ ,setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div
        className="dropdown"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Link href="/orders/lookup" className="nav-link" title="Mis Pedidos">
          <span style={{ fontSize: '1.2rem' }}>📦</span>
          <span className="hide-mobile"> Mis Pedidos</span>
        </Link>
      </div>
    </nav>
  );
}