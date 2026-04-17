import type { SubCategory } from "@/types/SubCategory";
export interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
  createdAt: string;
}