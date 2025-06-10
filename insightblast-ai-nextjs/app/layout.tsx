import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "InsightBlast AI - 多角度思维模型分析工具",
  description: "使用30种思维模型从多个角度分析问题，获得更深入的洞察和解决方案",
  keywords: ["AI分析", "思维模型", "决策分析", "问题解决", "创新思维"],
  authors: [{ name: "InsightBlast AI" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
