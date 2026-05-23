"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { TOOL_CATEGORIES } from "@/lib/types";

export function SubmitToolForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();

  const [name, setName] = useState(searchParams.get("title") || "");
  const [url, setUrl] = useState(searchParams.get("url") || "");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [pricing, setPricing] = useState("免费");
  const [loading, setLoading] = useState(false);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const WEEKLY_LIMIT = 3;

  useEffect(() => {
    if (user) checkWeeklyLimit();
  }, [user]);

  async function checkWeeklyLimit() {
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const { count } = await supabase
      .from("submission_logs")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id)
      .gte("submitted_at", weekAgo);
    setWeeklyCount(count || 0);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast({ variant: "destructive", title: "请先登录" }); router.push("/login"); return; }
    if (weeklyCount >= WEEKLY_LIMIT) { toast({ variant: "destructive", title: `本周已提交 ${WEEKLY_LIMIT} 次，下周再来` }); return; }
    if (!name.trim() || !url.trim()) { toast({ variant: "destructive", title: "名称和网址必填" }); return; }

    setLoading(true);
    try {
      const { data: tool, error } = await supabase.from("tools").insert({
        name: name.trim(),
        url: url.trim(),
        description: description.trim(),
        category: category || "其他",
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        pricing,
        creator_id: user.id,
        status: "approved",
        is_active: true,
      }).select("id").single();

      if (error) throw error;

      // 记录提交
      await supabase.from("submission_logs").insert({ user_id: user.id, tool_id: tool.id });

      toast({ title: "提交成功！", description: "工具已上架" });
      router.push(`/tools/${tool.id}`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "提交失败", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>工具信息</CardTitle>
            <span className={`text-xs ${weeklyCount >= WEEKLY_LIMIT ? "text-destructive" : "text-muted-foreground"}`}>
              本周已提交 {weeklyCount}/{WEEKLY_LIMIT}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">工具名称 *</Label>
              <Input id="name" placeholder="例: ChatGPT" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="url">网址 *</Label>
              <Input id="url" type="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="desc">描述</Label>
            <Textarea id="desc" placeholder="简单介绍一下这个工具..." rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>分类</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="选择" /></SelectTrigger>
                <SelectContent>{TOOL_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>价格</Label>
              <Select value={pricing} onValueChange={setPricing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="免费">免费</SelectItem>
                  <SelectItem value="付费">付费</SelectItem>
                  <SelectItem value="免费增值">免费增值</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tags">标签</Label>
              <Input id="tags" placeholder="AI,设计,开源" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading || weeklyCount >= WEEKLY_LIMIT}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            提交工具
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
