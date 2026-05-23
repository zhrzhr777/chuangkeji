import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface AdBannerProps {
  position: "header" | "sidebar" | "between" | "footer";
}

export async function AdBanner({ position }: AdBannerProps) {
  const supabase = createClient();
  const { data: ads } = await supabase
    .from("ads")
    .select("*")
    .eq("position", position)
    .eq("is_active", true)
    .limit(1);

  const ad = ads?.[0];
  if (!ad) return null;

  const content = (
    <div className="rounded-lg border bg-card p-4 text-center">
      {ad.image_url && (
        <img src={ad.image_url} alt={ad.title} className="mx-auto mb-2 max-h-32 rounded" />
      )}
      <p className="text-sm font-medium">{ad.title}</p>
      <p className="text-xs text-muted-foreground mt-1">广告</p>
    </div>
  );

  if (ad.link_url) {
    return (
      <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}
