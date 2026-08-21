import { getSupabaseClient } from "@/lib/supabase";

const PRODUCT_IMAGE_BUCKET = "product-images";

export interface UploadedProductImage {
  path: string;
  publicUrl: string;
}

/**
 * 取得 Supabase Client。
 */
function requireSupabase() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error("尚未完成 Supabase 設定。");
  }

  return supabase;
}

/**
 * 清理檔名，避免特殊字元造成 Storage 路徑問題。
 */
function sanitizeFileName(fileName: string): string {
  const extension =
    fileName.split(".").pop()?.toLowerCase() || "webp";

  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  return `${baseName || "product"}.${extension}`;
}

/**
 * 產生不重複的 Storage 檔案路徑。
 *
 * 格式：
 * products/時間戳記-UUID-檔名.webp
 */
function createStoragePath(fileName: string): string {
  const safeFileName = sanitizeFileName(fileName);

  const uniqueId =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  return `products/${Date.now()}-${uniqueId}-${safeFileName}`;
}

/**
 * 將已壓縮完成的商品圖片上傳至 Supabase Storage。
 *
 * 傳入的 File 建議已經先經過：
 *
 * compressImage(...)
 *
 * 成功後回傳：
 * - Storage path
 * - 公開圖片網址
 */
export async function uploadProductImage(
  file: File,
): Promise<UploadedProductImage> {
  const supabase = requireSupabase();

  if (!file.type.startsWith("image/")) {
    throw new Error("只能上傳圖片檔案。");
  }

  const path = createStoragePath(file.name);

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    throw new Error(
      `商品圖片上傳失敗：${uploadError.message}`,
    );
  }

  const { data } = supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(path);

  if (!data.publicUrl) {
    /*
     * 如果取得公開網址失敗，
     * 把剛才已上傳的檔案清掉，
     * 避免 Storage 留下無法使用的檔案。
     */
    await supabase.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .remove([path]);

    throw new Error("無法取得商品圖片公開網址。");
  }

  return {
    path,
    publicUrl: data.publicUrl,
  };
}

/**
 * 直接透過 Storage path 刪除商品圖片。
 */
export async function deleteProductImageByPath(
  path: string,
): Promise<void> {
  const supabase = requireSupabase();

  if (!path.trim()) {
    return;
  }

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw new Error(
      `刪除商品圖片失敗：${error.message}`,
    );
  }
}

/**
 * 從 Supabase Public URL 取得 Storage path。
 *
 * 例如：
 *
 * https://xxxx.supabase.co/storage/v1/object/public/product-images/products/abc.webp
 *
 * 會得到：
 *
 * products/abc.webp
 */
export function getProductImagePathFromUrl(
  imageUrl: string,
): string | null {
  if (!imageUrl) {
    return null;
  }

  try {
    const url = new URL(imageUrl);

    const marker = `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`;

    const markerIndex = url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const encodedPath = url.pathname.slice(
      markerIndex + marker.length,
    );

    if (!encodedPath) {
      return null;
    }

    return decodeURIComponent(encodedPath);
  } catch {
    return null;
  }
}

/**
 * 使用圖片公開 URL 刪除 Storage 裡的圖片。
 *
 * 如果網址不是本專案 product-images bucket 的網址，
 * 會直接略過，不會誤刪其他圖片。
 */
export async function deleteProductImageByUrl(
  imageUrl?: string,
): Promise<void> {
  if (!imageUrl) {
    return;
  }

  const path = getProductImagePathFromUrl(imageUrl);

  if (!path) {
    return;
  }

  await deleteProductImageByPath(path);
}

/**
 * 嘗試刪除圖片。
 *
 * 適合在商品刪除或圖片替換時使用。
 * 如果圖片刪除失敗，不直接讓整個商品操作中斷，
 * 但會在 Console 留下錯誤供除錯。
 */
export async function safelyDeleteProductImage(
  imageUrl?: string,
): Promise<void> {
  if (!imageUrl) {
    return;
  }

  try {
    await deleteProductImageByUrl(imageUrl);
  } catch (error) {
    console.error(
      "清除舊商品圖片失敗：",
      error,
    );
  }
}