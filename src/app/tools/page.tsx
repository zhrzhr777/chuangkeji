import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolsFilterSection } from "./client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "工具导航",
  description: "发现最好用的AI工具、设计工具、开发工具和效率工具，提升创作效率",
};

function ToolCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16 mt-1" />
          </div>
        </div>
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-10" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const supabase = createClient();

  let query = supabase
    .from("tools")
    .select("*, profiles(username)")
    .order("created_at", { ascending: false });

  if (searchParams.q) {
    query = query.or(
      `name.ilike.%${searchParams.q}%,description.ilike.%${searchParams.q}%`
    );
  }

  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  const { data: tools } = await query;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">工具导航</h1>
        <p className="text-muted-foreground">
          发现最好用的工具，提升创作效率
          {searchParams.q && (
            <span>
              {" "}
              — 搜索 &quot;{searchParams.q}&quot; 的结果
            </span>
          )}
        </p>
      </div>

      <Suspense fallback={null}>
        <ToolsFilterSection
          tools={tools || []}
          initialCategory={searchParams.category || null}
          initialSearch={searchParams.q || ""}
        />
      </Suspense>
    </div>
  );
}
