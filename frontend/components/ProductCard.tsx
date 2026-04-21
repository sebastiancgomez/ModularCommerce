import Image from "next/image";
import { Product } from "../types/Product";


export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card">
      <Image
        src={product.imageUrl || "/placeholder.jpg"}
        alt={product.name}
        width={200}
        height={200}
      />

      <h3 >{product.name}</h3>
      <p>{product.subCategoryName}</p>

      <div className="price">${product.price}</div>
    </div>
  );
}