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
    <div>
      <div className="card">
        <h2 className="card-header">Crear Subcategoria</h2>

        <div className="grid-2">
            <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="select"
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
           className="input"
            />
        </div>
        <div>
          <button
              onClick={handleCreate}
            className="button button-full"
              >
              Create
          </button>
        </div>
      </div>
      <div className="card">  
        <h2 className="card-header">Subcategorias Existentes</h2>
        <div className="grid-2">
          <h3 className="card-header">SubCategoria</h3>
          <h3 className="card-header">Categoria</h3>
        </div>
        <div>
            {subCategories.map((s) => (
            <div
                key={s.id}
                className="grid-2"
            >
                <span className="input">{s.name}</span>
                <span className="input" style={{ color: "#888" }}>{s.categoryName}</span>
            </div>
            ))}
        </div>
    </div>
    </div>
  );
}