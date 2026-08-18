"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Cpu,
  HardDrive,
  Laptop,
  MapPin,
  MessageCircle,
  Monitor,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Wrench,
} from "lucide-react";

import { services } from "@/lib/data";

import {
  loadProducts,
  Product,
} from "@/lib/products";

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

function formatPrice(price: number) {
  return new Intl.NumberFormat("zh-TW").format(
    price,
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<
    Product[]
  >([]);

  useEffect(() => {
    function refreshProducts() {
      const currentProducts =
        loadProducts().filter(
          (product: Product) =>
            product.status === "上架",
        );

      setProducts(currentProducts);
    }

    refreshProducts();

    window.addEventListener(
      "linni-products-updated",
      refreshProducts,
    );

    window.addEventListener(
      "storage",
      refreshProducts,
    );

    return () => {
      window.removeEventListener(
        "linni-products-updated",
        refreshProducts,
      );

      window.removeEventListener(
        "storage",
        refreshProducts,
      );
    };
  }, []);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050910]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <Image
              src="/linni-computer/logo.svg"
              alt="錸鈮電腦"
              width={52}
              height={52}
              priority
            />

            <div>
              <div className="text-xl font-black tracking-[0.15em]">
                錸鈮電腦
              </div>

              <div className="text-xs tracking-[0.2em] text-slate-400">
                LINNI COMPUTER
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
              href="/admin"
              className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-blue-300 transition hover:bg-blue-500/20"
            >
              後台管理
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section
        id="home"
        className="tech-background border-b border-white/10"
      >
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              錸鈮電腦・專業電腦服務
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

                <div className="col-span-full flex items-center justify-center rounded-3xl border border-white/10 bg-black/30 px-8 py-10">
                  <Image
                    src="/linni-computer/logo.svg"
                    alt="錸鈮電腦 Logo"
                    width={180}
                    height={180}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
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
            (service, index) => {
              const Icon =
                serviceIcons[index] ?? Wrench;

              return (
                <article
                  key={service.title}
                  className="glass-panel rounded-3xl p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-400/40"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {service.description}
                  </p>
                </article>
              );
            },
          )}
        </div>
      </section>

      {/* Products */}
      <section
        id="products"
        className="bg-slate-100 py-20 text-slate-950"
      >
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold tracking-widest text-blue-600">
                PRODUCTS
              </p>

              <h2 className="mt-2 text-4xl font-black">
                熱門商品
              </h2>
            </div>

            <p className="text-sm text-slate-500">
              商品可由後台新增、修改與上下架
            </p>
          </div>

          {products.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              目前尚無上架商品
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {products.map(
                (product: Product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-slate-700">
                      {product.imageUrl ? (
                        <img
                          src={
                            product.imageUrl
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Cpu className="h-20 w-20 text-blue-300" />
                      )}
                    </div>

                    <div className="p-5">
                      <div className="mb-2 text-xs font-bold text-blue-600">
                        {product.category}
                      </div>

                      <h3 className="min-h-14 text-lg font-black">
                        {product.name}
                      </h3>

                      <ul className="mt-3 min-h-20 space-y-1 text-sm text-slate-500">
                        {product.description.map(
                          (
                            item: string,
                            index: number,
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
                        庫存：{product.stock}
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

      {/* About */}
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
              關於錸鈮電腦
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              錸鈮電腦以專業技術、透明報價與在地服務為核心，
              提供電腦維修、升級、組裝與周邊設備服務。
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              無論是桌上型電腦、筆記型電腦、零組件升級、
              系統問題或設備規劃，都歡迎與我們聯絡。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "專業技術",
              "透明報價",
              "快速維修",
              "售後服務",
            ].map((item: string) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <ShieldCheck className="h-6 w-6 text-green-400" />

                <span className="font-bold">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t border-white/10 py-20"
      >
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-center text-4xl font-black">
            聯絡錸鈮電腦
          </h2>

          <p className="mt-3 text-center text-slate-400">
            維修、組裝、升級及商品問題歡迎洽詢
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-3">
            <a
              href="tel:0932931147"
              className="glass-panel rounded-3xl p-6 text-center transition hover:border-blue-400/40"
            >
              <Phone className="mx-auto h-8 w-8 text-blue-400" />

              <div className="mt-4 font-bold">
                電話
              </div>

              <div className="mt-2 text-slate-400">
                0932-931-147
              </div>
            </a>

            <div className="glass-panel rounded-3xl p-6 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-green-400" />

              <div className="mt-4 font-bold">
                LINE
              </div>

              <div className="mt-2 text-slate-400">
                0932931147
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6 text-center">
              <MapPin className="mx-auto h-8 w-8 text-red-400" />

              <div className="mt-4 font-bold">
                地址
              </div>

              <div className="mt-2 text-slate-400">
                桃園市中壢區龍昌路145號
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile admin shortcut */}
      <div className="fixed bottom-5 right-5 z-40 lg:hidden">
        <Link
          href="/admin"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl"
          aria-label="後台管理"
        >
          <Wrench className="h-6 w-6" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} 錸鈮電腦 LINNI COMPUTER
      </footer>
    </main>
  );
}