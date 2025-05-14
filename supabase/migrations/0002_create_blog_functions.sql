-- 블로그 설정 관련 함수
-- 블로그 설정을 관리하기 위한 유틸리티 함수들을 생성합니다.

BEGIN;

-- 블로그 설정 가져오기 함수
CREATE OR REPLACE FUNCTION public.get_blog_setting(setting_key_param TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  setting_value TEXT;
BEGIN
  SELECT setting_value INTO setting_value
  FROM public.blog_settings
  WHERE setting_key = setting_key_param;
  
  RETURN setting_value;
END;
$$;

-- 블로그 설정 업데이트 함수 (관리자 전용)
CREATE OR REPLACE FUNCTION public.update_blog_setting(setting_key_param TEXT, new_value TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  success BOOLEAN;
BEGIN
  -- 관리자 권한 확인
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE email = auth.email() AND is_active = true
  ) THEN
    RAISE EXCEPTION '관리자 권한이 필요합니다.';
  END IF;

  -- 설정 업데이트
  UPDATE public.blog_settings
  SET setting_value = new_value
  WHERE setting_key = setting_key_param;

  GET DIAGNOSTICS success = ROW_COUNT;
  
  RETURN success > 0;
END;
$$;

-- 블로그 설정 초기화 함수 (이미 값이 있는 경우 변경하지 않음)
CREATE OR REPLACE FUNCTION public.initialize_missing_blog_settings()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 필수 설정이 없는 경우 기본값 추가
  IF NOT EXISTS (SELECT 1 FROM public.blog_settings WHERE setting_key = 'blog_title') THEN
    INSERT INTO public.blog_settings (id, setting_key, setting_value, description)
    VALUES (1, 'blog_title', '서재, 사람을 읽다', '블로그 제목');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.blog_settings WHERE setting_key = 'blog_description') THEN
    INSERT INTO public.blog_settings (id, setting_key, setting_value, description)
    VALUES (2, 'blog_description', '책과 사람, 그리고 만남을 온라인 공간에서 이룬 블로그 생태계', '블로그 설명');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.blog_settings WHERE setting_key = 'comment_approval_required') THEN
    INSERT INTO public.blog_settings (id, setting_key, setting_value, description)
    VALUES (3, 'comment_approval_required', 'true', '댓글 승인 여부');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.blog_settings WHERE setting_key = 'posts_per_page') THEN
    INSERT INTO public.blog_settings (id, setting_key, setting_value, description)
    VALUES (4, 'posts_per_page', '10', '페이지당 게시글 수');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.blog_settings WHERE setting_key = 'allow_guest_comments') THEN
    INSERT INTO public.blog_settings (id, setting_key, setting_value, description)
    VALUES (5, 'allow_guest_comments', 'true', '비회원 댓글 허용 여부');
  END IF;
END;
$$;

-- 초기 데이터 추가 실행 (누락된 설정이 있을 경우에만)
SELECT public.initialize_missing_blog_settings();

COMMIT; 