import type { Metadata } from "next";
import Link from "next/link";
import { Plus, MessageSquare, User as UserIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "轻社区",
  description: "创客集社区 - 讨论工具、分享心得、交流创意",
};

export default async function CommunityPage() {
  const supabase = createClient();

  const { data: topics } = await supabase
    .from("topics")
    .select("*, profiles(username), tools(name)")
    .order("updated_at", { ascending: false });

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">轻社区</h1>
          <p className="text-muted-foreground">
            讨论工具、分享心得、交流创意
          </p>
        </div>
        <Button asChild>
          <Link href="/community/new">
            <Plus className="h-4 w-4 mr-2" />
            发帖
          </Link>
        </Button>
      </div>

      {!topics || topics.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg mb-2">还没有话题</p>
          <p className="text-sm mb-4">发起第一个讨论吧！</p>
          <Button asChild>
            <Link href="/community/new">
              <Plus className="h-4 w-4 mr-2" />
              发帖
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic: any) => (
            <Link key={topic.id} href={`/community/${topic.id}`}>
              <Card className="hover:shadow-sm transition-shadow hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg">{topic.title}</CardTitle>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          {topic.profiles?.username || "匿名"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(topic.created_at)}
                        </span>
                        {topic.tools?.name && (
                          <span className="text-primary">
                            @{topic.tools.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0 ml-4">
                      <MessageSquare className="h-4 w-4" />
                      {topic.reply_count}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
