import { getCategories, getSubCategories } from "@/lib/api";
import SubCategoryManager from "@/components/admin/SubCategoryManager";

export default async function SubCategoriesPage() {
  const [categories, subCategories] = await Promise.all([
    getCategories(),
    getSubCategories()
  ]);

  return (
    <div className="page">
      <h1>Subcategorías</h1>

      <SubCategoryManager
        categories={categories}
        initialSubCategories={subCategories}
      />
    </div>
  );
}