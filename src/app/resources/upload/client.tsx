"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { RESOURCE_CATEGORIES } from "@/lib/types";

export function UploadForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [url, setUrl] = useState("");
  const [pointsRequired, setPointsRequired] = useState("0");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) { toast({ variant: "destructive", title: "请先登录" }); router.push("/login"); return; }
    if (!title.trim() || !url.trim()) { toast({ variant: "destructive", title: "名称和链接必填" }); return; }

    setUploading(true);

    try {
      const { error } = await supabase.from("resources").insert({
        title: title.trim(),
        description: description.trim(),
        category: category || "其他",
        file_path: url.trim(),
        file_size: 0,
        file_type: "link",
        points_required: parseInt(pointsRequired) || 0,
        creator_id: user.id,
      });

      if (error) throw error;

      await supabase.from("transactions").insert({
        user_id: user.id, amount: 10, type: "upload_reward",
        description: "分享资源奖励",
      });
      await supabase.rpc("add_user_points", { uid: user.id, pts: 10 });

      toast({ title: "分享成功", description: "资源已发布，+10 积分！" });
      router.push("/resources");
      router.refresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "发布失败", description: error.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>分享资源链接</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>资源名称 *</Label>
              <Input placeholder="例: Python 入门教程" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>分类</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
                <SelectContent>{RESOURCE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>链接 *</Label>
            <Input type="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>简介</Label>
            <Textarea placeholder="简单描述一下..." rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>所需积分（0=免费）</Label>
            <Input type="number" min="0" placeholder="0" value={pointsRequired} onChange={(e) => setPointsRequired(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Link2 className="h-4 w-4 mr-2" />}
            发布资源
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
