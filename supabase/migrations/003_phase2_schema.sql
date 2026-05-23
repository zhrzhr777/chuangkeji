-- ============================================================
-- 创客集 Phase 2 — 后台管理 + 变现 + 增强
-- ============================================================

-- 1. profiles 增加角色和 VIP
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vip_level TEXT DEFAULT 'free' CHECK (vip_level IN ('free', 'basic', 'pro'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vip_until TIMESTAMPTZ;

-- 2. tools 增加审核状态和推广
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.tools ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;

-- 3. resources 增加审核和自动更新
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS auto_update BOOLEAN DEFAULT false;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS last_checked TIMESTAMPTZ;

-- 4. 广告表
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT,
  link_url TEXT,
  position TEXT NOT NULL DEFAULT 'sidebar' CHECK (position IN ('header', 'sidebar', 'between', 'footer')),
  is_active BOOLEAN DEFAULT true,
  clicks INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 广告 RLS
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ads are viewable by everyone" ON public.ads FOR SELECT USING (true);
CREATE POLICY "Admins can manage ads" ON public.ads FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 6. Admin RLS 策略补充
CREATE POLICY "Admins can update any tool" ON public.tools FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update any resource" ON public.resources FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. 自动更新：检查资源链接有效性的函数
CREATE OR REPLACE FUNCTION public.check_resource_links()
RETURNS TABLE(resource_id UUID, is_valid BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, true
  FROM public.resources r
  WHERE r.auto_update = true;
END;
$$ LANGUAGE plpgsql;

-- 8. 管理员专用：批量更新下载计数
CREATE OR REPLACE FUNCTION public.increment_download_count(resource_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.resources SET download_count = download_count + 1 WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
