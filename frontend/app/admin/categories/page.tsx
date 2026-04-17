import { getCategories } from "@/lib/api";
import CategoryManager from "@/components/admin/CategoryManager";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div style={{ padding: 20 }}>
      <h1>Categorías</h1>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}