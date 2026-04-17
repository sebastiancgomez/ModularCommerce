"use client";

import { useMemo, useState } from "react";
import type { ProductCreate } from "@/types/ProductCreate";
import type { Category } from "@/types/Category";
import type { SubCategory } from "@/types/SubCategory"; 
import { createProduct } from "@/lib/api";

type Props = {
  categories: Category[];
  subCategories: SubCategory[];
  initialProducts: ProductCreate[];
};

export default function ProductAdminForm({
  categories,
  subCategories,
  initialProducts
}: Props) {
  const [form, setForm] = useState<ProductCreate>({
  sku: "",
  name: "",
  description: "",
  price: 0,
  stock: 0,
  categoryId: "",
  subCategoryId: "",
  brand: "",
  imageUrl: ""
});
  const [products] = useState(initialProducts);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        !categoryId || String(p.categoryId) === String(categoryId);

      const matchSubCategory =
        !subCategoryId || String(p.subCategoryId) === String(subCategoryId);

      return matchCategory && matchSubCategory;
    });
  }, [products, categoryId, subCategoryId]);

  const availableSubCategories = useMemo(() => {
    return subCategories.filter(
      (s) => !categoryId || s.categoryId === categoryId
    );
  }, [subCategories, categoryId]);

  async function handleCreate() {
      if (
        !form.sku ||
        !form.name ||
        !form.categoryId ||
        !form.subCategoryId
      ) return;
  
      await createProduct(form);
  
      setForm({
        sku: "",
        name: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: "",
        subCategoryId: "",
        brand: "",
        imageUrl: ""
      });
    }

  function update<K extends keyof ProductCreate>(
    field: K,
    value: ProductCreate[K]
  ) {
    setForm((prev) => ({
        ...prev,
        [field]: value
    }));
  }

  return (
    
    <div>
      <div style={{
  background: "#111",
  border: "1px solid #333",
  borderRadius: 10,
  padding: 16,
  marginBottom: 16
}}>
  <h3 style={{ marginBottom: 12 }}>Crear producto</h3>

  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10
  }}>
    <input placeholder="SKU" value={form.sku} onChange={(e) => update("sku", e.target.value)} />
    <input placeholder="Nombre" value={form.name} onChange={(e) => update("name", e.target.value)} />

    <input placeholder="Descripción" value={form.description} onChange={(e) => update("description", e.target.value)} />

    <input type="number" placeholder="Precio" value={form.price} onChange={(e) => update("price", Number(e.target.value))} />

    <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => update("stock", Number(e.target.value))} />

    <select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)}>
      <option value="">Categoría</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>

    <select value={form.subCategoryId} onChange={(e) => update("subCategoryId", e.target.value)}>
      <option value="">Subcategoría</option>
      {availableSubCategories.map((s) => (
        <option key={s.id} value={s.id}>{s.name}</option>
      ))}
    </select>

    <input placeholder="Marca" value={form.brand} onChange={(e) => update("brand", e.target.value)} />

    <input placeholder="Imagen URL" value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} />
  </div>

  <button onClick={handleCreate} style={{
    marginTop: 12,
    width: "100%",
    padding: 10,
    background: "#1f1f1f",
    border: "1px solid #444",
    borderRadius: 6,
    color: "#fff"
  }}>
    Crear producto
  </button>
</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setSubCategoryId("");
          }}
        >
          <option value="">Categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
        >
          <option value="">Subcategoría</option>
          {availableSubCategories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            style={{
              padding: 10,
              borderBottom: "1px solid #222"
            }}
          >
            <div>{p.name}</div>
            <div style={{ color: "#888" }}>
              {p.price} | {p.stock}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}