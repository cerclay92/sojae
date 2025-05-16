-- blog_settings RPC 함수 생성
-- update_blog_setting 함수를 생성하여 블로그 설정 업데이트 기능을 구현합니다.

BEGIN;

-- 설정 업데이트 함수 생성
CREATE OR REPLACE FUNCTION public.update_blog_setting(
  setting_key_param TEXT,
  new_value TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result BOOLEAN;
BEGIN
  -- 설정 키가 있는지 확인하고 업데이트
  UPDATE public.blog_settings
  SET 
    setting_value = new_value,
    updated_at = now()
  WHERE setting_key = setting_key_param;
  
  -- 영향받은 행이 있는지 확인
  GET DIAGNOSTICS result = ROW_COUNT;
  
  -- 존재하지 않는 경우 새로 생성
  IF result = 0 THEN
    INSERT INTO public.blog_settings (setting_key, setting_value, updated_at)
    VALUES (setting_key_param, new_value, now());
    return TRUE;
  END IF;
  
  RETURN result > 0;
END;
$$;

-- 함수에 대한 권한 설정
GRANT EXECUTE ON FUNCTION public.update_blog_setting TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_blog_setting TO service_role;

COMMIT; 