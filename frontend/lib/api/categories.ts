import { fetchWithAuth } from '@/lib/api/auth';
import { CategoryCreate } from '@/types/CategoryCreate';

export async function getCategories() {
  const res = await fetchWithAuth(`/categories`);
  if (!res.ok) throw new Error("Error fetching categories");
  return res.json();
}

export async function createCategory(payload: Partial<CategoryCreate>) {
  const res = await fetchWithAuth(`/categories`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error creating category");
  return res.json();
}