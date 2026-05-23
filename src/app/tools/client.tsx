"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategoryTree } from "@/components/tools/CategoryTree";
import { ToolFilter } from "@/components/tools/ToolFilter";
import { ToolCard } from "@/components/tools/ToolCard";

interface ToolsFilterSectionProps {
  tools: any[];
  initialCategory: string | null;
  initialSearch: string;
}

export function ToolsFilterSection({
  tools,
  initialCategory,
  initialSearch,
}: ToolsFilterSectionProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState(initialSearch);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(window.location.search);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/tools?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.push(`/tools?${params.toString()}`);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => setSelectedTags([]);

  const filteredTools = useMemo(() => {
    let result = tools;

    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory);
    }

    if (searchText) {
      const q = searchText.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((t) =>
        selectedTags.some((tag) => t.tags?.includes(tag))
      );
    }

    return result;
  }, [tools, selectedCategory, searchText, selectedTags]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-56 shrink-0">
        <div className="sticky top-20 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索工具..."
              className="pl-9"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              分类
            </h3>
            <CategoryTree
              selected={selectedCategory}
              onSelect={handleCategoryChange}
            />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <ToolFilter
            selectedTags={selectedTags}
            onToggleTag={toggleTag}
            onClearTags={clearTags}
          />
        </div>

        {filteredTools.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">没有找到匹配的工具</p>
            <p className="text-sm">试试换个关键词或分类筛选</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground mt-4 text-center">
          共 {filteredTools.length} 个工具
        </p>
      </div>
    </div>
  );
}
