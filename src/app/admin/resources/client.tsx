"use client";

import { useEffect, useState } from "react";
import { Check, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDate, getFileSizeString } from "@/lib/utils";

export function AdminResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => { loadResources(); }, []);

  async function loadResources() {
    const { data } = await supabase
      .from("resources")
      .select("*, profiles(username)")
      .order("created_at", { ascending: false });
    setResources(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("resources").update({ status }).eq("id", id);
    if (error) toast({ variant: "destructive", title: "操作失败", description: error.message });
    else { toast({ title: "状态已更新" }); loadResources(); }
  }

  async function deleteResource(id: string) {
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) toast({ variant: "destructive", title: "删除失败", description: error.message });
    else { toast({ title: "资源已删除" }); loadResources(); }
  }

  if (loading) return <p className="text-muted-foreground">加载中...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">资源管理</h1>
        <p className="text-muted-foreground">共 {resources.length} 个资源</p>
      </div>
      <div className="space-y-3">
        {resources.map((res) => (
          <Card key={res.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{res.title}</span>
                  <Badge variant={res.status === "approved" ? "default" : "secondary"}>
                    {res.status === "approved" ? "已通过" : "待审核"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {res.profiles?.username} · {getFileSizeString(res.file_size)} · ↓{res.download_count} · {formatDate(res.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                {res.status !== "approved" && (
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(res.id, "approved")}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                )}
                {res.status !== "rejected" && (
                  <Button size="sm" variant="ghost" onClick={() => updateStatus(res.id, "rejected")}>
                    <X className="h-4 w-4 text-orange-600" />
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => deleteResource(res.id)}>
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
