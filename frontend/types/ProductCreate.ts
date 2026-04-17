export interface ProductCreate {
  id?: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  subCategoryId: string;
  brand?: string;
  imageUrl: string;
}