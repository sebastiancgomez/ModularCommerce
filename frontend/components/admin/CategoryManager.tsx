"use client";

import { useState } from "react";
import { createCategory, getCategories } from "@/lib/api";
import type { Category } from "@/types/Category";

type Props = {
  initialCategories: Category[];
};

export default function CategoryManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");

  async function handleCreate() {
    if (!name.trim()) return;

    await createCategory({ name });

    const updated = await getCategories();
    setCategories(updated);

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
      <h2 style={{ marginBottom: 12 }}>Categories</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          style={{
            flex: 1,
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
            padding: "10px 14px",
            borderRadius: 6,
            border: "1px solid #444",
            background: "#1f1f1f",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Create
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((c) => (
          <li
            key={c.id}
            style={{
              padding: 10,
              borderBottom: "1px solid #222"
            }}
          >
            {c.name}
          </li>
        ))}
      </ul>
    </div>
  );
}