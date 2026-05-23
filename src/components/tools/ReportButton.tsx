"use client";

import { useState } from "react";
import { Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const REASONS = ["内容已失效", "重复提交", "垃圾广告", "信息不实", "其他"];

export function ReportButton({ toolId }: { toolId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleReport = async () => {
    if (!user) { router.push("/login"); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/tools/${toolId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "举报已提交", description: data.reportCount >= 3 ? "该工具已被自动下架" : "感谢你的反馈" });
        setOpen(false);
      } else {
        toast({ variant: "destructive", title: "举报失败", description: data.error });
      }
    } catch {
      toast({ variant: "destructive", title: "网络错误" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs text-muted-foreground/50 hover:text-destructive transition-colors flex items-center gap-1">
          <Flag className="h-3 w-3" />
          举报
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>举报工具</DialogTitle>
          <DialogDescription>选择举报原因，帮助我们维护内容质量</DialogDescription>
        </DialogHeader>
        <RadioGroup value={reason} onValueChange={setReason} className="gap-2">
          {REASONS.map((r) => (
            <div key={r} className="flex items-center gap-2">
              <RadioGroupItem value={r} id={r} />
              <Label htmlFor={r}>{r}</Label>
            </div>
          ))}
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>取消</Button>
          <Button onClick={handleReport} disabled={!reason || loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            确认举报
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
