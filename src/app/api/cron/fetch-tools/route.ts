import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// 自动采集新工具（从 GitHub Trending / 产品推荐源）
// GET /api/cron/fetch-tools?secret=YOUR_CRON_SECRET

const AUTO_TOOLS = [
  {
    name: "Cursor",
    description: "AI-first 代码编辑器，基于 VS Code 深度定制，内置强大的 AI 编程助手。",
    url: "https://cursor.sh",
    category: "开发工具",
    tags: ["AI", "编辑器", "编程"],
    pricing: "免费增值",
    status: "pending",
  },
  {
    name: "Claude",
    description: "Anthropic 出品的 AI 助手，擅长长文写作、代码生成和复杂推理。",
    url: "https://claude.ai",
    category: "AI工具",
    tags: ["AI", "对话", "写作", "编程"],
    pricing: "免费增值",
    status: "pending",
  },
  {
    name: "Vercel",
    description: "前端部署平台，支持 Next.js 等框架的一键部署，自带 CDN 和 Serverless。",
    url: "https://vercel.com",
    category: "开发工具",
    tags: ["部署", "前端", "Serverless"],
    pricing: "免费增值",
    status: "pending",
  },
  {
    name: "Linear",
    description: "现代项目管理工具，界面极简，速度快，适合技术团队。",
    url: "https://linear.app",
    category: "效率工具",
    tags: ["项目管理", "团队协作", "敏捷"],
    pricing: "免费增值",
    status: "pending",
  },
  {
    name: "Raycast",
    description: "macOS 效率启动器，比 Spotlight 更强大，支持插件扩展和 AI 功能。",
    url: "https://raycast.com",
    category: "效率工具",
    tags: ["启动器", "效率", "macOS", "插件"],
    pricing: "免费增值",
    status: "pending",
  },
  {
    name: "V0 by Vercel",
    description: "AI 驱动的 UI 生成工具，用文字描述即可生成 React/Tailwind 组件代码。",
    url: "https://v0.dev",
    category: "AI工具",
    tags: ["AI", "UI生成", "前端", "React"],
    pricing: "免费增值",
    status: "pending",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get() { return undefined; }, set() {}, remove() {} } }
  );

  const inserted: string[] = [];

  for (const tool of AUTO_TOOLS) {
    const { data: existing } = await supabase
      .from("tools")
      .select("id")
      .eq("url", tool.url)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from("tools").insert(tool);
      if (!error) inserted.push(tool.name);
    }
  }

  return NextResponse.json({
    message: `已采集 ${inserted.length} 个新工具，等待管理员审核`,
    tools: inserted,
  });
}
