import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse } from "next/server";

// 定时检查资源链接有效性
// 部署后可通过 Cloudflare Workers Cron 或 Vercel Cron 定时调用
// GET /api/cron/check-resources?secret=YOUR_CRON_SECRET

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // 简易密钥保护
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get() { return undefined; },
        set() {},
        remove() {},
      },
    }
  );

  const { data: resources } = await supabase
    .from("resources")
    .select("id, file_path, last_checked")
    .eq("auto_update", true)
    .order("last_checked", { ascending: true, nullsFirst: true })
    .limit(50);

  const results: { id: string; status: string }[] = [];

  for (const res of resources || []) {
    try {
      const response = await fetch(res.file_path, { method: "HEAD", signal: AbortSignal.timeout(10000) });
      const valid = response.ok;

      await supabase.from("resources").update({
        last_checked: new Date().toISOString(),
        status: valid ? "approved" : "rejected",
      }).eq("id", res.id);

      results.push({ id: res.id, status: valid ? "valid" : "invalid" });
    } catch {
      results.push({ id: res.id, status: "error" });
    }
  }

  return NextResponse.json({ checked: results.length, results });
}
