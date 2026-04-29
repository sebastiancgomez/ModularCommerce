import { apiFetch } from './client';
import { LoginCredentials } from '@/types/Login';
import { logout } from "@/hooks/useAuth";

export async function login(payload: Partial<LoginCredentials>) {
  const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

  
  if (!(res).ok) throw new Error("Invalid credentials");
  const data = await res.json();
  document.cookie = `token=${data.token}; path=/`;

  return data;
}


export function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};

  // 1. Intentar obtener token de Admin (Cookie)
  let token = document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];

  // 2. Si no hay de Admin, buscar el de Buyer (sessionStorage)
  if (!token) {
    token = sessionStorage.getItem('buyer_token') || undefined;
  }
  console.log(token);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetchWithAuthBuyer(endpoint: string , options: RequestInit = {}): Promise<Response> {
  const response =  await fetchWithAuthHeaders(endpoint, options);

  if (response.status === 401 || response.status === 403) {
    // Si el servidor rechaza el token:
    if (typeof window !== "undefined") {
      sessionStorage.removeItem('buyer_token');
      sessionStorage.removeItem('buyer_email');
      
      // Redirigir al lookup con un mensaje
      window.location.href = '/orders/lookup?error=session_expired';
    }
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }

  return response;
}
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetchWithAuthHeaders(url, options);

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      // Usamos tu función logout que ya sabe cómo limpiar la cookie de token
      logout(); 
      window.location.href = "/login";
    }
    throw new Error("Su sesión ha expirado.");
  }

  // 4. Manejo de errores de respuesta
  if (!res.ok) {
    // Intentamos obtener el mensaje de error del backend si existe
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Error en la petición");
  }

  return res;
}
async function fetchWithAuthHeaders(url: string, options: RequestInit = {}): Promise<Response> {
  // 1. Preparamos los headers combinando Content-Type, Auth y los que vengan por params
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...getAuthHeaders(), 
    ...(options.headers as Record<string, string> || {}),
  };

  // 2. Ejecutamos la petición
  const res = await apiFetch(url, {
    ...options,
    headers,
  });
  return res;
}