import { apiFetch } from './client';
import { Product } from '@/types/Product';
import { ProductCreate } from '@/types/ProductCreate';
import { fetchWithAuth } from '@/lib/api/auth';

export async function getProducts() {
  const res = await apiFetch(`/products`);

  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function getProductById(id: string): Promise<Product> {
  const res = await apiFetch(`/products/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function createProduct(payload: Partial<ProductCreate>) {
  const res = await fetchWithAuth(`/products`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  console.log(res);
  if (!res.ok) throw new Error("Error creating product");
  return res.json();
}

export async function updateProduct(id: string, payload: Partial<ProductCreate>) {
  const res = await fetchWithAuth(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error updating product");
  return res.json();
}

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