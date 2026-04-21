import ProductAdmin from "@/components/admin/ProductAdmin";

export default async function ProductsPage() {
 

  return (
    <div className="page">
      <h1>Productos</h1>
      <ProductAdmin />;
    </div>
  );
}