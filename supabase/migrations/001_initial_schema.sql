-- ============================================================
-- 创客集 (ChuangKeJi) Database Schema
-- ============================================================

-- 1. Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  points INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tools table
CREATE TABLE public.tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '其他',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  pricing TEXT NOT NULL DEFAULT '免费' CHECK (pricing IN ('免费', '付费', '免费增值')),
  icon_url TEXT,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tool likes
CREATE TABLE public.tool_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id UUID NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tool_id, user_id)
);

-- 4. Resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT '其他',
  file_path TEXT NOT NULL,
  file_size BIGINT DEFAULT 0,
  file_type TEXT DEFAULT '',
  points_required INT DEFAULT 0,
  download_count INT DEFAULT 0,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Transactions (points ledger)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('download', 'upload_reward', 'daily_checkin', 'admin_grant')),
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Daily check-ins
CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  points_earned INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- 7. Community topics
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  tool_id UUID REFERENCES public.tools(id) ON DELETE SET NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reply_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Topic replies
CREATE TABLE public.replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.replies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Functions
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Increment reply count on new reply
CREATE OR REPLACE FUNCTION public.increment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.topics SET reply_count = reply_count + 1, updated_at = NOW()
  WHERE id = NEW.topic_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_reply_created
  AFTER INSERT ON public.replies
  FOR EACH ROW EXECUTE FUNCTION public.increment_reply_count();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, owner update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tools: public read, authenticated insert, owner update/delete
CREATE POLICY "Tools are viewable by everyone" ON public.tools
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create tools" ON public.tools
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own tools" ON public.tools
  FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own tools" ON public.tools
  FOR DELETE USING (auth.uid() = creator_id);

-- Tool likes: public read, authenticated insert, owner delete
CREATE POLICY "Tool likes are viewable by everyone" ON public.tool_likes
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can like" ON public.tool_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike" ON public.tool_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Resources: public read, authenticated insert, owner update/delete
CREATE POLICY "Resources are viewable by everyone" ON public.resources
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload resources" ON public.resources
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own resources" ON public.resources
  FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users can delete own resources" ON public.resources
  FOR DELETE USING (auth.uid() = creator_id);

-- Transactions: owner view only
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (true);

-- Checkins: owner view, authenticated insert
CREATE POLICY "Users can view own checkins" ON public.checkins
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can check in" ON public.checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Topics: public read, authenticated insert, owner update/delete
CREATE POLICY "Topics are viewable by everyone" ON public.topics
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create topics" ON public.topics
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own topics" ON public.topics
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own topics" ON public.topics
  FOR DELETE USING (auth.uid() = author_id);

-- Replies: public read, authenticated insert, owner update/delete
CREATE POLICY "Replies are viewable by everyone" ON public.replies
  FOR SELECT USING (true);
CREATE POLICY "Authenticated users can reply" ON public.replies
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own replies" ON public.replies
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own replies" ON public.replies
  FOR DELETE USING (auth.uid() = author_id);

-- ============================================================
-- Storage Bucket Configuration
-- Run these in Supabase SQL Editor or Dashboard
-- ============================================================

-- Create storage bucket for resources
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

-- Storage RLS policies (run after creating bucket)
-- CREATE POLICY "Public read access for resources" ON storage.objects
--   FOR SELECT USING (bucket_id = 'resources');
-- CREATE POLICY "Authenticated users can upload to resources" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'resources' AND auth.role() = 'authenticated');
-- CREATE POLICY "Users can update own resource files" ON storage.objects
--   FOR UPDATE USING (bucket_id = 'resources' AND auth.uid() = owner);
-- CREATE POLICY "Users can delete own resource files" ON storage.objects
--   FOR DELETE USING (bucket_id = 'resources' AND auth.uid() = owner);

-- ============================================================
-- RPC Functions
-- ============================================================

-- Increment download count (used by download button)
CREATE OR REPLACE FUNCTION public.increment_download_count(resource_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.resources SET download_count = download_count + 1 WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_tools_category ON public.tools(category);
CREATE INDEX idx_tools_likes ON public.tools(likes_count DESC);
CREATE INDEX idx_tools_created ON public.tools(created_at DESC);
CREATE INDEX idx_resources_category ON public.resources(category);
CREATE INDEX idx_resources_downloads ON public.resources(download_count DESC);
CREATE INDEX idx_resources_created ON public.resources(created_at DESC);
CREATE INDEX idx_topics_tool ON public.topics(tool_id);
CREATE INDEX idx_topics_created ON public.topics(created_at DESC);
CREATE INDEX idx_replies_topic ON public.replies(topic_id);
CREATE INDEX idx_replies_created ON public.replies(created_at DESC);
CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_checkins_user_date ON public.checkins(user_id, checkin_date);
