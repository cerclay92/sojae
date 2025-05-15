-- admin_users 테이블에 is_active 컬럼 추가
ALTER TABLE IF EXISTS admin_users
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 기존 관리자 계정 활성화 상태 설정
UPDATE admin_users
SET is_active = TRUE
WHERE email = 'pjs@admin.com'; 