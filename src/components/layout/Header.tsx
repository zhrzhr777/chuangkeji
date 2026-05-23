"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Menu,
  LogOut,
  User,
  Plus,
  Wrench,
  FolderOpen,
  MessageSquare,
  Coins,
  Crown,
  TrendingUp,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tools?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { href: "/leaderboard", label: "排行榜", icon: TrendingUp },
    { href: "/tools", label: "工具导航", icon: Wrench },
    { href: "/resources", label: "资源中心", icon: FolderOpen },
    { href: "/community", label: "轻社区", icon: MessageSquare },
    { href: "/vip", label: "VIP", icon: Crown },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">创客集</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search (desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center gap-2 flex-1 max-w-sm mx-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜索工具、资源..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right section */}
        <div className="flex items-center gap-1">
          <ThemeToggle />

          {/* Submit tool button (desktop) */}
          <Button
            variant="default"
            size="sm"
            className="hidden md:flex gap-1.5"
            onClick={() => router.push("/submit")}
          >
            <Plus className="h-4 w-4" />
            提交工具
          </Button>

          {/* Upload button (desktop) */}
          {user && (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex gap-1.5"
              onClick={() => router.push("/resources/upload")}
            >
              <Plus className="h-4 w-4" />
              上传资源
            </Button>
          )}

          {/* User menu / Login */}
          {user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {profile.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <span>{profile.username}</span>
                    <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {profile.points} 积分
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/user")}>
                  <User className="h-4 w-4 mr-2" />
                  用户中心
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/resources/upload")}>
                  <Plus className="h-4 w-4 mr-2" />
                  上传资源
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/vip")}>
                  <Crown className="h-4 w-4 mr-2" />
                  升级 VIP
                </DropdownMenuItem>
                {profile.role === "admin" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <User className="h-4 w-4 mr-2" />
                    后台管理
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                登录
              </Button>
              <Button size="sm" onClick={() => router.push("/register")}>
                注册
              </Button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader className="mb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  创客集
                </SheetTitle>
              </SheetHeader>

              {/* Mobile search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="搜索工具、资源..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              {/* Mobile nav links */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}

                <div className="my-2 border-t" />

                {user && profile ? (
                  <>
                    <Link
                      href="/user"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent"
                    >
                      <User className="h-4 w-4" />
                      用户中心
                      <Badge variant="secondary" className="ml-auto">
                        {profile.points} 积分
                      </Badge>
                    </Link>
                    <Link
                      href="/resources/upload"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent"
                    >
                      <Plus className="h-4 w-4" />
                      上传资源
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-accent text-destructive w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      退出登录
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 px-3 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push("/login");
                        setMobileMenuOpen(false);
                      }}
                    >
                      登录
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        router.push("/register");
                        setMobileMenuOpen(false);
                      }}
                    >
                      注册
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
