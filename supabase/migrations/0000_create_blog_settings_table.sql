-- blog_settings 테이블 생성
-- 블로그 관련 설정값들을 저장하는 테이블을 생성합니다.

BEGIN;

-- blog_settings 테이블 생성
CREATE TABLE IF NOT EXISTS public.blog_settings (
  id SERIAL PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 기본 설정값 추가
INSERT INTO public.blog_settings (setting_key, setting_value, description)
VALUES 
  ('blog_title', '서재, 사람을 읽다', '블로그 제목'),
  ('blog_description', '책과 사람, 그리고 만남을 온라인 공간에서 이룬 블로그 생태계', '블로그 설명'),
  ('comment_approval_required', 'true', '댓글 승인 여부'),
  ('posts_per_page', '10', '페이지당 게시글 수'),
  ('allow_guest_comments', 'true', '비회원 댓글 허용 여부')
ON CONFLICT (setting_key) DO NOTHING;

COMMIT; 