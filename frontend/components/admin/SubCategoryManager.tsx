"use client";

import { useState } from "react";
import { createSubCategory, getSubCategories } from "@/lib/api";
import type { Category } from "@/types/Category";
import type { SubCategory } from "@/types/SubCategory";

type Props = {
  categories: Category[];
  initialSubCategories: SubCategory[];
};

export default function SubCategoryManager({
  categories,
  initialSubCategories
}: Props) {
  const [subCategories, setSubCategories] =
    useState<SubCategory[]>(initialSubCategories);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  async function load() {
    const data = await getSubCategories();
    setSubCategories(data);
  }

  async function handleCreate() {
    if (!name || !categoryId) return;

    await createSubCategory({
      name,
      categoryId
    });

    await load();

    setName("");
  }

  return (
    <div style={{
        background: "#111",
        border: "1px solid #333",
        borderRadius: 10,
        padding: 16,
        marginBottom: 20
        }}>
        <h2 style={{ marginBottom: 12 }}>Subcategories</h2>

        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginBottom: 16
        }}>
            <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{
                padding: 10,
                borderRadius: 6,
                border: "1px solid #444",
                background: "#0a0a0a",
                color: "#fff"
            }}
            >
            <option value="">Category</option>
            {categories.map((c) => (
                <option key={c.id} value={c.id}>
                {c.name}
                </option>
            ))}
            </select>

            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Subcategory"
            style={{
                padding: 10,
                borderRadius: 6,
                border: "1px solid #444",
                background: "#0a0a0a",
                color: "#fff"
            }}
            />

            <button
            onClick={handleCreate}
            style={{
                padding: 10,
                borderRadius: 6,
                border: "1px solid #444",
                background: "#1f1f1f",
                color: "#fff"
            }}
            >
            Create
            </button>
        </div>

        <div>
            {subCategories.map((s) => (
            <div
                key={s.id}
                style={{
                padding: 10,
                borderBottom: "1px solid #222",
                display: "flex",
                justifyContent: "space-between"
                }}
            >
                <span>{s.name}</span>
                <span style={{ color: "#888" }}>{s.categoryName}</span>
            </div>
            ))}
        </div>
    </div>
  );
}