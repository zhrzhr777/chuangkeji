import type { Metadata } from "next";
import Link from "next/link";
import { Check, Crown, Coins, Download, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "VIP 会员",
  description: "升级 VIP 会员，享受免积分下载、专属徽章等特权",
};

const plans = [
  {
    name: "免费版",
    level: "free",
    price: "¥0",
    period: "永久",
    icon: Zap,
    features: [
      "浏览所有工具和资源",
      "每天签到 +10 积分",
      "上传资源获得积分",
      "参与社区讨论",
      "积分兑换下载",
    ],
    cta: "当前方案",
    popular: false,
  },
  {
    name: "基础会员",
    level: "basic",
    price: "¥19.9",
    period: "月",
    icon: Star,
    features: [
      "免费版全部权益",
      "每月 10 次免积分下载",
      "专属基础会员徽章",
      "资源优先展示",
      "下载速度不受限",
    ],
    cta: "即将上线",
    popular: false,
  },
  {
    name: "专业会员",
    level: "pro",
    price: "¥49.9",
    period: "月",
    icon: Crown,
    features: [
      "基础版全部权益",
      "无限次免积分下载",
      "专属 Pro 金色徽章",
      "首页推荐位优先",
      "专属客服通道",
      "工具推广折扣",
    ],
    cta: "即将上线",
    popular: true,
  },
];

export default function VIPPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <Crown className="h-12 w-12 mx-auto mb-4 text-amber-500" />
        <h1 className="text-4xl font-bold mb-3">升级会员，解锁更多</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          选择适合你的方案，享受更优质的创作者体验
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card key={plan.level} className={`relative ${plan.popular ? "border-primary shadow-lg scale-[1.02]" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">最受欢迎</Badge>
                </div>
              )}
              <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-3">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${plan.popular ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : plan.level === "free" ? "outline" : "secondary"}
                  disabled={plan.cta === "即将上线"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-10">
        支付功能即将接入，敬请期待。如需推广工具或投放广告，请联系管理员。
      </p>
    </div>
  );
}
