import Header from "../components/BuyerHeader";
import Navbar from "../components/Navbar";
import ProductGrid from "../components/ProductGrid";
import { getProducts } from "../lib/api";
import { Product } from "../types/Product";


export default async function Home() {
  const products : Product[] = await getProducts();
  const grouped = products.reduce((acc, product) => {
    if (!acc[product.categoryName]) {
      acc[product.categoryName] = [];
    }

    acc[product.categoryName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <>
      <Header />
      <Navbar />

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="section">
          <h2 className="section-title">{category}</h2>
          <ProductGrid products={items} />
        </div>
      ))}
    </>
  );
}