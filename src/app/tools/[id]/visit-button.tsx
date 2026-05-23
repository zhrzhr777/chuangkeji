"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function VisitButton({ toolId, url }: { toolId: string; url: string }) {
  const router = useRouter();

  const handleClick = async () => {
    await fetch(`/api/tools/${toolId}/click`, { method: "POST" });
    window.open(url, "_blank", "noopener,noreferrer");
    router.refresh();
  };

  return (
    <Button onClick={handleClick} variant="outline">
      <ExternalLink className="h-4 w-4 mr-2" />
      访问网站
    </Button>
  );
}
