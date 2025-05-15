import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    // Supabase 로그아웃 처리
    const supabase = getSupabaseServer();
    await supabase.auth.signOut();

    // Next-Auth 세션 쿠키 삭제
    const cookieStore = await cookies();
    cookieStore.delete("next-auth.session-token");
    cookieStore.delete("__Secure-next-auth.session-token");

    // 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/admin/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  } catch (error) {
    console.error("로그아웃 처리 중 오류:", error);
    return NextResponse.redirect(new URL("/admin", process.env.NEXTAUTH_URL || "http://localhost:3000"));
  }
}

// POST 요청 처리도 동일하게 수행
export async function POST() {
  return GET();
} 