-- 블로그 설정 테이블 생성
-- 블로그 관련 설정값들을 저장하는 테이블을 생성합니다.

BEGIN;

-- 블로그 설정 테이블 RLS 정책 설정
-- 이미 존재하는 블로그 설정 테이블에 정책을 적용합니다.

-- 기존 블로그 설정 테이블에 대한 RLS 활성화
ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;

-- 기존 정책 제거(있는 경우에만)
DROP POLICY IF EXISTS "Allow admins to manage blog_settings" ON public.blog_settings;
DROP POLICY IF EXISTS "Allow all users to read blog_settings" ON public.blog_settings;

-- 관리자만 blog_settings 테이블에 액세스할 수 있는 정책
CREATE POLICY "Allow admins to manage blog_settings" 
ON public.blog_settings 
FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.email()
  )
);

-- 모든 사용자가 블로그 설정을 읽을 수 있는 정책
CREATE POLICY "Allow all users to read blog_settings" 
ON public.blog_settings 
FOR SELECT 
USING (true);

-- updated_at 자동 업데이트 트리거 (테이블에 이미 해당 필드가 있는 경우)
CREATE OR REPLACE FUNCTION public.update_blog_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 이미 트리거가 존재하지 않는 경우에만 생성
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_blog_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_blog_settings_updated_at
    BEFORE UPDATE ON public.blog_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_blog_settings_updated_at();
  END IF;
END $$;

COMMIT; 