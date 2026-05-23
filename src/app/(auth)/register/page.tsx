import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "注册",
  description: "注册创客集账户，开始分享你的创作",
};

function RegisterForm() {
  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full max-w-md mx-auto" />}>
      <AuthForm mode="register" />
    </Suspense>
  );
}

export default function RegisterPage() {
  return <RegisterForm />;
}
