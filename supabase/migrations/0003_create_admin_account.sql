-- 관리자 계정 생성
-- 기본 관리자 계정을 생성하고 권한을 부여합니다.

BEGIN;

-- 관리자 계정 생성 (Supabase Auth)
DO $$
DECLARE
  admin_email TEXT := 'pjs@admin.com';
  admin_password TEXT := 'password';
  admin_uid UUID;
BEGIN
  -- 이미 사용자가 존재하는지 확인
  SELECT id INTO admin_uid FROM auth.users WHERE email = admin_email;

  -- 사용자가 없으면 신규 생성
  IF admin_uid IS NULL THEN
    INSERT INTO auth.users (
      email, 
      encrypted_password, 
      email_confirmed_at, 
      confirmation_sent_at,
      created_at,
      updated_at,
      role
    ) VALUES (
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      NOW(),
      'authenticated'
    ) RETURNING id INTO admin_uid;

    -- 사용자 메타데이터 추가 (필요시)
    -- INSERT INTO auth.users_metadata (id, user_id, created_at, updated_at, metadata)
    -- VALUES (
    --   gen_random_uuid(),
    --   admin_uid,
    --   NOW(),
    --   NOW(),
    --   jsonb_build_object('name', '관리자', 'role', 'admin')
    -- );
  END IF;

  -- admin_users 테이블 확인 및 추가
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'is_active'
  ) THEN
    INSERT INTO public.admin_users (email, is_active)
    VALUES (admin_email, TRUE)
    ON CONFLICT (email) DO UPDATE
    SET is_active = TRUE;
  ELSE
    INSERT INTO public.admin_users (email)
    VALUES (admin_email)
    ON CONFLICT (email) DO NOTHING;
  END IF;
  
  RAISE NOTICE '관리자 계정이 성공적으로 생성되었습니다. 이메일: %, 비밀번호: %', admin_email, admin_password;
END $$;

COMMIT; 