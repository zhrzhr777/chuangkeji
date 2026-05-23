"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

const POSITIONS = [
  { value: "header", label: "顶部横幅" },
  { value: "sidebar", label: "侧边栏" },
  { value: "between", label: "内容区" },
  { value: "footer", label: "底部" },
];

export function AdminAdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [position, setPosition] = useState("sidebar");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => { loadAds(); }, []);

  async function loadAds() {
    const { data } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
    setAds(data || []);
    setLoading(false);
  }

  async function createAd() {
    if (!title.trim()) return;
    const { error } = await supabase.from("ads").insert({ title, image_url: imageUrl || null, link_url: linkUrl || null, position });
    if (error) toast({ variant: "destructive", title: "创建失败", description: error.message });
    else { toast({ title: "广告已创建" }); setTitle(""); setImageUrl(""); setLinkUrl(""); loadAds(); }
  }

  async function toggleAd(id: string, isActive: boolean) {
    await supabase.from("ads").update({ is_active: !isActive }).eq("id", id);
    loadAds();
  }

  async function deleteAd(id: string) {
    await supabase.from("ads").delete().eq("id", id);
    toast({ title: "广告已删除" });
    loadAds();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">广告管理</h1>
        <p className="text-muted-foreground">管理站点广告位</p>
      </div>

      {/* Create ad form */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">新建广告</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>标题</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="广告标题" />
          </div>
          <div className="space-y-1">
            <Label>位置</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{POSITIONS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>图片 URL（可选）</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-1">
            <Label>链接 URL（可选）</Label>
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="md:col-span-2">
            <Button onClick={createAd} disabled={!title.trim()}>
              <Plus className="h-4 w-4 mr-2" />创建广告
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ad list */}
      <div className="space-y-3">
        {ads.map((ad) => (
          <Card key={ad.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{ad.title}</span>
                  <Badge variant={ad.is_active ? "default" : "secondary"}>{ad.is_active ? "投放中" : "已下线"}</Badge>
                  <Badge variant="outline">{POSITIONS.find(p => p.value === ad.position)?.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  点击 {ad.clicks} · {formatDate(ad.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <Button size="sm" variant="ghost" onClick={() => toggleAd(ad.id, ad.is_active)}>
                  {ad.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => deleteAd(ad.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {ads.length === 0 && <p className="text-muted-foreground text-center py-8">暂无广告</p>}
      </div>
    </div>
  );
}
