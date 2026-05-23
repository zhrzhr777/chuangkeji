"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/resources/FileUpload";
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
  const [pointsRequired, setPointsRequired] = useState("0");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ variant: "destructive", title: "请先登录", description: "上传资源需要登录账户" });
      router.push("/login");
      return;
    }

    if (!file) {
      toast({ variant: "destructive", title: "请选择文件" });
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("resources")
        .getPublicUrl(fileName);

      // Create resource record
      const { error: dbError } = await supabase.from("resources").insert({
        title,
        description,
        category,
        file_path: urlData.publicUrl,
        file_size: file.size,
        file_type: file.type,
        points_required: parseInt(pointsRequired) || 0,
        creator_id: user.id,
      });

      if (dbError) throw dbError;

      // 发放上传奖励积分
      await supabase.from("transactions").insert({
        user_id: user.id, amount: 20, type: "upload_reward",
        description: "上传资源奖励",
      });
      await supabase.rpc("add_user_points", { uid: user.id, pts: 20 });

      toast({ title: "上传成功", description: "资源已发布，并获得 20 积分奖励！" });
      router.push("/resources");
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "上传失败",
        description: error.message || "请重试",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>资源信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">资源名称 *</Label>
            <Input
              id="title"
              placeholder="输入资源名称"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">资源描述</Label>
            <Textarea
              id="description"
              placeholder="描述一下你的资源..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>分类 *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">所需积分</Label>
              <Input
                id="points"
                type="number"
                min="0"
                placeholder="0"
                value={pointsRequired}
                onChange={(e) => setPointsRequired(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">设为 0 表示免费下载</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>文件 *</Label>
            <FileUpload onFileSelect={setFile} selectedFile={file} />
          </div>

          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                上传资源
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
