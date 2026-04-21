"use client";

import { useState } from "react";


export default function Navbar() {
  const [ ,setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div
        className="dropdown"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        
      </div>
    </nav>
  );
}