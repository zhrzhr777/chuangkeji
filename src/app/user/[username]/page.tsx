import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Heart, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return { title: `${params.username} 的主页`, description: `查看 ${params.username} 提交的工具和贡献` };
}

export default async function UserProfilePage({ params }: { params: { username: string } }) {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  if (!profile) notFound();

  const { data: tools } = await supabase
    .from("tools")
    .select("*")
    .eq("creator_id", profile.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const totalLikes = tools?.reduce((sum: number, t: any) => sum + t.likes_count, 0) || 0;

  return (
    <div className="container max-w-3xl py-8">
      {/* Profile header */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback className="text-xl">{profile.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-sm text-muted-foreground">加入于 {formatDate(profile.created_at)}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="flex items-center gap-1"><Wrench className="h-4 w-4 text-muted-foreground" />提交 {tools?.length || 0} 个工具</span>
            <span className="flex items-center gap-1"><Heart className="h-4 w-4 text-muted-foreground" />获得 {totalLikes} 赞</span>
          </div>
        </div>
      </div>

      {/* Submitted tools */}
      <h2 className="text-lg font-bold mb-4">提交的工具</h2>
      {!tools || tools.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">暂无提交</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tools.map((tool: any) => (
            <Link key={tool.id} href={`/tools/${tool.id}`}>
              <Card className="hover:shadow-sm transition-shadow h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                      {tool.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-sm truncate">{tool.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{tool.likes_count} 赞</span>
                    <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
