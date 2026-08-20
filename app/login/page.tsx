import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050910] px-5">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0b111d] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 overflow-hidden rounded-2xl bg-black/30">
          <Image
            src="/titanium-it/logo-titanium.png"
            alt="鈦鼎資訊"
            width={600}
            height={340}
            className="h-auto w-full object-contain"
          />
        </div>

        <h1 className="text-3xl font-black">
          鈦鼎資訊
        </h1>

        <p className="mt-2 tracking-[0.2em] text-slate-400">
          TITANIUM IT
        </p>

        <p className="mt-6 text-sm leading-7 text-slate-500">
          後台登入功能將於資料庫串接後正式啟用。
        </p>

        <Link
          href="/admin"
          className="primary-button mt-8 w-full"
        >
          進入目前測試後台
        </Link>

        <Link
          href="/"
          className="secondary-button mt-3 w-full"
        >
          返回網站
        </Link>
      </div>
    </main>
  );
}