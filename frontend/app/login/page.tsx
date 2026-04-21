"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import LoginHeader from "@/components/login/LoginHeader";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const data = await login({ email, password });
      document.cookie = `token=${data.token}; path=/;`;

      router.push("/admin");
    } catch {
      alert("Credenciales inválidas");
    }
  }

  return (
    <div>
     <div>
          <LoginHeader />
     </div>
     <div className="page">
        <h1>Bienvenido a Mis Bellas</h1>
     </div>
     <div className="login">
        <h1>Login</h1>
        <div className="card">
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>
        <div className="card">
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>
        <button onClick={handleLogin} className="button button-full">
          Ingresar
        </button>
      </div>
      </div>
  );
}