"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { RESOURCE_CATEGORIES } from "@/lib/types";

type SortOption = "latest" | "downloads" | "points";

interface ResourceListProps {
  initialResources: any[];
}

const FILE_COLORS: Record<string, string> = {
  "application/pdf": "bg-red-50 text-red-600",
  "application/zip": "bg-amber-50 text-amber-600",
  "application/json": "bg-green-50 text-green-600",
  "video/mp4": "bg-purple-50 text-purple-600",
  "application/figma": "bg-pink-50 text-pink-600",
};

export function ResourceList({ initialResources }: ResourceListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [category, setCategory] = useState<string>("全部");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...initialResources];
    if (category !== "全部") list = list.filter((r) => r.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
    }
    switch (sortBy) {
      case "downloads":
        return list.sort((a, b) => b.download_count - a.download_count);
      case "points":
        return list.sort((a, b) => a.points_required - b.points_required);
      default:
        return list;
    }
  }, [initialResources, sortBy, category, search]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索资源..."
              className="pl-9 w-[180px] h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部分类</SelectItem>
              {RESOURCE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">最新发布</SelectItem>
              <SelectItem value="downloads">最多下载</SelectItem>
              <SelectItem value="points">积分最少</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button asChild size="sm">
          <Link href="/resources/upload">
            <Plus className="h-4 w-4 mr-1" />
            上传资源
          </Link>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">没有找到匹配的资源</p>
          <p className="text-sm mb-4">试试换个分类或关键词</p>
          {/* ...existing empty state... */}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-4 text-center">
        共 {filtered.length} 个资源
      </p>
    </div>
  );
}
