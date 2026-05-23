import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
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
    <html lang="zh-CN" className={`${notoSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-stone-50 font-sans antialiased text-stone-900">
        {children}
      </body>
    </html>
  );
}
