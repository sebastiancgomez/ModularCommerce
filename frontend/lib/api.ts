import { Product } from "../types/Product";
import { ProductCreate } from "../types/ProductCreate";
import { CategoryCreate } from "../types/CategoryCreate";
import { SubCategoryCreate } from "../types/SubCategoryCreate";
import { LoginCredentials } from "../types/Login";
import { logout } from "@/hooks/useAuth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);

  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function createProduct(payload: Partial<ProductCreate>) {
  const res = await fetchWithAuth(`${BASE_URL}/products`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  console.log(res);
  if (!res.ok) throw new Error("Error creating product");
  return res.json();
}

export async function updateProduct(id: string, payload: Partial<ProductCreate>) {
  const res = await fetchWithAuth(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error updating product");
  return res.json();
}

export async function getCategories() {
  const res = await fetchWithAuth(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error("Error fetching categories");
  return res.json();
}

export async function createCategory(payload: Partial<CategoryCreate>) {
  const res = await fetchWithAuth(`${BASE_URL}/categories`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error creating category");
  return res.json();
}

export async function getSubCategories() {
  const res = await fetchWithAuth(`${BASE_URL}/subcategories`, {
    method: "GET"
  });

  if (!res.ok) throw new Error("Error fetching subcategories");
  return res.json();
}

export async function createSubCategory(payload: Partial<SubCategoryCreate>) {
  const res =await fetchWithAuth(`${BASE_URL}/subcategories`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error creating subcategory");
  return res.json();
}

export async function login(payload: Partial<LoginCredentials>) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Invalid credentials");
  const data = await res.json();
  document.cookie = `token=${data.token}; path=/`;

  return data;
}



function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];

  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  // 1. Preparamos los headers combinando Content-Type, Auth y los que vengan por params
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...getAuthHeaders(), 
    ...(options.headers as Record<string, string> || {}),
  };

  // 2. Ejecutamos la petición
  const res = await fetch(url, {
    ...options,
    headers,
  });

  // 3. Manejo de sesión expirada (401)
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
// En lib/api.ts

// Opción A: Tu backend soporta búsqueda (Recomendado)
/*export async function searchProducts(query: string): Promise<Product[]> {
  const response = aw   ch(`${process.env.NEXT_PUBLIC_API_URL}/products?search=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Error buscando productos");
  return response.json();
}*/

// Opción B: Filtrado en el cliente (Si tienes pocos productos)


// OPCIÓN B: Buscador interactivo filtrando el array local
export async function searchProducts(query: string): Promise<Product[]> {
  const allProducts: Product[] = await getProducts();
  
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();

  return allProducts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) || 
    p.categoryName?.toLowerCase().includes(lowerQuery) ||
    p.subCategoryName?.toLowerCase().includes(lowerQuery)
  );
}
