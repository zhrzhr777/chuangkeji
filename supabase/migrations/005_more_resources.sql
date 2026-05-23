-- ============================================================
-- 创客集 真实资源数据（可下载的真实链接）
-- 在 Supabase SQL Editor 中运行
-- ============================================================

DO $$
DECLARE
  first_user_id UUID;
BEGIN
  SELECT id INTO first_user_id FROM public.profiles ORDER BY created_at ASC LIMIT 1;

  IF first_user_id IS NULL THEN
    RAISE NOTICE '请先注册一个账号再运行此脚本！';
    RETURN;
  END IF;

  -- 清除旧的假数据
  DELETE FROM public.resources WHERE file_path LIKE '%example.com%';

  INSERT INTO public.resources (title, description, category, file_path, file_size, file_type, points_required, download_count, creator_id) VALUES

  -- ============= 电子书 / 教材（真实免费 PDF 链接） =============
  ('Python 官方教程中文版', 'Python 官方文档中文翻译版，从安装到高级特性完整覆盖。包含语法入门、标准库、数据结构、面向对象编程等核心内容。适合初学者系统学习。', '电子书', 'https://docs.python.org/zh-cn/3/tutorial/index.html', 0, 'text/html', 0, 0, first_user_id),
  ('阮一峰 ES6 入门教程', '国内最受欢迎的 JavaScript ES6 教程，覆盖 let/const、解构、箭头函数、Promise、async/await、Class、Module 等核心特性。', '电子书', 'https://es6.ruanyifeng.com/', 0, 'text/html', 0, 0, first_user_id),
  ('Docker 从入门到实践', '开源中文 Docker 教程，内容涵盖容器基础、镜像构建、Dockerfile、Compose、Swarm、Kubernetes 入门。社区持续维护更新。', '电子书', 'https://yeasy.gitbook.io/docker_practice/', 0, 'text/html', 0, 0, first_user_id),
  ('GitHub 开源项目精选指南', 'GithubDaily 维护的开源项目月度精选，涵盖 AI、前端、后端、DevOps 等热门领域的优质开源项目推荐。', '电子书', 'https://github.com/GitHubDaily/GitHubDaily', 0, 'text/html', 0, 0, first_user_id),
  ('Hello 算法（动画图解版）', '开源数据结构与算法教程，含 500+ 动画图解、12 种编程语言实现。覆盖数组、链表、树、图、排序、搜索、动态规划等核心主题。', '电子书', 'https://www.hello-algo.com/', 0, 'text/html', 0, 0, first_user_id),
  ('MDN Web 开发文档', 'Mozilla 官方 Web 开发文档，HTML/CSS/JavaScript 完整参考手册，含 API 文档、浏览器兼容性数据、交互式示例。前端开发每日必查。', '电子书', 'https://developer.mozilla.org/zh-CN/', 0, 'text/html', 0, 0, first_user_id),

  -- ============= Prompt 提示词合集 =============
  ('ChatGPT 中文提示词大全', 'GitHub 上最全的中文 ChatGPT 提示词库，收录数千个经过验证的实用提示词模板。涵盖写作、编程、翻译、营销、教育、生活等场景。', '模板素材', 'https://github.com/PlexPt/awesome-chatgpt-prompts-zh', 0, 'application/json', 0, 0, first_user_id),
  ('Midjourney 提示词参考手册', '社区维护的 MJ 提示词大全，涵盖风格、光照、构图、材质、艺术家风格等参数参考。持续收录最新 v6 模型专用提示技巧。', '模板素材', 'https://github.com/willwulfken/MidJourney-Styles-and-Keywords-Reference', 0, 'application/json', 0, 0, first_user_id),

  -- ============= 源码项目 =============
  ('Next.js 企业级 SaaS 模板', '开源的全栈 SaaS 启动模板，Next.js 14 + Prisma + Stripe 支付 + 多租户 + RBAC 权限系统。适合快速启动商业项目。', '源码项目', 'https://github.com/nextjs/saas-starter', 6800000, 'application/zip', 5, 0, first_user_id),
  ('shadcn/ui 组件库', '2024 年最火的开源 React UI 组件库，非 npm 包而是直接复制源码到项目中。基于 Radix UI + Tailwind CSS，支持自定义主题。', '源码项目', 'https://github.com/shadcn-ui/ui', 4200000, 'application/zip', 0, 0, first_user_id),
  ('Excalidraw 白板协作工具', '开源手绘风格白板协作工具，可用于画流程图、原型图、思维导图。支持端到端加密、离线使用、自托管部署。', '源码项目', 'https://github.com/excalidraw/excalidraw', 3800000, 'application/zip', 0, 0, first_user_id),
  ('Appwrite 开源后端平台', '开源 Firebase 替代方案，提供认证、数据库、存储、云函数等全套后端服务。可自托管或使用云版本，大幅降低开发成本。', '源码项目', 'https://github.com/appwrite/appwrite', 12000000, 'application/zip', 0, 0, first_user_id),
  ('NocoDB 无代码数据库平台', '开源 Airtable 替代品，将 MySQL/PostgreSQL 等数据库转为智能表格。支持 REST API、自动化工作流、团队协作。', '源码项目', 'https://github.com/nocodb/nocodb', 9500000, 'application/zip', 0, 0, first_user_id),
  ('Vercel AI SDK', 'Vercel 官方开源的 AI 开发工具包，统一 API 对接 OpenAI、Anthropic、Google 等模型。支持流式响应、函数调用、多模态。', '源码项目', 'https://github.com/vercel/ai', 3200000, 'application/zip', 0, 0, first_user_id),

  -- ============= 视频教程 =============
  ('李宏毅 2024 机器学习课程', '台大李宏毅教授机器学习课程，YouTube 免费连载。最新课件涵盖 Transformer、LLM、扩散模型、RLHF 等前沿主题。中文授课，讲得通俗易懂。', '视频教程', 'https://www.youtube.com/playlist?list=PLJV_el3uVTsMhtt7_Y6sgTHGHp1Vb2P2J', 0, 'video/mp4', 0, 0, first_user_id),
  ('CS50 哈佛计算机科学导论', '哈佛大学 CS50 公开课，YouTube 免费观看。从 C 语言到 Python，涵盖算法、数据结构、Web 开发。全球公认最好的编程入门课。', '视频教程', 'https://www.youtube.com/cs50', 0, 'video/mp4', 0, 0, first_user_id),

  -- ============= 模板素材 =============
  ('IconPark 字节跳动图标库', '字节跳动开源图标库，2400+ 高质量 SVG 图标，支持四种主题风格。提供在线编辑器调整大小、颜色、线宽后直接下载使用。', '模板素材', 'https://github.com/bytedance/IconPark', 2500000, 'application/zip', 0, 0, first_user_id),
  ('TDesign 腾讯设计体系', '腾讯开源企业级设计系统，含 Figma 组件库 + React/Vue/小程序多端代码库。组件覆盖后台管理常用场景，可直接用于商业项目。', '模板素材', 'https://github.com/Tencent/tdesign', 5800000, 'application/zip', 3, 0, first_user_id),
  ('Heroicons 精美 SVG 图标集', 'Tailwind CSS 团队出品的 SVG 图标库，300+ 精美图标，三种尺寸风格。可直接复制 SVG 代码或通过 npm 安装使用。', '模板素材', 'https://github.com/tailwindlabs/heroicons', 1200000, 'application/zip', 0, 0, first_user_id),
  ('Ant Design 设计资源包', '蚂蚁集团 Ant Design 官方设计资源，含 Sketch/Figma/Axure 全套组件库。涵盖通用组件、图表、移动端的完整设计规范文件。', '模板素材', 'https://github.com/ant-design/ant-design', 8500000, 'application/zip', 0, 0, first_user_id),

  -- ============= 更多电子书 =============
  ('Prompt Engineering Guide', 'DAIR.AI 出品的提示工程指南开源电子书，涵盖零样本/少样本推理、思维链、自我一致性、知识生成等高级技巧。英文原版。', '电子书', 'https://github.com/dair-ai/Prompt-Engineering-Guide', 0, 'text/html', 0, 0, first_user_id),
  ('React 官方文档中文版', 'React 官方文档中文翻译，最新版本。涵盖组件、Hook、状态管理、路由等核心概念，附交互式教程和最佳实践指南。', '电子书', 'https://zh-hans.react.dev/', 0, 'text/html', 0, 0, first_user_id),
  ('深入理解 TypeScript', 'TypeScript 社区经典开源书籍，深入讲解类型系统、泛型、模块、命名空间等高级特性。适合已会基础想要进阶的开发者。', '电子书', 'https://github.com/basarat/typescript-book', 0, 'text/html', 0, 0, first_user_id),
  ('前端面试宝典', '最全的前端面试题库开源项目，涵盖 HTML/CSS/JS/React/Vue/Webpack/Node 等核心领域。每道题都附详细答案和代码示例。', '电子书', 'https://github.com/haizlin/fe-interview', 0, 'text/html', 0, 0, first_user_id),
  ('计算机自学指南', 'CS 自学指南，整理世界顶尖大学（MIT、斯坦福、CMU）公开课资源。从编程入门到操作系统、计算机网络、编译原理的完整自学路线。', '电子书', 'https://github.com/CS-Learn/Awesome-CS-Courses-Learn', 0, 'text/html', 0, 0, first_user_id);

  RAISE NOTICE '真实资源数据导入成功！共 25 条。';
END $$;
