import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    // URL에서 리다이렉트 경로 가져오기
    const url = new URL(request.url);
    const callbackUrl = url.searchParams.get("callbackUrl") || "/admin/login";
    
    // Supabase 로그아웃 처리
    const supabase = getSupabaseServer();
    await supabase.auth.signOut();

    // 모든 쿠키 삭제
    const cookieStore = cookies();
    
    // 모든 쿠키 목록 가져오기
    const allCookies = cookieStore.getAll();
    
    // NextAuth 관련 쿠키 삭제
    const nextAuthCookies = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.callback-url",
      "next-auth.csrf-token"
    ];
    
    nextAuthCookies.forEach(name => {
      cookieStore.delete(name);
    });
    
    // Supabase 관련 쿠키 삭제
    allCookies.forEach(cookie => {
      if (cookie.name.includes("sb-") || 
          cookie.name.includes("supabase") || 
          cookie.name.startsWith("__Host-next-auth")) {
        cookieStore.delete(cookie.name);
      }
    });
    
    // 추가 Supabase 쿠키 명시적 삭제
    const supabaseCookies = [
      "sb-access-token",
      "sb-refresh-token",
      "supabase-auth-token"
    ];
    
    supabaseCookies.forEach(name => {
      cookieStore.delete(name);
    });
    
    // 캐시 방지를 위한 타임스탬프 추가
    const timestamp = new Date().getTime();
    const loginUrl = `/admin/login?t=${timestamp}`;
    
    // Cache-Control 헤더 설정으로 캐시 방지
    return new NextResponse(null, {
      status: 307,
      headers: {
        Location: loginUrl,
        "Cache-Control": "no-store, max-age=0, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    console.error("로그아웃 처리 중 오류:", error);
    
    // 오류가 발생해도 로그인 페이지로 리다이렉트 (캐시 방지)
    const timestamp = new Date().getTime();
    const loginUrl = `/admin/login?error=logout_failed&t=${timestamp}`;
    
    return NextResponse.redirect(loginUrl);
  }
}

// POST 요청 처리도 동일하게 수행
export async function POST(request: Request) {
  return GET(request);
} 