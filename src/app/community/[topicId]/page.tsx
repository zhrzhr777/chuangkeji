import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User as UserIcon, Calendar, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReplySection } from "./reply-section";

export async function generateMetadata({
  params,
}: {
  params: { topicId: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: topic } = await supabase
    .from("topics")
    .select("*")
    .eq("id", params.topicId)
    .single();

  if (!topic) return { title: "话题未找到" };
  return { title: topic.title, description: topic.content?.slice(0, 160) };
}

export default async function TopicDetailPage({
  params,
}: {
  params: { topicId: string };
}) {
  const supabase = createClient();

  const { data: topic } = await supabase
    .from("topics")
    .select("*, profiles(username, avatar_url), tools(name)")
    .eq("id", params.topicId)
    .single();

  if (!topic) notFound();

  const { data: replies } = await supabase
    .from("replies")
    .select("*, profiles(username, avatar_url)")
    .eq("topic_id", topic.id)
    .order("created_at", { ascending: true });

  return (
    <div className="container py-8 max-w-3xl">
      <Link
        href="/community"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回社区
      </Link>

      {/* Topic */}
      <article className="mb-8">
        <h1 className="text-2xl font-bold mb-3">{topic.title}</h1>

        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={topic.profiles?.avatar_url || undefined} />
            <AvatarFallback>
              {topic.profiles?.username?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {topic.profiles?.username || "匿名用户"}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(topic.created_at)}
            </p>
          </div>
          {topic.tools?.name && (
            <Link
              href={`/tools/${topic.tool_id}`}
              className="ml-auto text-sm text-primary hover:underline"
            >
              @{topic.tools.name}
            </Link>
          )}
        </div>

        <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
          {topic.content}
        </div>
      </article>

      <Separator className="mb-8" />

      {/* Replies */}
      <div className="mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
          <MessageSquare className="h-5 w-5" />
          回复 ({replies?.length || 0})
        </h2>

        {replies && replies.length > 0 ? (
          <div className="space-y-4">
            {replies.map((reply: any) => (
              <div key={reply.id} className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarImage src={reply.profiles?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {reply.profiles?.username?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {reply.profiles?.username || "匿名用户"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(reply.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            还没有回复，快来第一个回复吧！
          </p>
        )}
      </div>

      <Separator className="mb-6" />

      <ReplySection topicId={topic.id} />
    </div>
  );
}
