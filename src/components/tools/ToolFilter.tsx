"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ToolFilterProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

const POPULAR_TAGS = ["AI", "GPT", "设计", "开发", "开源", "效率", "插件", "免费"];

export function ToolFilter({ selectedTags, onToggleTag, onClearTags }: ToolFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground mr-1">标签:</span>
      {POPULAR_TAGS.map((tag) => (
        <button
          key={tag}
          onClick={() => onToggleTag(tag)}
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
            selectedTags.includes(tag)
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground hover:text-foreground hover:border-foreground/50"
          )}
        >
          {tag}
        </button>
      ))}
      {selectedTags.length > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearTags} className="h-6 px-2 text-xs">
          <X className="h-3 w-3 mr-1" />
          清除
        </Button>
      )}
    </div>
  );
}
