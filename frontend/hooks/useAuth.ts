"use client";

import { useSyncExternalStore } from "react";

export function getToken(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(^| )token=([^;]+)/);
  return match ? match[2] : null;
}

export function isAuthenticated() {
  console.log("isAuthenticated ejecutado. Token:", getToken(), !!getToken());
  return !!getToken();
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return null;
  return getToken();
}

function getServerSnapshot() {
  return null;
}

export function useAuth() {
  const token = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return {
    isAuthenticated: !!token
  };
}

export function logout() {
  localStorage.removeItem("token");
  // elimina cookie
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00";
  window.dispatchEvent(new Event("storage"));
}