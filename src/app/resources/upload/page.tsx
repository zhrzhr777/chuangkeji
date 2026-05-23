import type { Metadata } from "next";
import { Suspense } from "react";
import { UploadForm } from "./client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "上传资源",
  description: "上传分享你的优质创作资源，获取积分奖励",
};

export default function UploadPage() {
  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">上传资源</h1>
        <p className="text-muted-foreground">
          分享你的优质资源，每上传一个资源获得 20 积分奖励
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[500px]" />}>
        <UploadForm />
      </Suspense>
    </div>
  );
}
