import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await request.json();
  const reason = body.reason || "";

  // 检查是否已举报
  const { data: existing } = await supabase
    .from("reports")
    .select("id")
    .eq("tool_id", params.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "你已经举报过了" }, { status: 400 });
  }

  // 写入举报
  const { error } = await supabase.from("reports").insert({
    tool_id: params.id,
    user_id: user.id,
    reason,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 更新举报计数
  const { data: reportCount } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("tool_id", params.id);

  const count = reportCount?.length || 0;

  await supabase.from("tools").update({ report_count: count }).eq("id", params.id);

  // 举报 >= 3 自动下架
  if (count >= 3) {
    await supabase.from("tools").update({ is_active: false }).eq("id", params.id);
  }

  return NextResponse.json({ ok: true, reportCount: count });
}
