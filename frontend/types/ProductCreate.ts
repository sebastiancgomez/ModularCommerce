export interface ProductCreate {
  id?: string;
  sku: string;
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  subCategoryId: string;
  brand?: string;
  imageUrl: string;
}