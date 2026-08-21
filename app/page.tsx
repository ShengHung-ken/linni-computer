"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

import {
  Cpu,
  HardDrive,
  Laptop,
  Mail,
  MessageCircle,
  Monitor,
  ShieldCheck,
  ShoppingCart,
  Wrench,
} from "lucide-react";

import {
  services,
} from "@/lib/data";

import type {
  Product,
} from "@/lib/products";

import {
  fetchPublicProducts,
} from "@/lib/supabase-products";

const serviceIcons = [
  Laptop,
  Cpu,
  HardDrive,
  ShoppingCart,
  ShieldCheck,
  Wrench,
  Monitor,
  Cpu,
];

function formatPrice(
  price: number,
): string {
  return new Intl.NumberFormat(
    "zh-TW",
  ).format(price);
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

export default function HomePage() {
  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    productsLoading,
    setProductsLoading,
  ] = useState(true);

  const [
    productsError,
    setProductsError,
  ] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setProductsLoading(true);
        setProductsError("");

        const currentProducts =
          await fetchPublicProducts();

        setProducts(
          currentProducts,
        );
      } catch (error) {
        console.error(
          "讀取商品失敗：",
          error,
        );

        setProductsError(
          getErrorMessage(
            error,
            "目前無法讀取商品資料。",
          ),
        );
      } finally {
        setProductsLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050910]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-14 w-20 items-center justify-center overflow-hidden rounded-xl bg-black/30">
              <Image
                src="/titanium-it/logo-titanium.png"
                alt="鈦鼎資訊"
                width={80}
                height={55}
                priority
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <div className="text-xl font-black tracking-[0.15em]">
                鈦鼎資訊
              </div>

              <div className="text-xs tracking-[0.2em] text-slate-400">
                TITANIUM IT
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
            <a
              href="#home"
              className="hover:text-white"
            >
              首頁
            </a>

            <a
              href="#products"
              className="hover:text-white"
            >
              商品專區
            </a>

            <a
              href="#services"
              className="hover:text-white"
            >
              服務項目
            </a>

            <a
              href="#about"
              className="hover:text-white"
            >
              關於我們
            </a>

            <a
              href="#contact"
              className="hover:text-white"
            >
              聯絡我們
            </a>

            <Link
              href="/login"
              className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-blue-300 transition hover:bg-blue-500/20"
            >
              後台登入
            </Link>
          </nav>
        </div>
      </header>

      <section
        id="home"
        className="tech-background border-b border-white/10"
      >
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              鈦鼎資訊・專業電腦服務
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              專業維修

              <span className="text-blue-400">
                {" "}
                ×{" "}
              </span>

              組裝升級
            </h1>

            <p className="mt-5 text-xl tracking-wider text-slate-300">
              快速・專業・誠信・在地服務
            </p>

            <p className="mt-6 max-w-xl leading-8 text-slate-400">
              提供桌機、筆電維修、客製化電腦組裝、
              系統重灌、零組件升級、監控設備與到府服務。
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#products"
                className="primary-button"
              >
                瀏覽商品
              </a>

              <a
                href="#contact"
                className="secondary-button"
              >
                聯絡我們
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-8 shadow-2xl">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex min-h-48 flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/20 to-transparent p-6">
                  <Monitor className="h-14 w-14 text-blue-300" />

                  <div>
                    <div className="text-2xl font-black">
                      客製電競主機
                    </div>

                    <div className="mt-2 text-sm text-slate-400">
                      依照預算與需求搭配
                    </div>
                  </div>
                </div>

                <div className="flex min-h-48 flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 to-transparent p-6">
                  <Laptop className="h-14 w-14 text-purple-300" />

                  <div>
                    <div className="text-2xl font-black">
                      筆電維修
                    </div>

                    <div className="mt-2 text-sm text-slate-400">
                      快速檢測・專業維修
                    </div>
                  </div>
                </div>

                <div className="col-span-full flex min-h-[280px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/30 p-4">
                  <Image
                    src="/titanium-it/logo-titanium.png"
                    alt="鈦鼎資訊 Titanium IT"
                    width={800}
                    height={450}
                    className="h-auto max-h-[300px] w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="mx-auto max-w-7xl px-5 py-20"
      >
        <div className="mb-10">
          <p className="text-sm font-bold tracking-widest text-blue-400">
            SERVICES
          </p>

          <h2 className="mt-2 text-4xl font-black">
            專業服務
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map(
            (
              service,
              index,
            ) => {
              const Icon =
                serviceIcons[
                  index
                ] ?? Wrench;

              return (
                <article
                  key={
                    service.title
                  }
                  className="glass-panel rounded-3xl p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-400/40"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold">
                    {
                      service.title
                    }
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {
                      service.description
                    }
                  </p>
                </article>
              );
            },
          )}
        </div>
      </section>

      <section
        id="products"
        className="bg-slate-100 py-20 text-slate-950"
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10">
            <p className="text-sm font-bold tracking-widest text-blue-600">
              PRODUCTS
            </p>

            <h2 className="mt-2 text-4xl font-black">
              熱門商品
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              商品內容由鈦鼎資訊後台即時管理
            </p>
          </div>

          {productsLoading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
              <div className="text-lg font-bold text-slate-700">
                商品讀取中...
              </div>

              <p className="mt-2 text-sm text-slate-400">
                正在連線至商品資料庫
              </p>
            </div>
          )}

          {!productsLoading &&
            productsError && (
              <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
                <div className="font-bold text-red-700">
                  商品資料暫時無法讀取
                </div>

                <p className="mt-2 text-sm text-red-500">
                  {productsError}
                </p>
              </div>
            )}

          {!productsLoading &&
            !productsError &&
            products.length ===
              0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                目前尚無上架商品
              </div>
            )}

          {!productsLoading &&
            !productsError &&
            products.length >
              0 && (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {products.map(
                  (product) => (
                    <article
                      key={
                        product.id
                      }
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700">
                        {product.imageUrl ? (
                          <img
                            src={
                              product.imageUrl
                            }
                            alt={
                              product.name
                            }
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Cpu className="h-20 w-20 text-blue-300" />
                        )}
                      </div>

                      <div className="p-5">
                        <div className="mb-2 text-xs font-bold text-blue-600">
                          {
                            product.category
                          }
                        </div>

                        <h3 className="min-h-14 text-lg font-black">
                          {
                            product.name
                          }
                        </h3>

                        <ul className="mt-3 min-h-20 space-y-1 text-sm text-slate-500">
                          {product.description.map(
                            (
                              item,
                              index,
                            ) => (
                              <li
                                key={`${product.id}-${index}`}
                              >
                                • {item}
                              </li>
                            ),
                          )}
                        </ul>

                        <div className="mt-4 text-sm text-slate-400">
                          庫存：
                          {
                            product.stock
                          }
                        </div>

                        <div className="mt-2 text-2xl font-black text-red-600">
                          NT$
                          {formatPrice(
                            product.price,
                          )}
                        </div>

                        <a
                          href="#contact"
                          className="mt-4 block w-full rounded-xl bg-slate-950 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-600"
                        >
                          詢問商品
                        </a>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
        </div>
      </section>

      <section
        id="about"
        className="mx-auto max-w-7xl px-5 py-20"
      >
        <div className="glass-panel grid gap-10 rounded-[2rem] p-7 md:p-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold tracking-widest text-blue-400">
              ABOUT US
            </p>

            <h2 className="mt-3 text-4xl font-black">
              關於鈦鼎資訊
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              鈦鼎資訊以專業技術、透明報價與在地服務為核心，
              提供電腦維修、升級、組裝與周邊設備服務。
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              無論是桌上型電腦、筆記型電腦、
              零組件升級、系統問題或設備規劃，
              都歡迎與我們聯絡。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "專業技術",
              "透明報價",
              "快速維修",
              "售後服務",
            ].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <ShieldCheck className="h-6 w-6 text-green-400" />

                  <span className="font-bold">
                    {item}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="border-t border-white/10 py-20"
      >
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-center text-4xl font-black">
            聯絡鈦鼎資訊
          </h2>

          <p className="mt-3 text-center text-slate-400">
            維修、組裝、升級及商品問題歡迎洽詢
          </p>

          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            <div className="glass-panel rounded-3xl p-6 text-center">
              <MessageCircle className="mx-auto h-9 w-9 text-green-400" />

              <h3 className="mt-4 text-xl font-black">
                LINE 官方帳號
              </h3>

              <div className="mx-auto mt-5 max-w-[220px] overflow-hidden rounded-2xl bg-white p-3">
                <img
                  src="https://qr-official.line.me/gs/M_068wtdkw_GW.png?oat_content=qr"
                  alt="鈦鼎資訊 LINE 官方帳號 QR Code"
                  className="h-auto w-full"
                />
              </div>

              <p className="mt-4 text-sm text-slate-400">
                掃描 QR Code 加入 LINE 官方帳號
              </p>
            </div>

            <a
              href="mailto:kevin7206160616@gmail.com"
              className="glass-panel rounded-3xl p-6 text-center transition hover:border-blue-400/40"
            >
              <Mail className="mx-auto h-9 w-9 text-blue-400" />

              <h3 className="mt-4 text-xl font-black">
                聯絡 Email
              </h3>

              <p className="mt-2 break-all text-slate-400">
                kevin7206160616@gmail.com
              </p>

              <div className="mt-6 inline-flex rounded-xl bg-blue-500/10 px-5 py-3 text-sm font-semibold text-blue-300">
                寄送 Email
              </div>
            </a>

            <div className="glass-panel rounded-3xl p-6 text-center">
              <Wrench className="mx-auto h-9 w-9 text-purple-400" />

              <h3 className="mt-4 text-xl font-black">
                維修 / 商品諮詢
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                電腦維修、客製化組裝、
                系統升級、零組件及商品相關問題，
                歡迎透過 LINE 或 Email 聯絡。
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-slate-500">
        ©{" "}
        {new Date().getFullYear()}{" "}
        鈦鼎資訊 TITANIUM IT
      </footer>
    </main>
  );
}