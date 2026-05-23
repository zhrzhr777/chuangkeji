"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function ToolLikeButton({
  toolId,
  initialLikes,
}: {
  toolId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLike = async () => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (liked) {
        await supabase
          .from("tool_likes")
          .delete()
          .eq("tool_id", toolId)
          .eq("user_id", user.id);
        setLikes((prev) => prev - 1);
        setLiked(false);
      } else {
        const { error } = await supabase
          .from("tool_likes")
          .insert({ tool_id: toolId, user_id: user.id });

        if (error) throw error;

        setLikes((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "操作失败",
        description: error.message || "请重试",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={handleLike}
      disabled={loading}
      className="gap-2"
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
      {likes}
    </Button>
  );
}
