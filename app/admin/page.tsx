"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Boxes,
  ImagePlus,
  LogOut,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  compressImage,
  fileToDataUrl,
  formatFileSize,
} from "@/lib/image";

import {
  deleteProductImageByPath,
  safelyDeleteProductImage,
  uploadProductImage,
} from "@/lib/product-storage";

import type {
  Product,
  ProductStatus,
} from "@/lib/products";

import {
  createProduct,
  deleteProduct as deleteSupabaseProduct,
  fetchAdminProducts,
  type ProductInput,
  updateProduct,
  updateProductStatus,
} from "@/lib/supabase-products";

import { getSupabaseClient } from "@/lib/supabase";

interface ProductForm {
  name: string;
  category: string;
  price: string;
  stock: string;
  status: ProductStatus;
  description: string;
  imageUrl: string;
}

const emptyForm: ProductForm = {
  name: "",
  category: "電腦主機",
  price: "",
  stock: "",
  status: "上架",
  description: "",
  imageUrl: "",
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("zh-TW").format(price);
}

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function isAdmin(
  appMetadata: Record<string, unknown> | undefined,
): boolean {
  return appMetadata?.role === "admin";
}

export default function AdminPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);

  const [form, setForm] =
    useState<ProductForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [
    pendingImageFile,
    setPendingImageFile,
  ] = useState<File | null>(null);

  const [compressing, setCompressing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [
    updatingStatusId,
    setUpdatingStatusId,
  ] = useState<number | null>(null);

  const [imageInfo, setImageInfo] =
    useState("");

  const [imageError, setImageError] =
    useState("");

  const [authChecking, setAuthChecking] =
    useState(true);

  const [
    configurationError,
    setConfigurationError,
  ] = useState(false);

  const [pageError, setPageError] =
    useState("");

  useEffect(() => {
    async function initialize() {
      const supabase =
        getSupabaseClient();

      if (!supabase) {
        setConfigurationError(true);
        setAuthChecking(false);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (
        userError ||
        !user ||
        !isAdmin(user.app_metadata)
      ) {
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      try {
        const currentProducts =
          await fetchAdminProducts();

        setProducts(currentProducts);
      } catch (error) {
        setPageError(
          getErrorMessage(
            error,
            "無法讀取商品資料。",
          ),
        );
      } finally {
        setAuthChecking(false);
      }
    }

    initialize();
  }, [router]);

  const statistics = useMemo(() => {
    const online = products.filter(
      (product) =>
        product.status === "上架",
    ).length;

    const offline = products.filter(
      (product) =>
        product.status === "下架",
    ).length;

    const stock = products.reduce(
      (total, product) =>
        total + product.stock,
      0,
    );

    return {
      total: products.length,
      online,
      offline,
      stock,
    };
  }, [products]);

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setPendingImageFile(null);
    setImageInfo("");
    setImageError("");
  }

  function startEdit(product: Product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      status: product.status,
      description:
        product.description.join("\n"),
      imageUrl:
        product.imageUrl ?? "",
    });

    setPendingImageFile(null);
    setImageInfo("");
    setImageError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEdit() {
    resetForm();
  }

  async function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");
    setImageInfo("");

    if (
      !file.type.startsWith("image/")
    ) {
      setImageError(
        "請選擇圖片檔案。",
      );

      event.target.value = "";
      return;
    }

    const maxOriginalSize =
      15 * 1024 * 1024;

    if (
      file.size > maxOriginalSize
    ) {
      setImageError(
        "原始圖片不可超過 15MB。",
      );

      event.target.value = "";
      return;
    }

    try {
      setCompressing(true);

      const compressedFile =
        await compressImage(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.8,
          mimeType: "image/webp",
        });

      const previewUrl =
        await fileToDataUrl(
          compressedFile,
        );

      setPendingImageFile(
        compressedFile,
      );

      setForm((current) => ({
        ...current,
        imageUrl: previewUrl,
      }));

      const savedPercent =
        file.size > 0
          ? Math.max(
              0,
              Math.round(
                (1 -
                  compressedFile.size /
                    file.size) *
                  100,
              ),
            )
          : 0;

      setImageInfo(
        `原始 ${formatFileSize(
          file.size,
        )} → 壓縮後 ${formatFileSize(
          compressedFile.size,
        )}，節省 ${savedPercent}%`,
      );
    } catch (error) {
      setImageError(
        getErrorMessage(
          error,
          "圖片壓縮失敗。",
        ),
      );
    } finally {
      setCompressing(false);
      event.target.value = "";
    }
  }

  function removeImage() {
    setPendingImageFile(null);

    setForm((current) => ({
      ...current,
      imageUrl: "",
    }));

    setImageInfo("");
    setImageError("");
  }

  function validateProduct():
    | ProductInput
    | null {
    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(
      form.stock || 0,
    );

    if (!name) {
      alert("請輸入商品名稱。");
      return null;
    }

    if (!form.price.trim()) {
      alert("請輸入商品價格。");
      return null;
    }

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      alert("商品價格格式錯誤。");
      return null;
    }

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      alert("庫存格式錯誤。");
      return null;
    }

    return {
      name,
      category: form.category,
      price,
      stock,
      status: form.status,
      description:
        form.description
          .split("\n")
          .map((item) =>
            item.trim(),
          )
          .filter(Boolean),
      imageUrl: undefined,
    };
  }

  async function saveProduct(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      compressing ||
      saving
    ) {
      return;
    }

    const productInput =
      validateProduct();

    if (!productInput) {
      return;
    }

    const existingProduct =
      editingId !== null
        ? products.find(
            (product) =>
              product.id === editingId,
          )
        : undefined;

    let uploadedImagePath:
      | string
      | null = null;

    try {
      setSaving(true);
      setPageError("");

      let finalImageUrl:
        | string
        | undefined;

      if (pendingImageFile) {
        const uploadedImage =
          await uploadProductImage(
            pendingImageFile,
          );

        uploadedImagePath =
          uploadedImage.path;

        finalImageUrl =
          uploadedImage.publicUrl;
      } else if (
        form.imageUrl &&
        !form.imageUrl.startsWith(
          "data:",
        )
      ) {
        finalImageUrl =
          form.imageUrl;
      }

      const payload: ProductInput = {
        ...productInput,
        imageUrl: finalImageUrl,
      };

      if (editingId !== null) {
        const updatedProduct =
          await updateProduct(
            editingId,
            payload,
          );

        setProducts((current) =>
          current.map((product) =>
            product.id === editingId
              ? updatedProduct
              : product,
          ),
        );

        if (
          existingProduct?.imageUrl &&
          existingProduct.imageUrl !==
            updatedProduct.imageUrl
        ) {
          await safelyDeleteProductImage(
            existingProduct.imageUrl,
          );
        }

        alert(
          "商品修改完成。",
        );
      } else {
        const newProduct =
          await createProduct(
            payload,
          );

        setProducts((current) => [
          newProduct,
          ...current,
        ]);

        alert(
          "商品新增完成。",
        );
      }

      resetForm();
    } catch (error) {
      if (uploadedImagePath) {
        try {
          await deleteProductImageByPath(
            uploadedImagePath,
          );
        } catch (
          cleanupError
        ) {
          console.error(
            "清除未使用的新圖片失敗：",
            cleanupError,
          );
        }
      }

      const message =
        getErrorMessage(
          error,
          "商品儲存失敗。",
        );

      setPageError(message);
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(
    product: Product,
  ) {
    if (
      updatingStatusId !== null
    ) {
      return;
    }

    const nextStatus: ProductStatus =
      product.status === "上架"
        ? "下架"
        : "上架";

    try {
      setUpdatingStatusId(
        product.id,
      );

      setPageError("");

      const updatedProduct =
        await updateProductStatus(
          product.id,
          nextStatus,
        );

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? updatedProduct
            : item,
        ),
      );
    } catch (error) {
      const message =
        getErrorMessage(
          error,
          "更新商品狀態失敗。",
        );

      setPageError(message);
      alert(message);
    } finally {
      setUpdatingStatusId(null);
    }
  }

  async function deleteProduct(
    product: Product,
  ) {
    const confirmed =
      window.confirm(
        `確定要刪除「${product.name}」嗎？`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product.id);
      setPageError("");

      await deleteSupabaseProduct(
        product.id,
      );

      setProducts((current) =>
        current.filter(
          (item) =>
            item.id !== product.id,
        ),
      );

      await safelyDeleteProductImage(
        product.imageUrl,
      );

      if (
        editingId ===
        product.id
      ) {
        resetForm();
      }

      alert("商品已刪除。");
    } catch (error) {
      const message =
        getErrorMessage(
          error,
          "刪除商品失敗。",
        );

      setPageError(message);
      alert(message);
    } finally {
      setDeletingId(null);
    }
  }

  async function logout() {
    const supabase =
      getSupabaseClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    router.replace("/login");
  }

  if (authChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050910] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-black">
            鈦鼎資訊
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            驗證管理員權限並讀取商品資料中...
          </p>
        </div>
      </main>
    );
  }

  if (configurationError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050910] px-5 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-8 text-center">
          <h1 className="text-2xl font-black">
            尚未完成 Supabase 設定
          </h1>

          <p className="mt-4 leading-7 text-yellow-100">
            請確認
            NEXT_PUBLIC_SUPABASE_URL
            與
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
            已正確設定。
          </p>

          <Link
            href="/"
            className="secondary-button mt-6"
          >
            返回網站
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050910] p-4 md:p-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#0b111d] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black">
              鈦鼎資訊・商品後台
            </h1>

            <p className="mt-2 text-slate-400">
              Supabase 雲端商品、圖片、庫存與上下架管理
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="secondary-button gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              返回網站
            </Link>

            <button
              type="button"
              onClick={logout}
              className="secondary-button gap-2"
            >
              <LogOut className="h-4 w-4" />
              登出
            </button>
          </div>
        </header>

        {pageError && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
            {pageError}
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="商品總數"
            value={
              statistics.total
            }
            color="text-blue-400"
          />

          <StatCard
            title="上架商品"
            value={
              statistics.online
            }
            color="text-green-400"
          />

          <StatCard
            title="下架商品"
            value={
              statistics.offline
            }
            color="text-orange-400"
          />

          <StatCard
            title="庫存總數"
            value={
              statistics.stock
            }
            color="text-purple-400"
          />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b111d]">
            <div className="border-b border-white/10 p-6">
              <h2 className="text-xl font-black">
                商品管理
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                商品資料已儲存在 Supabase Database
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-white/[0.04] text-slate-400">
                  <tr>
                    <th className="px-4 py-4">
                      圖片
                    </th>

                    <th className="px-4 py-4">
                      商品名稱
                    </th>

                    <th className="px-4 py-4">
                      分類
                    </th>

                    <th className="px-4 py-4">
                      價格
                    </th>

                    <th className="px-4 py-4">
                      庫存
                    </th>

                    <th className="px-4 py-4">
                      狀態
                    </th>

                    <th className="px-4 py-4">
                      操作
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map(
                    (product) => (
                      <tr
                        key={
                          product.id
                        }
                        className="border-t border-white/10"
                      >
                        <td className="px-4 py-4">
                          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/30">
                            {product.imageUrl ? (
                              <img
                                src={
                                  product.imageUrl
                                }
                                alt={
                                  product.name
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-500">
                                無圖片
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="font-bold">
                            {
                              product.name
                            }
                          </div>

                          <div className="mt-1 max-w-xs truncate text-xs text-slate-500">
                            {product.description.join(
                              " / ",
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-4 text-slate-300">
                          {
                            product.category
                          }
                        </td>

                        <td className="px-4 py-4 font-bold">
                          NT$
                          {formatPrice(
                            product.price,
                          )}
                        </td>

                        <td className="px-4 py-4">
                          {
                            product.stock
                          }
                        </td>

                        <td className="px-4 py-4">
                          <button
                            type="button"
                            disabled={
                              updatingStatusId ===
                              product.id
                            }
                            onClick={() =>
                              toggleStatus(
                                product,
                              )
                            }
                            className={
                              product.status ===
                              "上架"
                                ? "rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-400 transition hover:bg-green-500/25 disabled:opacity-50"
                                : "rounded-full bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-400 transition hover:bg-orange-500/25 disabled:opacity-50"
                            }
                          >
                            {updatingStatusId ===
                            product.id
                              ? "更新中..."
                              : product.status}
                          </button>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                startEdit(
                                  product,
                                )
                              }
                              className="rounded-lg bg-blue-500/10 p-2 text-blue-400 transition hover:bg-blue-500/20"
                              title="編輯商品"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                product.id
                              }
                              onClick={() =>
                                deleteProduct(
                                  product,
                                )
                              }
                              className="rounded-lg bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                              title="刪除商品"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}

                  {products.length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-10 text-center text-slate-500"
                      >
                        Supabase
                        目前尚未建立任何商品
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-[#0b111d] p-6">
            <div className="mb-6 flex items-center gap-3">
              {editingId ===
              null ? (
                <Plus className="text-blue-400" />
              ) : (
                <Pencil className="text-blue-400" />
              )}

              <div>
                <h2 className="text-xl font-black">
                  {editingId ===
                  null
                    ? "新增商品"
                    : "編輯商品"}
                </h2>

                {editingId !==
                  null && (
                  <p className="mt-1 text-xs text-slate-500">
                    修改完成後請按「儲存修改」
                  </p>
                )}
              </div>
            </div>

            <form
              onSubmit={
                saveProduct
              }
              className="space-y-5"
            >
              <FormField label="商品名稱">
                <input
                  value={
                    form.name
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm({
                      ...form,
                      name:
                        event
                          .target
                          .value,
                    })
                  }
                  className="admin-input"
                  placeholder="例如：客製電競主機"
                />
              </FormField>

              <FormField label="商品分類">
                <select
                  value={
                    form.category
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm({
                      ...form,
                      category:
                        event
                          .target
                          .value,
                    })
                  }
                  className="admin-input"
                >
                  <option>
                    電腦主機
                  </option>

                  <option>
                    筆記型電腦
                  </option>

                  <option>
                    零組件
                  </option>

                  <option>
                    周邊配件
                  </option>

                  <option>
                    二手商品
                  </option>
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="售價">
                  <input
                    type="number"
                    min="0"
                    value={
                      form.price
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm({
                        ...form,
                        price:
                          event
                            .target
                            .value,
                      })
                    }
                    className="admin-input"
                  />
                </FormField>

                <FormField label="庫存">
                  <input
                    type="number"
                    min="0"
                    value={
                      form.stock
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm({
                        ...form,
                        stock:
                          event
                            .target
                            .value,
                      })
                    }
                    className="admin-input"
                  />
                </FormField>
              </div>

              <FormField label="上下架狀態">
                <select
                  value={
                    form.status
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm({
                      ...form,
                      status:
                        event
                          .target
                          .value as ProductStatus,
                    })
                  }
                  className="admin-input"
                >
                  <option value="上架">
                    上架
                  </option>

                  <option value="下架">
                    下架
                  </option>
                </select>
              </FormField>

              <FormField label="商品圖片">
                <label
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-5 text-center text-sm transition ${
                    compressing
                      ? "cursor-wait border-blue-500/40 bg-blue-500/10 text-blue-300"
                      : "border-white/20 bg-white/[0.03] text-slate-300 hover:border-blue-500/40 hover:bg-white/[0.06]"
                  }`}
                >
                  <ImagePlus className="h-7 w-7" />

                  <span className="font-semibold">
                    {compressing
                      ? "圖片壓縮中..."
                      : "選擇商品圖片"}
                  </span>

                  <span className="text-xs text-slate-500">
                    自動轉成
                    WebP・最大
                    1600 × 1600
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    disabled={
                      compressing ||
                      saving
                    }
                    className="hidden"
                  />
                </label>
              </FormField>

              {imageInfo && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-sm leading-6 text-green-300">
                  ✓ {imageInfo}
                </div>
              )}

              {imageError && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm leading-6 text-red-300">
                  {imageError}
                </div>
              )}

              {form.imageUrl && (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <span className="text-xs text-slate-400">
                      圖片預覽
                    </span>

                    <button
                      type="button"
                      onClick={
                        removeImage
                      }
                      className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                      移除圖片
                    </button>
                  </div>

                  <img
                    src={
                      form.imageUrl
                    }
                    alt="商品圖片預覽"
                    className="h-56 w-full object-contain"
                  />
                </div>
              )}

              <FormField label="商品說明">
                <textarea
                  rows={7}
                  value={
                    form.description
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm({
                      ...form,
                      description:
                        event
                          .target
                          .value,
                    })
                  }
                  className="admin-input resize-none"
                  placeholder={`每行輸入一個規格

例如：
Intel Core i5
16GB RAM
512GB SSD
一年保固`}
                />
              </FormField>

              <button
                type="submit"
                disabled={
                  compressing ||
                  saving
                }
                className="primary-button w-full gap-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingId ===
                null ? (
                  <Plus className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {saving
                  ? "儲存中..."
                  : editingId ===
                      null
                    ? "新增商品"
                    : "儲存修改"}
              </button>

              {editingId !==
                null && (
                <button
                  type="button"
                  onClick={
                    cancelEdit
                  }
                  disabled={
                    saving
                  }
                  className="secondary-button w-full gap-2 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                  取消編輯
                </button>
              )}
            </form>

            <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/5 p-4 text-xs leading-6 text-green-200">
              商品資料由
              Supabase Database
              管理，圖片自動壓縮成
              WebP 後上傳至
              Supabase Storage。
              後台操作權限僅開放給
              admin 角色。
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border: 1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );
          border-radius: 0.75rem;
          background: rgba(
            255,
            255,
            255,
            0.04
          );
          padding: 0.8rem
            0.9rem;
          color: white;
          outline: none;
          transition: 0.2s ease;
        }

        .admin-input:focus {
          border-color: #3b82f6;
          box-shadow:
            0 0 0 3px
            rgba(
              59,
              130,
              246,
              0.12
            );
        }

        .admin-input option {
          background: #0b111d;
        }

        .admin-input::placeholder {
          color: #64748b;
        }
      `}</style>
    </main>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b111d] p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">
            {title}
          </p>

          <p
            className={`mt-2 text-4xl font-black ${color}`}
          >
            {value}
          </p>
        </div>

        <Boxes className="h-8 w-8 text-slate-600" />
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-400">
        {label}
      </span>

      {children}
    </label>
  );
}