import { getSupabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseAdmin();
    const { email, password } = await request.json();
    
    // 1. 먼저 Supabase Auth에 사용자 생성
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // 이메일 확인 절차 건너뛰기
      user_metadata: { role: 'admin' },
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // 2. 생성된 사용자를 관리자 테이블에 추가
    const { data: adminData, error: adminError } = await supabase
      .rpc('add_admin_user', { admin_email: email });
    
    if (adminError) {
      // 사용자는 생성되었지만 관리자 권한 부여 실패
      console.error('관리자 테이블 추가 실패:', adminError);
      return NextResponse.json(
        { 
          error: adminError.message,
          note: '사용자 계정은 생성되었지만 관리자 권한 설정에 실패했습니다.'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '관리자 계정이 성공적으로 생성되었습니다.',
      userId: data.user?.id,
      adminId: adminData
    });
    
  } catch (error) {
    console.error('관리자 계정 생성 실패:', error);
    return NextResponse.json(
      { error: '관리자 계정 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 