"use client";

import { useState, useEffect } from "react"; // 1. Importamos useEffect
import { createSubCategory, getSubCategories } from "@/lib/api/subCategories"; // 2. Importamos getCategories
import{getCategories} from  "@/lib/api/categories";
import type { Category } from "@/types/Category";
import type { SubCategory } from "@/types/SubCategory";

type Props = {
  categories: Category[];
  initialSubCategories: SubCategory[];
};

export default function SubCategoryManager({
  categories: initialCategories, // Renombramos para claridad
  initialSubCategories
}: Props) {
  // Estados para las listas
  const [subCategories, setSubCategories] = useState<SubCategory[]>(initialSubCategories);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  // Estados para el formulario
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // 3. EFECTO DE CARGA DINÁMICA
  useEffect(() => {
    async function refreshData() {
      // Cargamos categorías para el select y subcategorías para la lista simultáneamente
      const [freshSubCats, freshCats] = await Promise.all([
        getSubCategories(),
        getCategories()
      ]);
      
      setSubCategories(freshSubCats);
      setCategories(freshCats);
    }
    
    refreshData();
  }, []); // Se ejecuta solo al cargar la página

  async function loadSubCategories() {
    const data = await getSubCategories();
    setSubCategories(data);
  }

  async function handleCreate() {
    if (!name || !categoryId) return;

    await createSubCategory({
      name,
      categoryId
    });

    await loadSubCategories();

    setName("");
    setCategoryId(""); // Opcional: resetear el select
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
              <option value="">Seleccione una Categoría</option>
              {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
              ))}
            </select>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nueva Subcategoría"
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
                <span className="input" style={{ color: "#888" }}>
                  {s.categoryName || "Sin categoría"}
                </span>
            </div>
            ))}
        </div>
    </div>
    </div>
  );
}