"use client";

import { useMemo, useState } from "react";
import { createProduct } from "@/lib/api";
import type { Category } from "@/types/Category";
import type { SubCategory } from "@/types/SubCategory";
import type { ProductCreate } from "@/types/ProductCreate";

type Props = {
  categories: Category[];
  subCategories: SubCategory[];
};

export default function ProductAdminManager({
  categories,
  subCategories
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

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter(
      (s) => s.categoryId === form.categoryId
    );
  }, [form.categoryId, subCategories]);

  function updateField<K extends keyof ProductCreate>(
    field: K,
    value: ProductCreate[K]
  ) {
    setForm((prev) => ({
        ...prev,
        [field]: value
    }));
  }

  async function handleSubmit() {
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

  return (
    <div style={{
        background: "#111",
        border: "1px solid #333",
        borderRadius: 10,
        padding: 16
    }}>
      <h2 style={{ marginBottom: 12 }}>Products</h2>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10
      }}>
        <input
            placeholder="SKU"
            value={form.sku}
            onChange={(e) => updateField("sku", e.target.value)}
        />

        <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
        />

        <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
        />

        <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
        />

        <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => updateField("stock", Number(e.target.value))}
        />

        <select
            value={form.categoryId}
            onChange={(e) => {
            updateField("categoryId", e.target.value);
            updateField("subCategoryId", "");
            }}
        >
            <option value="">Category</option>
            {categories.map((c) => (
            <option key={c.id} value={c.id}>
                {c.name}
            </option>
            ))}
        </select>

        <select
            value={form.subCategoryId}
            onChange={(e) =>
            updateField("subCategoryId", e.target.value)
            }
        >
            <option value="">SubCategory</option>
            {filteredSubCategories.map((s) => (
            <option key={s.id} value={s.id}>
                {s.name}
            </option>
            ))}
        </select>

        <input
            placeholder="Brand"
            value={form.brand}
            onChange={(e) => updateField("brand", e.target.value)}
        />

        <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => updateField("imageUrl", e.target.value)}
        />

        <button onClick={handleSubmit}>
            Create Product
        </button>
    </div>
    </div>
  );
}