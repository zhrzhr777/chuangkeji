import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PRICING_COLORS: Record<string, "default" | "secondary" | "outline"> = {
  "免费": "default",
  "付费": "secondary",
  "免费增值": "outline",
};

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    pricing: string;
    likes_count: number;
    profiles?: { username: string } | null;
  };
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.id}`}>
      <Card className="h-full hover:shadow-md transition-all hover:border-primary/50 group cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-lg shrink-0">
                {tool.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base group-hover:text-primary transition-colors truncate">
                  {tool.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {tool.profiles?.username || "匿名用户"}
                </p>
              </div>
            </div>
            <Badge variant={PRICING_COLORS[tool.pricing] || "outline"} className="shrink-0">
              {tool.pricing}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {tool.description || "暂无描述"}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Heart className="h-3.5 w-3.5" />
              {tool.likes_count}
            </div>
            <div className="flex gap-1 flex-wrap justify-end">
              <Badge variant="secondary" className="text-xs">
                {tool.category}
              </Badge>
              {tool.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
