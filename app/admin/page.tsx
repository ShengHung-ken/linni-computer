"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Boxes,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  loadProducts,
  Product,
  ProductStatus,
  saveProducts,
} from "@/lib/products";

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("zh-TW").format(
    price,
  );
}

export default function AdminPage() {
  const [products, setProducts] = useState<
    Product[]
  >([]);

  const [form, setForm] =
    useState<ProductForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  useEffect(() => {
    setProducts(loadProducts());
  }, []);

  function updateProducts(
    nextProducts: Product[],
  ) {
    setProducts(nextProducts);
    saveProducts(nextProducts);
  }

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
      imageUrl: product.imageUrl ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function saveProduct(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert("請輸入商品名稱");
      return;
    }

    if (!form.price) {
      alert("請輸入商品價格");
      return;
    }

    const productData = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      status: form.status,
      description: form.description
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      imageUrl:
        form.imageUrl.trim() || undefined,
    };

    if (editingId !== null) {
      const nextProducts = products.map(
        (product) =>
          product.id === editingId
            ? {
                ...product,
                ...productData,
              }
            : product,
      );

      updateProducts(nextProducts);

      alert("商品修改完成");
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...productData,
      };

      updateProducts([
        newProduct,
        ...products,
      ]);

      alert("商品新增完成");
    }

    cancelEdit();
  }

  function toggleStatus(product: Product) {
    const nextProducts = products.map(
      (item) =>
        item.id === product.id
          ? {
              ...item,
              status:
                item.status === "上架"
                  ? ("下架" as ProductStatus)
                  : ("上架" as ProductStatus),
            }
          : item,
    );

    updateProducts(nextProducts);
  }

  function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `確定要刪除「${product.name}」嗎？`,
    );

    if (!confirmed) {
      return;
    }

    const nextProducts = products.filter(
      (item) => item.id !== product.id,
    );

    updateProducts(nextProducts);

    if (editingId === product.id) {
      cancelEdit();
    }
  }

  return (
    <main className="min-h-screen bg-[#050910] p-4 md:p-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#0b111d] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black">
              錸鈮電腦・商品後台
            </h1>

            <p className="mt-2 text-slate-400">
              新增、編輯、刪除、上下架、庫存及價格管理
            </p>
          </div>

          <Link
            href="/"
            className="secondary-button gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回網站
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="商品總數"
            value={statistics.total}
            color="text-blue-400"
          />

          <StatCard
            title="上架商品"
            value={statistics.online}
            color="text-green-400"
          />

          <StatCard
            title="下架商品"
            value={statistics.offline}
            color="text-orange-400"
          />

          <StatCard
            title="庫存總數"
            value={statistics.stock}
            color="text-purple-400"
          />
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0b111d]">
            <div className="border-b border-white/10 p-6">
              <h2 className="text-xl font-black">
                商品管理
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-white/[0.04] text-slate-400">
                  <tr>
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
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-t border-white/10"
                    >
                      <td className="px-4 py-4">
                        <div className="font-bold">
                          {product.name}
                        </div>

                        <div className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {product.description.join(
                            " / ",
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {product.category}
                      </td>

                      <td className="px-4 py-4 font-bold">
                        NT$
                        {formatPrice(
                          product.price,
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {product.stock}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          onClick={() =>
                            toggleStatus(
                              product,
                            )
                          }
                          className={
                            product.status ===
                            "上架"
                              ? "rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-400"
                              : "rounded-full bg-orange-500/15 px-3 py-1 text-xs font-bold text-orange-400"
                          }
                        >
                          {product.status}
                        </button>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              startEdit(
                                product,
                              )
                            }
                            className="rounded-lg bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20"
                            title="編輯商品"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              deleteProduct(
                                product,
                              )
                            }
                            className="rounded-lg bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                            title="刪除商品"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-10 text-center text-slate-500"
                      >
                        尚未建立商品
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/10 bg-[#0b111d] p-6">
            <div className="mb-6 flex items-center gap-3">
              {editingId === null ? (
                <Plus className="text-blue-400" />
              ) : (
                <Pencil className="text-blue-400" />
              )}

              <h2 className="text-xl font-black">
                {editingId === null
                  ? "新增商品"
                  : "編輯商品"}
              </h2>
            </div>

            <form
              onSubmit={saveProduct}
              className="space-y-5"
            >
              <FormField label="商品名稱">
                <input
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name:
                        event.target.value,
                    })
                  }
                  className="admin-input"
                  placeholder="例如：客製電競主機"
                />
              </FormField>

              <FormField label="商品分類">
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      category:
                        event.target.value,
                    })
                  }
                  className="admin-input"
                >
                  <option>電腦主機</option>
                  <option>筆記型電腦</option>
                  <option>零組件</option>
                  <option>周邊配件</option>
                  <option>二手商品</option>
                </select>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="售價">
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        price:
                          event.target.value,
                      })
                    }
                    className="admin-input"
                  />
                </FormField>

                <FormField label="庫存">
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        stock:
                          event.target.value,
                      })
                    }
                    className="admin-input"
                  />
                </FormField>
              </div>

              <FormField label="上下架狀態">
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status:
                        event.target
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

              <FormField label="商品圖片網址">
                <input
                  value={form.imageUrl}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      imageUrl:
                        event.target.value,
                    })
                  }
                  className="admin-input"
                  placeholder="https://..."
                />
              </FormField>

              {form.imageUrl && (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <img
                    src={form.imageUrl}
                    alt="商品預覽"
                    className="h-48 w-full object-contain"
                  />
                </div>
              )}

              <FormField label="商品說明">
                <textarea
                  rows={7}
                  value={
                    form.description
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description:
                        event.target.value,
                    })
                  }
                  className="admin-input resize-none"
                  placeholder={`每行一個規格
Intel Core i5
16GB RAM
512GB SSD`}
                />
              </FormField>

              <button
                type="submit"
                className="primary-button w-full gap-2"
              >
                {editingId === null ? (
                  <Plus className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {editingId === null
                  ? "新增商品"
                  : "儲存修改"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="secondary-button w-full gap-2"
                >
                  <X className="h-4 w-4" />
                  取消編輯
                </button>
              )}
            </form>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          background: rgba(
            255,
            255,
            255,
            0.04
          );
          padding: 0.8rem 0.9rem;
          color: white;
          outline: none;
        }

        .admin-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px
            rgba(59, 130, 246, 0.12);
        }

        .admin-input option {
          background: #0b111d;
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