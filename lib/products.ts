export type ProductStatus = "上架" | "下架";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string[];
  imageUrl?: string;
}