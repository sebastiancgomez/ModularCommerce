
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`);

  if (!res.ok) throw new Error("Error fetching products");
  return res.json();
}

export async function createProduct(payload) {
  const res = await fetchWithAuth(`${BASE_URL}/products`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  console.log(res);
  if (!res.ok) throw new Error("Error creating product");
  return res.json();
}

export async function updateProduct(id, payload) {
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

export async function createCategory(payload) {
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

export async function createSubCategory(payload) {
  const res =await fetchWithAuth(`${BASE_URL}/subcategories`, {
    method: "POST",
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Error creating subcategory");
  return res.json();
}

export async function login(payload) {
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



function getAuthHeaders() {
  if (typeof window === "undefined") return {};

  const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

async function fetchWithAuth(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error("Request failed");
  }
  return res;
}