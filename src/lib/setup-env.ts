'use server';

import * as fs from 'fs';
import * as path from 'path';

/**
 * 개발 환경에서만 실행되는 환경 변수 설정 도우미 함수
 */
export async function checkAndSetupEnv() {
  if (process.env.NODE_ENV !== 'development') {
    return { success: false, message: '개발 환경에서만 사용 가능합니다.' };
  }

  const envPath = path.join(process.cwd(), '.env.local');

  // .env.local 파일이 이미 존재하는지 확인
  if (fs.existsSync(envPath)) {
    return { success: true, message: '.env.local 파일이 이미 존재합니다.' };
  }

  try {
    // 기본 환경 변수 템플릿
    const envContent = `# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API URL (선택 사항)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
`;

    // .env.local 파일 생성
    fs.writeFileSync(envPath, envContent, 'utf8');
    
    return { 
      success: true, 
      message: '.env.local 파일이 생성되었습니다. Supabase URL과 키를 설정해주세요.' 
    };
  } catch (error) {
    console.error('.env.local 파일 생성 중 오류 발생:', error);
    return { 
      success: false, 
      message: `.env.local 파일 생성 중 오류가 발생했습니다: ${error}` 
    };
  }
} 