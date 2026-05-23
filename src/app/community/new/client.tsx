"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function NewTopicForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ variant: "destructive", title: "请先登录" });
      router.push("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({ variant: "destructive", title: "请填写标题和内容" });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("topics")
        .insert({
          title: title.trim(),
          content: content.trim(),
          author_id: user.id,
        })
        .select("id")
        .single();

      if (error) throw error;

      toast({ title: "发布成功" });
      router.push(`/community/${data.id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "发布失败",
        description: error.message || "请重试",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>话题内容</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">话题标题 *</Label>
            <Input
              id="title"
              placeholder="一句话概括你的话题..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">详细内容 *</Label>
            <Textarea
              id="content"
              placeholder="展开说说你的想法..."
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                发布中...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                发布话题
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
