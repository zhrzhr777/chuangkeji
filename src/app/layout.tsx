import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "创客集 - 工具导航、资源分享与轻社区",
    template: "%s | 创客集",
  },
  description: "发现好工具，分享好资源，连接创造者。创客集是面向创作者的一站式工具导航、资源分享和轻社区平台。",
  keywords: ["工具导航", "资源分享", "创作者社区", "AI工具", "设计工具", "开发工具"],
  authors: [{ name: "创客集" }],
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
