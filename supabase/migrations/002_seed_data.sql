-- ============================================================
-- 创客集 种子测试数据
-- 在 Supabase SQL Editor 中运行此脚本
-- ============================================================

-- 取第一个注册用户的 ID 作为作者（需先注册一个账号）
DO $$
DECLARE
  first_user_id UUID;
BEGIN
  SELECT id INTO first_user_id FROM public.profiles ORDER BY created_at ASC LIMIT 1;

  -- 如果没有注册用户，跳过
  IF first_user_id IS NULL THEN
    RAISE NOTICE '请先注册一个账号，再运行此脚本！';
    RETURN;
  END IF;

  -- ============================================================
  -- 插入工具数据
  -- ============================================================
  INSERT INTO public.tools (name, description, url, category, tags, pricing, likes_count, creator_id) VALUES
  ('Midjourney', '最强大的 AI 图像生成工具，通过文字描述即可创作出令人惊艳的艺术作品。支持多种风格、高分辨率输出。', 'https://www.midjourney.com', 'AI工具', ARRAY['AI', '图像生成', '设计'], '付费', 128, first_user_id),
  ('ChatGPT', 'OpenAI 出品的对话式 AI 助手，可用于写作、编程、翻译、头脑风暴等多种场景。', 'https://chat.openai.com', 'AI工具', ARRAY['AI', '对话', '写作', '编程'], '免费增值', 256, first_user_id),
  ('Figma', '基于浏览器的协作式 UI 设计工具，支持多人实时协作，插件生态丰富。', 'https://www.figma.com', '设计工具', ARRAY['设计', 'UI', '协作', '原型'], '免费增值', 192, first_user_id),
  ('VS Code', '微软出品的免费代码编辑器，插件丰富，性能优异，是开发者最喜爱的编辑器。', 'https://code.visualstudio.com', '开发工具', ARRAY['编辑器', 'IDE', '开发', '开源'], '免费', 215, first_user_id),
  ('Notion', '集笔记、知识库、项目管理于一体的全能工具，个人和团队皆宜。', 'https://www.notion.so', '效率工具', ARRAY['笔记', '知识管理', '项目管理', '协作'], '免费增值', 189, first_user_id),
  ('Stable Diffusion', '开源 AI 图像生成模型，可本地部署，支持各类插件和自定义模型。', 'https://stability.ai', 'AI工具', ARRAY['AI', '图像生成', '开源', '本地部署'], '免费', 156, first_user_id),
  ('Canva', '简单易用的在线设计平台，提供海量模板，适合非设计师快速出图。', 'https://www.canva.com', '设计工具', ARRAY['设计', '模板', '海报', '易上手'], '免费增值', 143, first_user_id),
  ('GitHub Copilot', 'GitHub 出品的 AI 编程助手，在编辑器中自动补全代码，大幅提升编码效率。', 'https://github.com/features/copilot', '开发工具', ARRAY['AI', '编程', '补全', '效率'], '付费', 201, first_user_id),
  ('Obsidian', '基于本地 Markdown 文件的知识管理工具，支持双向链接和关系图谱。', 'https://obsidian.md', '效率工具', ARRAY['笔记', '知识管理', 'Markdown', '本地'], '免费', 167, first_user_id),
  ('Remove.bg', '一键去除图片背景的在线工具，AI 驱动的精准抠图。', 'https://www.remove.bg', 'AI工具', ARRAY['AI', '抠图', '图片处理', '在线工具'], '免费增值', 98, first_user_id),
  ('Tailwind CSS', '实用优先的 CSS 框架，通过组合类名快速构建自定义界面。', 'https://tailwindcss.com', '开发工具', ARRAY['CSS', '前端', '框架', '响应式'], '免费', 178, first_user_id),
  ('Whimsical', '极简风格的在线绘图工具，适合画流程图、思维导图、线框图。', 'https://whimsical.com', '设计工具', ARRAY['流程图', '思维导图', '线框图', '协作'], '免费增值', 76, first_user_id);

  -- ============================================================
  -- 插入资源数据
  -- ============================================================
  INSERT INTO public.resources (title, description, category, file_path, file_size, file_type, points_required, download_count, creator_id) VALUES
  ('2024 UI 设计趋势报告', '全面分析 2024 年 UI 设计趋势，包含配色、排版、动效、组件化等方向的深度解析。', '电子书', 'https://example.com/ui-trends-2024.pdf', 3500000, 'application/pdf', 0, 256, first_user_id),
  ('React 组件库模板', '一套基于 React + TypeScript 的企业级组件库源码模板，开箱即用。', '源码项目', 'https://example.com/react-components.zip', 12800000, 'application/zip', 10, 89, first_user_id),
  ('产品经理面试题库', '100 道大厂产品经理高频面试题，附详细解题思路和回答框架。', '电子书', 'https://example.com/pm-interview.pdf', 2100000, 'application/pdf', 5, 167, first_user_id),
  ('电商后台管理系统模板', '基于 Next.js + Ant Design 的全栈电商后台模板，含权限管理、数据看板、订单管理。', '源码项目', 'https://example.com/admin-template.zip', 25600000, 'application/zip', 20, 45, first_user_id),
  ('AI 绘画 Prompt 合集', '精心整理的 500+ AI 绘画提示词，涵盖人物、场景、风格、光影等分类。', '模板素材', 'https://example.com/ai-prompts.json', 850000, 'application/json', 0, 312, first_user_id),
  ('图标库 5000+ SVG', '精选 5000+ 常用 SVG 图标，分类清晰，可直接用于商业项目。', '模板素材', 'https://example.com/icons-pack.zip', 4500000, 'application/zip', 5, 198, first_user_id),
  ('从零学 Python 视频教程', '40 集 Python 入门到进阶视频教程，从环境搭建到实战项目。', '视频教程', 'https://example.com/python-course.mp4', 2560000000, 'video/mp4', 15, 73, first_user_id),
  ('Vercel 部署全指南', '详细讲解如何将 Next.js 项目部署到 Vercel，包含环境变量、自定义域名、分析配置。', '电子书', 'https://example.com/vercel-guide.pdf', 1800000, 'application/pdf', 0, 134, first_user_id),
  ('Figma 设计系统组件库', '一套完整的 Figma 设计系统组件库，含颜色、文字、按钮、表单等原子组件。', '模板素材', 'https://example.com/design-system.fig', 8200000, 'application/figma', 10, 92, first_user_id),
  ('Docker 入门到精通', 'Docker 从安装到生产部署的完整教程，含 Dockerfile、Compose、Swarm 实战。', '电子书', 'https://example.com/docker-book.pdf', 4200000, 'application/pdf', 8, 56, first_user_id),
  ('微信小程序商城模板', '完整的小程序商城前端源码，含首页、商品列表、购物车、订单流程。', '源码项目', 'https://example.com/miniapp-shop.zip', 4800000, 'application/zip', 12, 34, first_user_id),
  ('ChatGPT 提示词工程指南', '学习如何编写高效的 ChatGPT 提示词，提升 AI 输出质量。', '电子书', 'https://example.com/prompt-engineering.pdf', 1500000, 'application/pdf', 0, 278, first_user_id);

  -- ============================================================
  -- 插入话题数据（使用变量捕获刚插入的话题 ID）
  -- ============================================================
  WITH t1 AS (
    INSERT INTO public.topics (title, content, author_id, reply_count) VALUES
    ('大家用什么 AI 工具提升效率？', '最近试了挺多 AI 工具的，感觉工作效率提升了不少。个人最推荐的是 ChatGPT + Copilot 的组合，写代码和写文档都快了很多。大家平时都用什么 AI 工具？有什么好用的推荐吗？', first_user_id, 0) RETURNING id
  ),
  t2 AS (
    INSERT INTO public.topics (title, content, author_id, reply_count) VALUES
    ('VS Code 必装插件推荐', '用了 VS Code 好几年了，积累了不少好用的插件。我推荐这几个：GitHub Copilot、Prettier、ESLint、GitLens、Thunder Client。你们觉得必不可少的插件是哪些？', first_user_id, 0) RETURNING id
  ),
  t3 AS (
    INSERT INTO public.topics (title, content, author_id, reply_count) VALUES
    ('设计师转行前端开发的学习路线', '做了 3 年 UI 设计，最近想学前端开发，求推荐学习路线。目前会 HTML/CSS 基础，JS 刚学完 ES6。', first_user_id, 0) RETURNING id
  ),
  t4 AS (
    INSERT INTO public.topics (title, content, author_id, reply_count) VALUES
    ('Notion vs Obsidian 笔记工具怎么选？', '用了 Notion 一年多了，功能很强大但有时候觉得太重了。最近看到很多人推荐 Obsidian，双向链接的概念很吸引人。两个都用过的朋友来说说感受？', first_user_id, 0) RETURNING id
  ),
  t5 AS (
    INSERT INTO public.topics (title, content, author_id, reply_count) VALUES
    ('2024 年 Web 开发技术栈推荐', '新手想学 Web 开发，现在应该从什么技术栈入手？React 还是 Vue？Next.js 有必要学吗？后端推荐用什么？求过来人指点。', first_user_id, 0) RETURNING id
  ),
  t6 AS (
    INSERT INTO public.topics (title, content, author_id, reply_count) VALUES
    ('AI 绘画工具哪家强？', '用过 Midjourney、Stable Diffusion、DALL-E，个人感觉 MJ 出图质量最好，SD 优势在可控性和本地部署，DALL-E 跟 ChatGPT 集成很方便。大家怎么看？', first_user_id, 0) RETURNING id
  )
  INSERT INTO public.replies (topic_id, content, author_id)
  SELECT t1.id, '我主要用 ChatGPT 写邮件和整理文档，效率确实提高了不少。最近在试用 Claude，感觉它的逻辑推理比 ChatGPT 更强，写技术文章特别靠谱。', first_user_id FROM t1
  UNION ALL SELECT t1.id, '我们团队用 Midjourney 出设计稿的速度快了好几倍，设计师现在主要做优化和调整，基础工作都交给 AI 了。', first_user_id FROM t1
  UNION ALL SELECT t1.id, '作为程序员，Copilot 简直是神器，写重复性代码的时候省太多时间了。最近还在用 Cursor 这个 AI 编辑器，体验也不错。', first_user_id FROM t1
  UNION ALL SELECT t1.id, '推荐一个比较小众的工具：Perplexity AI，用来做技术调研和信息检索特别快，比传统搜索引擎好用多了。', first_user_id FROM t1
  UNION ALL SELECT t1.id, '我也是 ChatGPT + Copilot，然后再加上 Notion AI 整理笔记，三件套配合起来真的很顺。', first_user_id FROM t1
  UNION ALL SELECT t2.id, '必装的话我加一个：Error Lens，直接在代码行内显示错误信息，不需要鼠标悬停才能看，效率提升明显。', first_user_id FROM t2
  UNION ALL SELECT t2.id, '我也推荐 Thunder Client，轻量级的 API 测试工具，比 Postman 轻多了，日常开发够用了。', first_user_id FROM t2
  UNION ALL SELECT t2.id, 'Tailwind CSS IntelliSense 必须装，写 Tailwind 的时候自动补全类名，不然真的记不住那么多。', first_user_id FROM t2
  UNION ALL SELECT t3.id, '设计师转前端的话，建议路线：HTML/CSS → JavaScript（重点） → React → Next.js。你有设计基础，CSS 应该很熟，重点把 JS 基础打好，然后直接学 React。', first_user_id FROM t3
  UNION ALL SELECT t3.id, '推荐一个很适合设计师的前端学习资源：frontendmentor.io，有真实的项目需求，从设计稿入手练习，很适合设计师的思维方式。', first_user_id FROM t3
  UNION ALL SELECT t3.id, '同为设计转前端！建议先别急着学框架，把 JS 原生 DOM 操作搞熟，理解数据驱动视图的概念，后续学 React 就轻松了。', first_user_id FROM t3
  UNION ALL SELECT t3.id, '你的设计背景其实很吃香，完全可以走 UI Engineer 路线，专攻组件库建设和 Design System，这些方向很缺人。', first_user_id FROM t3
  UNION ALL SELECT t4.id, '两个都用过。Notion 适合团队协作和项目管理，Obsidian 适合个人知识深度整理。如果你的需求主要是自己写笔记、建立知识体系，Obsidian 更好。', first_user_id FROM t4
  UNION ALL SELECT t4.id, 'Obsidian 的本地 Markdown 文件是最大优势，数据完全掌控。Notion 的数据在云端，万一哪天服务关了数据都拿不回来。', first_user_id FROM t4
  UNION ALL SELECT t4.id, '我现在双持：Obsidian 做长期知识库和深度思考，Notion 做项目管理、协作文档、生活记录。各有所长不用二选一。', first_user_id FROM t4;

  -- 更新话题的回复计数
  UPDATE public.topics SET reply_count = (SELECT COUNT(*) FROM public.replies WHERE topic_id = topics.id);

  RAISE NOTICE '种子数据导入成功！';
END $$;
