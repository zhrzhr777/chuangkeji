import { Wrench, FolderOpen, Users, MousePointerClick } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AnimatedCounter } from "./AnimatedCounter";

export async function StatsBar() {
  const supabase = createClient();
  const [toolsRes, resourcesRes, usersRes] = await Promise.all([
    supabase.from("tools").select("id", { count: "exact", head: true }),
    supabase.from("resources").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const items = [
    { label: "收录工具", value: toolsRes.count || 0, icon: Wrench },
    { label: "资源链接", value: resourcesRes.count || 0, icon: FolderOpen },
    { label: "注册用户", value: usersRes.count || 0, icon: Users },
  ];

  return (
    <section className="border-b bg-muted/30">
      <div className="container py-6">
        <div className="flex justify-center gap-8 sm:gap-16">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-primary" />
              <div>
                <AnimatedCounter target={item.value} className="text-xl sm:text-2xl font-bold" />
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
