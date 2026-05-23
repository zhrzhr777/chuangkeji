import { type MiddlewareConfig, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: Request) {
  // Type assertion is needed because Next.js middleware receives standard Request
  return await updateSession(request as any);
}

export const config: MiddlewareConfig = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
