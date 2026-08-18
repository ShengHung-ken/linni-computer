import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "錸鈮電腦 | 專業電腦維修・組裝升級",
  description:
    "錸鈮電腦提供電腦維修、組裝升級、系統重灌、零組件與電腦周邊服務。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}