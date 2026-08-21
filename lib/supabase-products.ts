import { getSupabaseClient } from "@/lib/supabase";
import type {
  Product,
  ProductStatus,
} from "@/lib/products";

interface ProductRow {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string[];
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInput {
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string[];
  imageUrl?: string;
}

function mapProductRow(
  row: ProductRow,
): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    stock: row.stock,
    status: row.status,
    description: row.description ?? [],
    imageUrl: row.image_url ?? undefined,
  };
}

function requireSupabase() {
  const supabase =
    getSupabaseClient();

  if (!supabase) {
    throw new Error(
      "尚未完成 Supabase 設定。",
    );
  }

  return supabase;
}

/**
 * 前台使用：
 * 只取得「上架」商品。
 *
 * RLS 本身也會限制一般訪客
 * 只能讀取上架商品。
 */
export async function fetchPublicProducts(): Promise<
  Product[]
> {
  const supabase =
    requireSupabase();

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select("*")
    .eq("status", "上架")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `讀取商品失敗：${error.message}`,
    );
  }

  return (
    (data as ProductRow[] | null) ??
    []
  ).map(mapProductRow);
}

/**
 * 後台使用：
 * 管理員登入後取得全部商品，
 * 包含上架與下架。
 */
export async function fetchAdminProducts(): Promise<
  Product[]
> {
  const supabase =
    requireSupabase();

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `讀取後台商品失敗：${error.message}`,
    );
  }

  return (
    (data as ProductRow[] | null) ??
    []
  ).map(mapProductRow);
}

/**
 * 新增商品。
 */
export async function createProduct(
  input: ProductInput,
): Promise<Product> {
  const supabase =
    requireSupabase();

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .insert({
      name: input.name,
      category: input.category,
      price: input.price,
      stock: input.stock,
      status: input.status,
      description:
        input.description,
      image_url:
        input.imageUrl ?? null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      `新增商品失敗：${error.message}`,
    );
  }

  return mapProductRow(
    data as ProductRow,
  );
}

/**
 * 修改商品。
 */
export async function updateProduct(
  id: number,
  input: ProductInput,
): Promise<Product> {
  const supabase =
    requireSupabase();

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .update({
      name: input.name,
      category: input.category,
      price: input.price,
      stock: input.stock,
      status: input.status,
      description:
        input.description,
      image_url:
        input.imageUrl ?? null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(
      `修改商品失敗：${error.message}`,
    );
  }

  return mapProductRow(
    data as ProductRow,
  );
}

/**
 * 快速切換商品上下架。
 */
export async function updateProductStatus(
  id: number,
  status: ProductStatus,
): Promise<Product> {
  const supabase =
    requireSupabase();

  const {
    data,
    error,
  } = await supabase
    .from("products")
    .update({
      status,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(
      `更新商品狀態失敗：${error.message}`,
    );
  }

  return mapProductRow(
    data as ProductRow,
  );
}

/**
 * 刪除商品資料。
 *
 * 目前只刪除 Database 記錄。
 * 商品圖片會在下一階段一起處理，
 * 避免 Storage 留下孤兒檔案。
 */
export async function deleteProduct(
  id: number,
): Promise<void> {
  const supabase =
    requireSupabase();

  const { error } =
    await supabase
      .from("products")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(
      `刪除商品失敗：${error.message}`,
    );
  }
}