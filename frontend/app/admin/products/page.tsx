import {
  getCategories,
  getSubCategories,
  getProducts
} from "@/lib/api";

import ProductAdmin from "@/components/admin/ProductAdmin";

export default async function ProductsPage() {
  const [categories, subCategories, products] = await Promise.all([
    getCategories(),
    getSubCategories(),
    getProducts()
  ]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Productos</h1>

      <ProductAdmin
        categories={categories}
        subCategories={subCategories}
        initialProducts={products}
      />
    </div>
  );
}