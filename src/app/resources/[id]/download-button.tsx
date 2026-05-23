"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function DownloadButton({
  resourceId,
  filePath,
  pointsRequired,
}: {
  resourceId: string;
  filePath: string;
  pointsRequired: number;
}) {
  const [loading, setLoading] = useState(false);
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleDownload = async () => {
    if (authLoading) return;
    if (!user || !profile) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (pointsRequired > 0) {
        if (profile.points < pointsRequired) {
          toast({
            variant: "destructive",
            title: "积分不足",
            description: `需要 ${pointsRequired} 积分，你当前有 ${profile.points} 积分`,
          });
          setLoading(false);
          return;
        }

        // Deduct points
        await supabase.from("transactions").insert({
          user_id: user.id,
          amount: -pointsRequired,
          type: "download",
          description: `下载资源: ${resourceId}`,
        });
        await supabase.rpc("add_user_points", { uid: user.id, pts: -pointsRequired });
      }

      // Increment download count
      await supabase.rpc("increment_download_count", {
        resource_id: resourceId,
      });

      // Open download
      window.open(filePath, "_blank");
      toast({ title: "开始下载", description: "感谢你的下载！" });
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "下载失败",
        description: error.message || "请重试",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handleDownload} disabled={loading}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          处理中...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          {pointsRequired > 0 ? `使用 ${pointsRequired} 积分下载` : "免费下载"}
        </>
      )}
    </Button>
  );
}
