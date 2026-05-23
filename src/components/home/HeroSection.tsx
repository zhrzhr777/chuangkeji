"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tools?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const quickLinks = ["AI工具", "设计资源", "效率工具", "开源项目"];

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            发现创造的力量
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            创客集
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            发现好工具，分享好资源，连接每一位创作者
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-8 flex items-center gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索工具、资源、话题..."
                className="h-12 pl-11 pr-4 text-base shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-6">
              搜索
            </Button>
          </form>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {quickLinks.map((link) => (
              <Button
                key={link}
                variant="outline"
                size="sm"
                onClick={() => router.push(`/tools?q=${encodeURIComponent(link)}`)}
                className="rounded-full"
              >
                {link}
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
    </section>
  );
}
