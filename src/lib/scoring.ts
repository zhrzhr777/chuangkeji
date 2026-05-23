// 评分工具函数（前端展示用，实际计算由 PostgreSQL 函数完成）

export interface ScoreBreakdown {
  clickScore: number;
  likeScore: number;
  replyScore: number;
  timeScore: number;
  repScore: number;
  total: number;
}

export function explainScore(tool: {
  click_count: number;
  likes_count: number;
  reply_count: number;
  created_at: string;
}): ScoreBreakdown {
  const daysOld = Math.max(0, (Date.now() - new Date(tool.created_at).getTime()) / 86400000);
  const timeScore = Math.max(0, 1 - daysOld / 365);

  const clickScore = Math.min(tool.click_count / 100, 1);
  const likeScore = Math.min(tool.likes_count / 50, 1);
  const replyScore = Math.min(tool.reply_count / 20, 1);
  const repScore = 0.1; // placeholder

  const total = clickScore * 0.30 + likeScore * 0.25 + replyScore * 0.20 + timeScore * 0.15 + repScore * 0.10;

  return {
    clickScore: Math.round(clickScore * 100),
    likeScore: Math.round(likeScore * 100),
    replyScore: Math.round(replyScore * 100),
    timeScore: Math.round(timeScore * 100),
    repScore: Math.round(repScore * 100),
    total: Math.round(total * 100),
  };
}
