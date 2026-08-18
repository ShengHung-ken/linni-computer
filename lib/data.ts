export type ProductStatus = "上架" | "下架";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string[];
}

export const services = [
  {
    title: "筆電維修",
    description: "筆電故障檢測、螢幕、電池與零件更換。",
  },
  {
    title: "組裝升級",
    description: "客製化桌機組裝、硬體升級及效能優化。",
  },
  {
    title: "系統重灌",
    description: "Windows 安裝、驅動程式、資料備份。",
  },
  {
    title: "配件周邊",
    description: "SSD、RAM、鍵盤、滑鼠及各式電腦配件。",
  },
  {
    title: "數位監控",
    description: "監視器設備規劃、安裝及設定服務。",
  },
  {
    title: "清潔保養",
    description: "桌機與筆電除塵、散熱及基礎保養。",
  },
  {
    title: "二手回收",
    description: "二手電腦及零組件回收與估價。",
  },
  {
    title: "電腦施工",
    description: "企業、商家及住家電腦設備現場服務。",
  },
];

export const initialProducts: Product[] = [
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
      "適合桌機及筆電升級",
    ],
  },
  {
    id: 4,
    name: "Corsair 16GB 記憶體",
    category: "零組件",
    price: 1490,
    stock: 20,
    status: "上架",
    description: [
      "DDR4 3200",
      "16GB 容量",
      "穩定高效能",
    ],
  },
  {
    id: 5,
    name: "RGB 電競鍵鼠組",
    category: "周邊配件",
    price: 990,
    stock: 15,
    status: "上架",
    description: [
      "RGB 燈效",
      "舒適手感",
      "遊戲及日常使用",
    ],
  },
];