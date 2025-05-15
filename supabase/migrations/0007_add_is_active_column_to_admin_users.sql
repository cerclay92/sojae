-- 관리자 테이블에 활성화 상태 컬럼 추가 마이그레이션
-- admin_users 테이블에 is_active 컬럼을 추가하여 계정 활성화 여부를 관리합니다

-- is_active 컬럼이 존재하지 않는 경우 추가
ALTER TABLE IF EXISTS admin_users 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 기존 관리자 계정 활성화 상태 설정
UPDATE admin_users 
SET is_active = TRUE 
WHERE email = 'pjs@admin.com';

-- updated_at 컬럼을 자동으로 갱신하는 트리거 함수 생성/갱신
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성 (이미 존재하면 에러를 무시하는 함수로 래핑)
DO $$
BEGIN
  -- 트리거가 존재하지 않을 경우에만 생성
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_admin_users_updated_at') THEN
    EXECUTE 'CREATE TRIGGER set_admin_users_updated_at
             BEFORE UPDATE ON admin_users
             FOR EACH ROW
             EXECUTE FUNCTION set_updated_at()';
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- 무시
END $$; 