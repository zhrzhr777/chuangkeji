import Link from "next/link";
import { Wrench, Palette, Code, Zap, BookOpen, Folder } from "lucide-react";

const categories = [
  { name: "AI工具", icon: Zap, href: "/tools?category=AI工具" },
  { name: "设计工具", icon: Palette, href: "/tools?category=设计工具" },
  { name: "开发工具", icon: Code, href: "/tools?category=开发工具" },
  { name: "效率工具", icon: Wrench, href: "/tools?category=效率工具" },
  { name: "学习资源", icon: BookOpen, href: "/tools?category=学习资源" },
  { name: "更多", icon: Folder, href: "/tools" },
];

export function CategoryGrid() {
  return (
    <section className="container py-8 border-t">
      <h2 className="text-lg font-bold mb-4">分类浏览</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border hover:border-primary/50 hover:bg-primary/5 transition-all text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium">{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
