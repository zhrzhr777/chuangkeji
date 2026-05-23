"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function ReplySection({ topicId }: { topicId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!content.trim()) return;

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from("replies").insert({
        topic_id: topicId,
        content: content.trim(),
        author_id: user.id,
      });

      if (error) throw error;

      toast({ title: "回复成功" });
      setContent("");
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "回复失败",
        description: error.message || "请重试",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleReply} className="space-y-3">
      <h3 className="font-medium text-sm">发表回复</h3>
      <Textarea
        placeholder={user ? "写下你的回复..." : "登录后即可回复"}
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={!user}
      />
      <div className="flex justify-end">
        {user ? (
          <Button type="submit" disabled={loading || !content.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            回复
          </Button>
        ) : (
          <Button type="button" onClick={() => router.push("/login")}>
            登录后回复
          </Button>
        )}
      </div>
    </form>
  );
}
