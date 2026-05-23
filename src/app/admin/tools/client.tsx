"use client";

import { useEffect, useState } from "react";
import { Check, X, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

export function AdminToolsPage() {
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    loadTools();
  }, []);

  async function loadTools() {
    const { data } = await supabase
      .from("tools")
      .select("*, profiles(username)")
      .order("created_at", { ascending: false });
    setTools(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("tools").update({ status }).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "操作失败", description: error.message });
    } else {
      toast({ title: "状态已更新" });
      loadTools();
    }
  }

  async function toggleFeatured(id: string, featured: boolean) {
    const { error } = await supabase
      .from("tools")
      .update({ featured, featured_until: featured ? new Date(Date.now() + 30 * 86400000).toISOString() : null })
      .eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "操作失败", description: error.message });
    } else {
      toast({ title: featured ? "已设为推荐" : "已取消推荐" });
      loadTools();
    }
  }

  async function deleteTool(id: string) {
    const { error } = await supabase.from("tools").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "删除失败", description: error.message });
    } else {
      toast({ title: "工具已删除" });
      loadTools();
    }
  }

  if (loading) return <p className="text-muted-foreground">加载中...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">工具管理</h1>
        <p className="text-muted-foreground">共 {tools.length} 个工具</p>
      </div>

      <div className="space-y-3">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{tool.name}</span>
                  <Badge variant={tool.status === "approved" ? "default" : tool.status === "pending" ? "secondary" : "destructive"}>
                    {tool.status === "approved" ? "已通过" : tool.status === "pending" ? "待审核" : "已拒绝"}
                  </Badge>
                  {tool.featured && <Badge className="bg-amber-100 text-amber-700"><Star className="h-3 w-3 mr-1" />推荐</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {tool.profiles?.username} · {formatDate(tool.created_at)} · ❤ {tool.likes_count}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                {tool.status !== "approved" && (
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(tool.id, "approved")}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                )}
                {tool.status !== "rejected" && (
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(tool.id, "rejected")}>
                    <X className="h-4 w-4 text-orange-600" />
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => toggleFeatured(tool.id, !tool.featured)}>
                  <Star className={`h-4 w-4 ${tool.featured ? "text-amber-500 fill-current" : ""}`} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteTool(tool.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
