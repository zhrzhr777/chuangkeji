import Link from "next/link";
import { Wrench } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Wrench className="h-5 w-5" />
              </div>
              创客集
            </Link>
            <p className="text-sm text-muted-foreground">
              发现好工具，分享好资源，连接创造者。
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-sm">导航</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools" className="hover:text-foreground transition-colors">工具导航</Link></li>
              <li><Link href="/resources" className="hover:text-foreground transition-colors">资源中心</Link></li>
              <li><Link href="/community" className="hover:text-foreground transition-colors">轻社区</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-sm">分类</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools?category=AI工具" className="hover:text-foreground transition-colors">AI工具</Link></li>
              <li><Link href="/tools?category=设计工具" className="hover:text-foreground transition-colors">设计工具</Link></li>
              <li><Link href="/tools?category=开发工具" className="hover:text-foreground transition-colors">开发工具</Link></li>
              <li><Link href="/tools?category=效率工具" className="hover:text-foreground transition-colors">效率工具</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-sm">关于</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span>创客集 &copy; {new Date().getFullYear()}</span></li>
              <li><span>为创作者而生</span></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          Built with Next.js & Supabase. 创客集 - 发现创造的力量。
        </div>
      </div>
    </footer>
  );
}
