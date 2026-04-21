export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
  subCategoryId: string;
  subCategoryName: string;
  brand?: string;
  imageUrl: string;
}