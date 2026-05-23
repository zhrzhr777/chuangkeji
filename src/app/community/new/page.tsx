import type { Metadata } from "next";
import { Suspense } from "react";
import { NewTopicForm } from "./client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "发起新话题",
  description: "在创客集社区发起新的讨论话题",
};

export default function NewTopicPage() {
  return (
    <div className="container py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">发起新话题</h1>
        <p className="text-muted-foreground">分享你的想法，与其他创作者交流</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <NewTopicForm />
      </Suspense>
    </div>
  );
}
