import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "登录",
  description: "登录创客集账户，继续你的创作之旅",
};

function LoginForm() {
  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full max-w-md mx-auto" />}>
      <AuthForm mode="login" />
    </Suspense>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
