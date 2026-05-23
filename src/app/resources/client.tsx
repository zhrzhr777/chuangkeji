"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResourceCard } from "@/components/resources/ResourceCard";

type SortOption = "latest" | "downloads" | "points";

interface ResourceListProps {
  initialResources: any[];
}

export function ResourceList({ initialResources }: ResourceListProps) {
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const sorted = useMemo(() => {
    const list = [...initialResources];
    switch (sortBy) {
      case "downloads":
        return list.sort((a, b) => b.download_count - a.download_count);
      case "points":
        return list.sort((a, b) => a.points_required - b.points_required);
      default:
        return list;
    }
  }, [initialResources, sortBy]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Select
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortOption)}
          >
            <SelectTrigger className="w-[160px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">最新发布</SelectItem>
              <SelectItem value="downloads">最多下载</SelectItem>
              <SelectItem value="points">积分从低到高</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button asChild>
          <Link href="/resources/upload">
            <Plus className="h-4 w-4 mr-2" />
            上传资源
          </Link>
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">还没有资源</p>
          <p className="text-sm mb-4">成为第一个分享资源的创作者吧！</p>
          <Button asChild>
            <Link href="/resources/upload">
              <Plus className="h-4 w-4 mr-2" />
              上传资源
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-4 text-center">
        共 {sorted.length} 个资源
      </p>
    </div>
  );
}
