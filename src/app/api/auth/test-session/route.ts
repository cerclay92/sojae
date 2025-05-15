import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    // NextAuth 세션 확인
    const session = await getServerSession();
    
    // Supabase 세션 확인
    const supabase = getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    
    // 모든 쿠키 확인
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    const cookieNames = allCookies.map(cookie => cookie.name);
    
    // 결과 반환
    return NextResponse.json({
      nextAuthSession: session ? true : false,
      nextAuthUser: session?.user || null,
      supabaseUser: user || null,
      cookies: cookieNames,
    });
  } catch (error) {
    console.error("세션 테스트 중 오류:", error);
    return NextResponse.json({ error: "세션 테스트 중 오류 발생" }, { status: 500 });
  }
} 