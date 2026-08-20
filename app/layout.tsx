import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "鈦鼎資訊 | Titanium IT",
  description:
    "鈦鼎資訊提供電腦維修、客製化組裝、硬體升級、系統重灌、零組件與周邊設備服務。",
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