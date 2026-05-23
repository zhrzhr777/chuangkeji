export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  points: number;
  role: "user" | "admin";
  vip_level: "free" | "basic" | "pro";
  vip_until: string | null;
  created_at: string;
}

export interface Ad {
  id: string;
  title: string;
  image_url: string | null;
  link_url: string | null;
  position: "header" | "sidebar" | "between" | "footer";
  is_active: boolean;
  clicks: number;
  created_at: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pricing: "免费" | "付费" | "免费增值";
  icon_url: string | null;
  creator_id: string;
  likes_count: number;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  featured_until: string | null;
  created_at: string;
  profiles?: Profile;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  file_path: string;
  file_size: number;
  file_type: string;
  points_required: number;
  download_count: number;
  creator_id: string;
  status: "pending" | "approved" | "rejected";
  auto_update: boolean;
  source_url: string | null;
  last_checked: string | null;
  created_at: string;
  profiles?: Profile;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: "download" | "upload_reward" | "daily_checkin" | "admin_grant";
  description: string;
  created_at: string;
}

export interface Checkin {
  id: string;
  user_id: string;
  checkin_date: string;
  points_earned: number;
  created_at: string;
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  tool_id: string | null;
  author_id: string;
  reply_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  tools?: Tool;
}

export interface Reply {
  id: string;
  topic_id: string;
  content: string;
  author_id: string;
  parent_id: string | null;
  created_at: string;
  profiles?: Profile;
  children?: Reply[];
}

export const TOOL_CATEGORIES = [
  "AI工具",
  "设计工具",
  "开发工具",
  "效率工具",
  "学习资源",
  "其他",
] as const;

export const RESOURCE_CATEGORIES = [
  "模板素材",
  "插件扩展",
  "电子书",
  "视频教程",
  "源码项目",
  "其他",
] as const;

export const PRICING_OPTIONS = ["免费", "付费", "免费增值"] as const;
