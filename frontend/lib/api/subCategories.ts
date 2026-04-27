import { fetchWithAuth } from '@/lib/api/auth';
import { SubCategoryCreate } from '@/types/SubCategoryCreate';


export async function getSubCategories() {
  const res = await fetchWithAuth(`/subcategories`, {
    method: "GET"
  });

  if (!res.ok) throw new Error("Error fetching subcategories");
  return res.json();
}

export async function createSubCategory(payload: Partial<SubCategoryCreate>) {
  const res =await fetchWithAuth(`/subcategories`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error creating subcategory");
  return res.json();
}