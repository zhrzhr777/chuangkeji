"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/tools?q=${encodeURIComponent(query.trim())}`);
  };

  const quickLinks = ["AI工具", "设计资源", "效率工具", "开源项目", "提示词"];

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-violet-500/5 animate-gradient">
      <div className="container py-20 md:py-28 lg:py-36">
        <div className={`mx-auto max-w-3xl text-center ${mounted ? "animate-fade-in-up" : ""}`}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <Sparkles className="h-4 w-4 text-amber-500" />
            AI 时代的创作者工具站
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">创客集</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-xl mx-auto">
            发现好工具 · 分享好资源 · 连接每一位创作者
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex items-center gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="搜索工具、资源、教程..." className="h-12 pl-11 pr-4 text-base shadow-md" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6 shadow-md">搜索</Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((link) => (
              <Button key={link} variant="outline" size="sm" onClick={() => router.push(`/tools?q=${encodeURIComponent(link)}`)} className="rounded-full hover:bg-primary/5">
                {link} <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            ))}
            <Button variant="default" size="sm" onClick={() => router.push("/submit")} className="rounded-full shadow-sm">
              提交工具 <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
    </section>
  );
}
