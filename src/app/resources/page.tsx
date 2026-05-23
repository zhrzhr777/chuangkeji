import type { Metadata } from "next";
import { ResourceList } from "./client";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "资源中心",
  description: "浏览和下载优质创作资源：模板素材、插件扩展、电子书、视频教程等",
};

export default async function ResourcesPage() {
  const supabase = createClient();

  const { data: resources } = await supabase
    .from("resources")
    .select("*, profiles(username)")
    .order("created_at", { ascending: false });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">资源中心</h1>
        <p className="text-muted-foreground">
          浏览和下载创作者们分享的优质资源
        </p>
      </div>

      <ResourceList initialResources={resources || []} />
    </div>
  );
}
