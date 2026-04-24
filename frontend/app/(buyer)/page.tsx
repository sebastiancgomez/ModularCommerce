import { Suspense } from "react"; // 1. Importamos Suspense

import ProductGrid from "@/components/buyer/ProductGrid";
import { getProducts } from "@/lib/api";
import { Product } from "@/types/Product";

export default async function Home() {
  const products: Product[] = await getProducts();
  
  const grouped = products.reduce((acc, product) => {
    const catName = product.categoryName || "Otros";
    if (!acc[catName]) {
      acc[catName] = [];
    }
    acc[catName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <>
      
      <main className="page">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="section">
            <h2 className="section-title">{category}</h2>
            <Suspense fallback={<p className="text-center">Cargando {category}...</p>}>
              <ProductGrid products={items} />
            </Suspense>
          </div>
        ))}
      </main>
    </>
  );
}