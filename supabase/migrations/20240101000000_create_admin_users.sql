-- admin_users 테이블 생성
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 관리자 계정 추가 (이미 있으면 업데이트)
INSERT INTO admin_users (email, name, is_active)
VALUES ('pjs@admin.com', '관리자', TRUE)
ON CONFLICT (email) 
DO UPDATE SET 
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active,
  updated_at = NOW(); 