import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase';

// 환경 변수에서 Supabase URL과 키를 가져옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNTUxOTgxOCwiZXhwIjoxOTMxMDk1ODE4fQ.Y0FRiLg1pScbCUINDSryQQ8AdMQGcN5dXgZZm5GPB_8';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 환경 변수가 설정되었는지 확인합니다.
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn(
    '경고: Supabase 환경 변수가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정해주세요.'
  );
}

// 서버용 일반 Supabase 클라이언트를 생성합니다.
export const supabaseServer = createClient<Database>(supabaseUrl, supabaseAnonKey);

// 서버용 관리자 권한 Supabase 클라이언트를 생성합니다.
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * 일반 Supabase 서버 클라이언트를 안전하게 반환하는 함수
 */
export function getSupabaseServer() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Supabase 환경 변수가 설정되지 않았습니다. 실제 데이터를 가져올 수 없습니다.');
  }
  return supabaseServer;
}

/**
 * 관리자 권한 Supabase 서버 클라이언트를 안전하게 반환하는 함수
 */
export function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Supabase 관리자 환경 변수가 설정되지 않았습니다. 관리자 기능을 사용할 수 없습니다.');
  }
  return supabaseAdmin;
} 