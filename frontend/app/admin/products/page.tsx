import ProductManager from "@/components/admin/ProductManager";

export default async function ProductsPage() {
 

  return (
    <div className="page">
      <h1>Productos</h1>
      <ProductManager />;
    </div>
  );
}