"use client";

import { useSyncExternalStore } from "react";

export function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
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
  window.dispatchEvent(new Event("storage"));
}