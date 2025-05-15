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
    // 절대 URL 생성을 위한 기본 URL 설정
    const baseUrl = process.env.NEXTAUTH_URL || 
                   process.env.NEXT_PUBLIC_API_URL || 
                   "http://localhost:3000";
    
    const loginUrl = new URL("/admin/login", baseUrl);
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error("로그아웃 처리 중 오류:", error);
    
    const baseUrl = process.env.NEXTAUTH_URL || 
                   process.env.NEXT_PUBLIC_API_URL || 
                   "http://localhost:3000";
    
    const adminUrl = new URL("/admin", baseUrl);
    return NextResponse.redirect(adminUrl);
  }
}

// POST 요청 처리도 동일하게 수행
export async function POST() {
  return GET();
} 