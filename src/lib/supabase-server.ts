import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// 환경 변수에서 Supabase URL과 키 정의
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 환경 변수 확인
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '경고: Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요.'
  );
}

/**
 * 서버 컴포넌트용 Supabase 클라이언트 (서비스 롤 키 사용)
 * 데이터 조회 등 관리자 작업에 사용
 */
export function getSupabaseServer() {
  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

/**
 * EasyNext에 맞게 쿠키 없이 작동하는 서버 컴포넌트용 Supabase 클라이언트
 * 사용자 세션이 필요 없는 기본 데이터 조회에 사용
 */
export function getSupabaseServerNoAuth() {
  return createClient<Database>(
    supabaseUrl, 
    supabaseAnonKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

/**
 * 관리자 전용 Supabase 클라이언트
 * 관리자 권한이 필요한 데이터 작업에 사용
 */
export function getSupabaseAdmin() {
  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
} 