
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`, {
    cache: "no-store"
  });

  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function createProduct(payload) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error creating product");
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${BASE_URL}/categories`, {
    cache: "no-store"
  });

  if (!res.ok) throw new Error("Error fetching categories");
  return res.json();
}

export async function createCategory(payload) {
  console.log(payload);
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error creating category");
  return res.json();
}

export async function getSubCategories() {
  const res = await fetch(`${BASE_URL}/subcategories`, {
    cache: "no-store"
  });

  if (!res.ok) throw new Error("Error fetching subcategories");
  return res.json();
}

export async function createSubCategory(payload) {
  const res = await fetch(`${BASE_URL}/subcategories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error creating subcategory");
  return res.json();
}

