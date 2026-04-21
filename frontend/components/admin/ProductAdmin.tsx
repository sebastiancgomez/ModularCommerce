"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  getCategories
} from "@/lib/api";

import { Product } from "@/types/Product";
import { Category } from "@/types/Category";
import Image from "next/image";

export default function ProductAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  type ProductForm = {
  sku: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  subCategoryId: string;
  brand: string;
  imageUrl: string;
};

  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    subCategoryId: "",
    brand: "",
    imageUrl: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [p, c] = await Promise.all([
      getProducts(),
      getCategories()
    ]);

    setProducts(p);
    setCategories(c);
  }

  function update<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm({
      sku: "",
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      subCategoryId: "",
      brand: "",
      imageUrl: ""
    });
    setEditingId(null);
  }

  async function handleSubmit() {
    setMessage(null);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    if (isNaN(payload.price) || isNaN(payload.stock)) {
      alert("Precio y stock deben ser números");
      return;
    }

    if (payload.price <= 0) {
      alert("Precio inválido");
      return;
    }
    if (!form.name || !form.sku) {
      alert("Nombre y SKU obligatorios");
      return;
    }

    if (!form.categoryId || !form.subCategoryId) {
      alert("Categoría y subcategoría obligatorias");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await updateProduct(editingId, form);
        setMessage("Producto actualizado correctamente");
      } else {
        await createProduct(form);
        setMessage("Producto creado correctamente");
      }

      await loadData();
      resetForm();
    } catch {
      alert("Error guardando producto");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(p: Product) {
    setEditingId(p.id);

    setForm({
      sku: p.sku ?? "",
      name: p.name ?? "",
      description: p.description ?? "",
      price: p.price?.toString() ?? "0",
      stock: p.stock?.toString() ?? "0",
      categoryId: p.categoryId ?? "",
      subCategoryId: p.subCategoryId ?? "",
      brand: p.brand || "",
      imageUrl: p.imageUrl
    });
  }

  const availableSubCategories = useMemo(() => {
    if (!form.categoryId) return [];
    return (
      categories.find((c) => c.id === form.categoryId)?.subCategories || []
    );
  }, [form.categoryId, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryId && p.categoryId !== categoryId) return false;
      if (subCategoryId && p.subCategoryId !== subCategoryId) return false;
      return true;
    });
  }, [products, categoryId, subCategoryId]);

  return (
    <div className="page">
      {/* FORM */}
      <div className="card">
        <h3 className="card-header">
          {editingId ? "Editar producto" : "Crear producto"}
        </h3>

        <div className="grid-2">
          <input className="input" placeholder="SKU" value={form.sku} onChange={(e) => update("sku", e.target.value)} />
          <input className="input" placeholder="Nombre" value={form.name} onChange={(e) => update("name", e.target.value)} />

          <input className="input" placeholder="Descripción" value={form.description} onChange={(e) => update("description", e.target.value)} />
          <input className="input" placeholder="Marca" value={form.brand} onChange={(e) => update("brand", e.target.value)} />
          <select
            className="select"
            value={form.categoryId}
            onChange={(e) => {
              update("categoryId", e.target.value);
              update("subCategoryId", "");
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
            className="select"
            value={form.subCategoryId}
            onChange={(e) => update("subCategoryId", e.target.value)}
          >
            <option value="">Subcategoría</option>
            {availableSubCategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Precio"
            value={form.price}
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*\.?\d*$/.test(value)) {
                update("price", value);
              }
            }}
          />

          <input
            className="input"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => {
              const value = e.target.value;

              if (/^\d*$/.test(value)) {
                update("stock", value);
              }
            }}
          />
          
          <input className="input" placeholder="Imagen URL" value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} />
        </div>

        <button className="button button-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
        </button>
      </div>
      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {/* FILTROS */}
      <div className="flex-row-sm">
        <select
          className="select"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setSubCategoryId("");
          }}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
        >
          <option value="">Todas las subcategorías</option>
          {categories
            .find((c) => c.id === categoryId)
            ?.subCategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>
      </div>

      {/* GRID */}
      <div className="product-grid">
        {filteredProducts.map((p) => (
          <div key={p.id} className="product-card">
            <Image
              src={p.imageUrl}
              alt={p.name}
              width={300}
              height={200}
              className="product-img"
            />

            <div className="product-info">
              <h4>{p.name}</h4>
              <span>${p.price}</span>
              <span>Stock: {p.stock}</span>
            </div>

            <button className="button" onClick={() => handleEdit(p)}>
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}