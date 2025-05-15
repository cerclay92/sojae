import { NextRequest, NextResponse } from 'next/server';
import { getArticleById } from '@/features/magazine/api';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // params를 await으로 unwrap
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    // API 라우트에서는 getSupabaseServer를 사용할 수 없으므로 여기서 supabase 클라이언트를 생성
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // 게시글 조회
    const { data, error } = await supabase
      .from('articles')
      .select('*, categories(*)')
      .eq('id', id)
      .single();
    
    // 조회수 증가 (RPC 함수 호출)
    try {
      await supabase.rpc('increment_article_views', {
        article_id: id
      });
    } catch (e) {
      console.error('조회수 증가 실패:', e);
    }
    
    if (error) {
      if (error.code === 'PGRST116') {
        // 게시글을 찾을 수 없음
        return NextResponse.json(
          { error: '게시글을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: `게시글 조회 실패: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('게시글 API 오류:', error);
    
    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 