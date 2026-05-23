import type { Metadata } from "next";
import { UserContent } from "./client";

export const metadata: Metadata = {
  title: "用户中心",
  description: "管理你的积分、上传和账户信息",
};

export default function UserPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">用户中心</h1>
      <UserContent />
    </div>
  );
}
