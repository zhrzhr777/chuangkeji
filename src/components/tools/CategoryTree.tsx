"use client";

import { cn } from "@/lib/utils";
import { Wrench, Palette, Code, Zap, BookOpen, Folder } from "lucide-react";

const categories = [
  { name: "AI工具", icon: Zap, count: 0 },
  { name: "设计工具", icon: Palette, count: 0 },
  { name: "开发工具", icon: Code, count: 0 },
  { name: "效率工具", icon: Wrench, count: 0 },
  { name: "学习资源", icon: BookOpen, count: 0 },
  { name: "其他", icon: Folder, count: 0 },
];

interface CategoryTreeProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryTree({ selected, onSelect }: CategoryTreeProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors text-left",
          !selected
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )}
      >
        <Folder className="h-4 w-4" />
        全部分类
      </button>
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.name}
            onClick={() => onSelect(cat.name)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors text-left",
              selected === cat.name
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="h-4 w-4" />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
