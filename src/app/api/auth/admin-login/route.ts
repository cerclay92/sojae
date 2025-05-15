import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";
import { encode } from "next-auth/jwt";

export async function POST(request: Request) {
  try {
    // 요청 본문에서 필요한 정보 추출
    const { email, token, refreshToken, userId } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: "이메일과 토큰이 필요합니다." },
        { status: 400 }
      );
    }

    // Supabase 서버 클라이언트 생성
    const supabase = getSupabaseServer();

    // 이메일로 관리자 검증
    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single();

    if (adminError || !admin) {
      console.error("관리자 권한 체크 오류:", adminError || "관리자가 아닙니다");
      return NextResponse.json(
        { error: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    // Supabase 토큰 검증
    const { data: { user }, error: tokenError } = await supabase.auth.getUser(token);
    
    if (tokenError || !user || user.email !== email) {
      console.error("토큰 검증 실패:", tokenError);
      return NextResponse.json(
        { error: "인증 토큰이 유효하지 않습니다." },
        { status: 401 }
      );
    }

    // NEXTAUTH_SECRET 환경 변수 확인
    if (!process.env.NEXTAUTH_SECRET) {
      console.error("NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { error: "서버 설정 오류: NEXTAUTH_SECRET이 정의되지 않았습니다." },
        { status: 500 }
      );
    }

    // NextAuth용 JWT 토큰 생성
    try {
      const nextAuthToken = await encode({
        token: {
          email: user.email,
          name: user.user_metadata?.name || user.email,
          role: "admin",
          sub: user.id,
          // Supabase 토큰 정보 포함
          supabaseToken: token,
          supabaseRefreshToken: refreshToken,
        },
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 60 * 60 * 24 * 7 // 7일 (초 단위)
      });

      // EasyNext 환경에서는 쿠키를 사용하지 않고 토큰만 반환
      // 클라이언트에서 로컬 스토리지나 세션 스토리지에 저장하도록 함
      return NextResponse.json({ 
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: "admin"
        },
        token: token,
        refreshToken: refreshToken,
        nextAuthToken: nextAuthToken  // 토큰 추가로 반환
      });
    } catch (encodeError: any) {
      console.error("JWT 토큰 생성 중 오류:", encodeError);
      return NextResponse.json(
        { error: "JWT 생성 오류: " + encodeError.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("관리자 로그인 처리 중 오류:", error);
    return NextResponse.json(
      { error: "내부 서버 오류: " + error.message },
      { status: 500 }
    );
  }
} 