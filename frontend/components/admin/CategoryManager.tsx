"use client";

import { useState, useEffect } from "react"; // Añadimos useEffect
import { createCategory, getCategories } from "@/lib/api/categories";
import type { Category } from "@/types/Category";

type Props = {
  initialCategories: Category[];
};

export default function CategoryManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [name, setName] = useState("");

  // EFECTO PARA CARGAR DATOS FRESCOS AL ENTRAR
  useEffect(() => {
    async function load() {
      const data = await getCategories();
      setCategories(data);
    }
    load();
  }, []); // Se ejecuta una vez al cargar la página

  async function handleCreate() {
    if (!name.trim()) return;
    await createCategory({ name });
    const updated = await getCategories();
    setCategories(updated);
    setName("");
  }

  return (
    <div>
    <div className="card" style={{ width: "50%" }}>
      <h3 className="card-header">Crear Categoria</h3>

      <div className="flex-1">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category"
          className="input"
        />
        </div>
        <div className="flex-1">
        <button
          onClick={handleCreate}
          className="button button-full"
        >
          Create
        </button>
        
      </div>
      </div>

      <div className="card" style={{ width: "50%" }}>
        <h2 className="card-header">Categorias Existentes</h2>  

      <ul className="grid-2 ul-1">
        {categories.map((c) => (
          <li
            key={c.id}
            className="li-1"
          >
            {c.name}
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}