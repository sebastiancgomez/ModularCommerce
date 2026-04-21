"use client";
import Link from "next/link";

export default function LoginHeader() {
return (
    <header className="header">
      <div className="logo">Mis Bellas</div>
      
      <div className="actions">
        <span>
          <Link href="/">Home</Link>
        </span>
        |
        <span>♡</span>
        |
        <span>🛒</span>
      </div>
    </header>
  );
}