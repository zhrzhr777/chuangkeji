import type { Metadata } from "next";
import { Suspense } from "react";
import { SubmitToolForm } from "./client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "提交工具", description: "提交你发现的好工具到创客集" };

export default function SubmitPage() {
  return (
    <div className="container max-w-xl py-8">
      <h1 className="text-2xl font-bold mb-2">提交工具</h1>
      <p className="text-muted-foreground mb-6">分享你发现的好工具，提交后直接上架，每周限 3 次</p>
      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <SubmitToolForm />
      </Suspense>
    </div>
  );
}
