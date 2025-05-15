import { getServerSession } from "next-auth";
import { getSupabaseServer } from "./supabase-server";

/**
 * 관리자 권한 확인 함수
 * 세션 검증 및 관리자 권한 확인
 * @returns {Promise<{isAdmin: boolean, user?: any, admin?: any, error?: string, shouldRedirect?: boolean}>}
 */
export async function checkAdminAccess() {
  try {
    // 1. NextAuth 세션 확인
    const session = await getServerSession();
    if (!session?.user) {
      console.log("Server", "NextAuth 세션 없음");
      return { isAdmin: false, error: "세션이 없습니다. 로그인이 필요합니다.", shouldRedirect: true };
    }
    
    // 2. Supabase 세션 확인 (NextAuth 세션에서 저장된 토큰 사용)
    const supabaseToken = (session as any)?.token?.supabaseToken;
    let user = null;
    
    // 토큰이 있으면 사용자 정보 가져오기
    if (supabaseToken) {
      const supabase = getSupabaseServer();
      try {
        const { data, error } = await supabase.auth.getUser(supabaseToken);
        
        if (!error) {
          user = data.user;
        } else {
          console.log("Server", "Supabase 토큰 검증 실패:", error);
        }
      } catch (tokenError) {
        console.error("Server", "Supabase 토큰 검증 중 오류:", tokenError);
      }
    }
    
    // 세션에 이메일이 있으면 사용
    if (!user && session.user.email) {
      user = { email: session.user.email };
    }
    
    if (!user?.email) {
      console.log("Server", "Supabase 사용자 없음");
      return { isAdmin: false, error: "인증 정보가 부족합니다.", shouldRedirect: true };
    }
    
    // 3. 관리자 DB 확인
    const adminSupabase = getSupabaseServer();
    try {
      const { data: admin, error: adminError } = await adminSupabase
        .from("admin_users")
        .select("*")
        .eq("email", user.email)
        .eq("is_active", true)
        .single();
      
      if (adminError || !admin) {
        console.log("Server", "관리자 권한 없음", adminError);
        return { isAdmin: false, error: "관리자 권한이 없습니다.", shouldRedirect: true };
      }
      
      return { user, admin, isAdmin: true, shouldRedirect: false };
    } catch (dbError) {
      console.error("Server", "관리자 DB 조회 중 오류:", dbError);
      return { isAdmin: false, error: "관리자 DB 조회 중 오류가 발생했습니다.", shouldRedirect: true };
    }
  } catch (error) {
    console.error("Server", "관리자 인증 체크 중 오류 발생:", error);
    return { isAdmin: false, error: "인증 처리 중 오류가 발생했습니다.", shouldRedirect: true };
  }
}

/**
 * 관리자 페이지 접근 체크 함수
 * EasyNext 환경에서는 리다이렉트 없이 결과만 반환
 */
export async function protectAdminRoute() {
  const authResult = await checkAdminAccess();
  return authResult;
}

/**
 * 클라이언트 컴포넌트에서 세션 유효성 체크를 위한 서버 액션
 */
export async function checkSession() {
  const session = await getServerSession();
  return !!session?.user;
} 