import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 记录点击
  await supabase.from("click_logs").insert({
    tool_id: params.id,
    user_id: user?.id || null,
  });

  // 更新点击计数
  await supabase.rpc("increment_click_count", { tool_id: params.id });

  // 重新计算评分
  const { data: tool } = await supabase.from("tools").select("*").eq("id", params.id).single();
  if (tool) {
    const { data: score } = await supabase.rpc("calculate_tool_score", { tool_row: tool });
    if (score != null) {
      await supabase.from("tools").update({ score }).eq("id", params.id);
    }
  }

  return NextResponse.json({ ok: true });
}
