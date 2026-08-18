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

export const defaultProducts: Product[] = [
  {
    id: 1,
    name: "電競主機（客製化）",
    category: "電腦主機",
    price: 26900,
    stock: 10,
    status: "上架",
    description: [
      "Intel / AMD 可選",
      "RTX 系列顯示卡",
      "高效能散熱",
    ],
  },
  {
    id: 2,
    name: "ASUS 筆記型電腦",
    category: "筆記型電腦",
    price: 22900,
    stock: 8,
    status: "上架",
    description: [
      "Intel Core i5",
      "16GB RAM",
      "512GB SSD",
    ],
  },
  {
    id: 3,
    name: "Kingston 1TB SSD",
    category: "零組件",
    price: 1890,
    stock: 25,
    status: "上架",
    description: [
      "1TB 大容量",
      "高速讀寫",
      "適合桌機與筆電升級",
    ],
  },
];

const STORAGE_KEY = "linni-products";

export function loadProducts(): Product[] {
  if (typeof window === "undefined") {
    return defaultProducts;
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultProducts),
    );

    return defaultProducts;
  }

  try {
    return JSON.parse(saved) as Product[];
  } catch {
    return defaultProducts;
  }
}

export function saveProducts(
  products: Product[],
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(products),
  );

  window.dispatchEvent(
    new CustomEvent("linni-products-updated"),
  );
}