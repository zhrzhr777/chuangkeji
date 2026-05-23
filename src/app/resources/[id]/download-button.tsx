"use client";

import { useState } from "react";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function DownloadButton({
  resourceId,
  filePath,
  pointsRequired,
  fileType,
}: {
  resourceId: string;
  filePath: string;
  pointsRequired: number;
  fileType: string;
}) {
  const [loading, setLoading] = useState(false);
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const isLink = fileType === "link" || fileType === "text/html";

  const supabase = createClient();

  const handleClick = async () => {
    // 免费资源直接打开
    if (pointsRequired === 0) {
      window.open(filePath, "_blank");
      await supabase.rpc("increment_download_count", { resource_id: resourceId });
      return;
    }

    // 付费资源需要登录
    if (authLoading) return;
    if (!user || !profile) { router.push("/login"); return; }

    setLoading(true);

    try {
      if (profile.points < pointsRequired) {
        toast({ variant: "destructive", title: "积分不足", description: `需要 ${pointsRequired} 积分，你有 ${profile.points} 积分` });
        setLoading(false);
        return;
      }

      await supabase.from("transactions").insert({
        user_id: user.id, amount: -pointsRequired, type: "download",
        description: `下载: ${resourceId}`,
      });
      await supabase.rpc("add_user_points", { uid: user.id, pts: -pointsRequired });
      await supabase.rpc("increment_download_count", { resource_id: resourceId });

      window.open(filePath, "_blank");
      toast({ title: isLink ? "正在跳转" : "开始下载" });
      router.refresh();
    } catch (error: any) {
      toast({ variant: "destructive", title: "操作失败", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handleClick} disabled={loading || authLoading}>
      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : isLink ? <ExternalLink className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
      {pointsRequired > 0 ? `${isLink ? "访问" : "下载"}（${pointsRequired} 积分）` : isLink ? "访问链接" : "免费下载"}
    </Button>
  );
}
