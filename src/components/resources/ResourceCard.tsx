import Link from "next/link";
import { Download, Coins, FileText, FileCode, FileImage, Video, FileArchive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime, getFileSizeString } from "@/lib/utils";

const FILE_STYLES: Record<string, { icon: typeof FileText; color: string }> = {
  "link": { icon: FileCode, color: "bg-emerald-50 text-emerald-600" },
  "application/pdf": { icon: FileText, color: "bg-red-50 text-red-600" },
  "application/zip": { icon: FileArchive, color: "bg-amber-50 text-amber-600" },
  "application/json": { icon: FileCode, color: "bg-green-50 text-green-600" },
  "video/mp4": { icon: Video, color: "bg-purple-50 text-purple-600" },
  "application/figma": { icon: FileImage, color: "bg-pink-50 text-pink-600" },
  "text/html": { icon: FileCode, color: "bg-blue-50 text-blue-600" },
  default: { icon: FileText, color: "bg-blue-50 text-blue-600" },
};

interface ResourceCardProps {
  resource: {
    id: string; title: string; description: string; category: string;
    file_size: number; file_type: string; points_required: number;
    download_count: number; created_at: string;
    profiles?: { username: string } | null;
  };
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const style = FILE_STYLES[resource.file_type] || FILE_STYLES.default;
  const Icon = style.icon;

  return (
    <Link href={`/resources/${resource.id}`}>
      <Card className="h-full hover:shadow-md transition-all hover:border-primary/50 group cursor-pointer">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${style.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm group-hover:text-primary transition-colors line-clamp-1">
                {resource.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {resource.profiles?.username || "匿名用户"} · {formatRelativeTime(resource.created_at)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {resource.description || "暂无描述"}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Download className="h-3 w-3" />{resource.download_count}</span>
              {resource.points_required > 0 && (
                <span className="flex items-center gap-1"><Coins className="h-3 w-3" />{resource.points_required}积分</span>
              )}
              {resource.points_required === 0 && <span className="text-green-600 font-medium text-xs">免费</span>}
            </div>
            <div className="flex gap-1">
              <Badge variant="secondary" className="text-xs">{resource.category}</Badge>
              <Badge variant="outline" className="text-xs">{getFileSizeString(resource.file_size)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
