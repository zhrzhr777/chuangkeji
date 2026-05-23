import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Wrench, FolderOpen, Users, Megaphone, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: { default: "后台管理", template: "%s | 后台 - 创客集" },
};

const navItems = [
  { href: "/admin", label: "仪表盘", icon: LayoutDashboard },
  { href: "/admin/tools", label: "工具管理", icon: Wrench },
  { href: "/admin/resources", label: "资源管理", icon: FolderOpen },
  { href: "/admin/users", label: "用户管理", icon: Users },
  { href: "/admin/ads", label: "广告管理", icon: Megaphone },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r bg-muted/30 shrink-0">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm text-muted-foreground">后台管理</h2>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-2 border-t">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回前台
          </Link>
        </div>
      </aside>

      {/* Mobile nav bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
        <div className="flex overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-4 py-2 text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 p-6 pb-20 md:pb-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
