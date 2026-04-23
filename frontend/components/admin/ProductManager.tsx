"use client";

import { useEffect, useMemo, useState } from "react";
// Importamos el Widget
import { CldUploadWidget } from "next-cloudinary";
import {
  getProducts,
  createProduct,
  updateProduct,
  getCategories
} from "@/lib/api";

import { Product } from "@/types/Product";
import { Category } from "@/types/Category";
import Image from "next/image";
import { ProductCreate } from "@/types/ProductCreate";

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterSubCategoryId, setFilterSubCategoryId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<ProductCreate>>({
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
    try {
      const [p, c] = await Promise.all([getProducts(), getCategories()]);
      setProducts(p || []);
      setCategories(c || []);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  }

  function update(field: string, value: string) {
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

    if (!form.name || !form.sku || !form.categoryId || !form.subCategoryId) {
      alert("Faltan campos obligatorios");
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
      imageUrl: p.imageUrl || ""
    });
  }

  const formSubCategories = useMemo(() => {
    if (!form.categoryId) return [];
    return categories.find((c) => c.id === form.categoryId)?.subCategories || [];
  }, [form.categoryId, categories]);

  const filterSubCategories = useMemo(() => {
    if (!filterCategoryId) return [];
    return categories.find((c) => c.id === filterCategoryId)?.subCategories || [];
  }, [filterCategoryId, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = !filterCategoryId || p.categoryId === filterCategoryId;
      const matchesSubCategory = !filterSubCategoryId || p.subCategoryId === filterSubCategoryId;
      return matchesCategory && matchesSubCategory;
    });
  }, [products, filterCategoryId, filterSubCategoryId]);

  return (
    <div className="page">
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
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="select"
            value={form.subCategoryId}
            onChange={(e) => update("subCategoryId", e.target.value)}
          >
            <option value="">Subcategoría</option>
            {formSubCategories.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <input className="input" placeholder="Precio" value={form.price} onChange={(e) => update("price", e.target.value)} />
          <input className="input" placeholder="Stock" value={form.stock} onChange={(e) => update("stock", e.target.value)} />
          
          {/* Sección de Imagen URL y Subida */}
          <div className="grid-2" style={{ gridColumn: "1 / -1" }}> 
            <div className="flex-row-sm">
              <input 
                className="input" 
                placeholder="Imagen URL" 
                value={form.imageUrl} 
                onChange={(e) => update("imageUrl", e.target.value)} 
              />
              
              <CldUploadWidget 
                // Extraemos el preset de las variables de entorno
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} 
                onSuccess={(result) => {
                  if (typeof result.info !== "string" && result.info?.secure_url) {
                    update("imageUrl", result.info.secure_url);
                  }
                }}
                // Dejamos solo las opciones de comportamiento, ya no info sensible
                options={{
                  sources: ['local', 'url'],
                  multiple: false,
                  maxFiles: 1
                }}
              >
                {({ open }) => (
                  <button 
                    type="button" 
                    className="button btn-upload" 
                    onClick={() => open()}
                  >
                    Subir Imagen
                  </button>
                )}
              </CldUploadWidget>
            </div>

            {/* Vista previa con la nueva clase sugerida */}
            {form.imageUrl && (
              <div className="upload-preview">
                <Image src={form.imageUrl} alt="Preview" width={20} height={20} />
                <span>{form.imageUrl}</span>
              </div>
            )}
          </div>
        </div>

        <button className="button button-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
        </button>
      </div>

      {/* El resto del código de la galería se mantiene igual... */}
      {message && <div className="success-message">{message}</div>}

      <div className="flex-row-sm">
        <select
          className="select"
          value={filterCategoryId}
          onChange={(e) => {
            setFilterCategoryId(e.target.value);
            setFilterSubCategoryId("");
          }}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          className="select"
          value={filterSubCategoryId}
          onChange={(e) => setFilterSubCategoryId(e.target.value)}
        >
          <option value="">Todas las subcategorías</option>
          {filterSubCategories.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.map((p) => (
          <div key={p.id} className="product-card">
            {p.imageUrl && (
              <Image
                src={p.imageUrl}
                alt={p.name}
                width={300}
                height={200}
                className="product-img"
                unoptimized
              />
            )}
            <div className="product-info">
              <h4>{p.name}</h4>
              <span>${p.price}</span>
              <span>Stock: {p.stock}</span>
            </div>
            <button className="button" onClick={() => handleEdit(p)}>Editar</button>
          </div>
        ))}
      </div>
    </div>
  )
}