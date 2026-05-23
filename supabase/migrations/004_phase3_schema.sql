-- ============================================================
-- 创客集 Phase 3 — 自动化评分 + 排行榜 + 用户自治
-- ============================================================

-- 1. tools 新增字段
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS click_count INT DEFAULT 0;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS score FLOAT DEFAULT 0;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS report_count INT DEFAULT 0;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. 提交记录（用于限制频率）
CREATE TABLE IF NOT EXISTS public.submission_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_submission_user_date ON public.submission_logs(user_id, submitted_at);

-- 3. 点击记录
CREATE TABLE IF NOT EXISTS public.click_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_click_tool ON public.click_logs(tool_id);

-- 4. 举报记录
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tool_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_reports_tool ON public.reports(tool_id);

-- 5. RLS
ALTER TABLE public.submission_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read submission_logs" ON public.submission_logs FOR SELECT USING (true);
CREATE POLICY "Auth users can insert submission_logs" ON public.submission_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Anyone can read click_logs" ON public.click_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert click_logs" ON public.click_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Auth users can insert reports" ON public.reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. 评分计算函数（五维加权）
CREATE OR REPLACE FUNCTION public.calculate_tool_score(
  tool_row public.tools
) RETURNS FLOAT AS $$
DECLARE
  max_clicks FLOAT;
  max_likes FLOAT;
  max_replies FLOAT;
  days_old FLOAT;
  click_score FLOAT;
  like_score FLOAT;
  reply_score FLOAT;
  time_score FLOAT;
  rep_score FLOAT;
  submitter_likes INT;
  total_likes INT;
  total_clicks INT;
  total_replies INT;
BEGIN
  -- 获取全局最大值用于归一化
  SELECT GREATEST(MAX(click_count), 1) INTO max_clicks FROM public.tools WHERE is_active = true;
  SELECT GREATEST(MAX(likes_count), 1) INTO max_likes FROM public.tools WHERE is_active = true;
  SELECT COALESCE(MAX(reply_count), 1) INTO max_replies FROM public.topics WHERE tool_id = tool_row.id;

  -- 时间衰减（天数越少分数越高）
  days_old := EXTRACT(DAY FROM (NOW() - tool_row.created_at));
  time_score := GREATEST(0, 1 - (days_old / 365.0));

  -- 各维度归一化 (0-1)
  click_score := LEAST(tool_row.click_count / NULLIF(max_clicks, 0), 1.0);
  like_score := LEAST(tool_row.likes_count / NULLIF(max_likes, 0), 1.0);
  reply_score := LEAST(COALESCE(max_replies, 0) / NULLIF((SELECT GREATEST(MAX(reply_count), 1) FROM public.topics), 0), 1.0);

  -- 计算本次需要的数据
  SELECT COALESCE(SUM(likes_count), 0) INTO submitter_likes FROM public.tools WHERE creator_id = tool_row.creator_id;
  SELECT GREATEST(COALESCE(SUM(likes_count), 0), 1) INTO total_likes FROM public.tools;
  rep_score := LEAST(submitter_likes / NULLIF(total_likes, 0), 1.0);

  -- 加权求和: 点击30% + 点赞25% + 讨论20% + 时效15% + 信誉10%
  RETURN ROUND(CAST((click_score * 0.30 + like_score * 0.25 + reply_score * 0.20 + time_score * 0.15 + rep_score * 0.10) * 100 AS numeric), 1);
END;
$$ LANGUAGE plpgsql STABLE;

-- 7. 更新时间改由 NOW() 自动
-- （无需额外函数，应用层每次查询后更新 score）

-- 8. 给现有种子数据初始化 score
UPDATE public.tools SET score = public.calculate_tool_score(tools.*) WHERE is_active = true;

-- 9. 点击计数递增 RPC
CREATE OR REPLACE FUNCTION public.increment_click_count(tool_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.tools SET click_count = click_count + 1 WHERE id = tool_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
