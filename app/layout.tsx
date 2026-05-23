import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Home Storage Planner | 装修前收纳评估",
  description: "基于家庭物品与生活方式，量化新房收纳需求，生成柜体建议与风险报告",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={cn("h-full", notoSans.variable)}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
