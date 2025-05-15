-- 스토리지 버킷 생성 - 이미지 업로드용
-- 이미 생성된 uploads 테이블과 연동하여 이미지 스토리지 버킷을 생성합니다.
-- 이 마이그레이션은 멱등성을 가집니다 (여러 번 실행해도 안전함).

BEGIN;

-- 이미지 버킷이 이미 존재하는지 확인
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- 버킷 존재 확인
  SELECT EXISTS (
    SELECT 1
    FROM storage.buckets
    WHERE name = 'images'
  ) INTO bucket_exists;

  -- 버킷이 존재하지 않으면 생성
  IF NOT bucket_exists THEN
    RAISE NOTICE 'Creating storage bucket: images';
    
    INSERT INTO storage.buckets
      (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
    VALUES
      (
        'images', 
        'images', 
        TRUE, 
        FALSE, 
        20971520, -- 20MB 제한
        '{image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml}'
      );
    
    -- 1. Public Read Access - 모든 사용자가 읽기 가능
    INSERT INTO storage.policies (name, bucket_id, operation, definition, actions)
    VALUES (
      'Public Read Access',
      'images',
      'SELECT',
      'TRUE',
      '{"select"}'
    );
    
    -- 2. Auth Users Upload Access - 인증된 사용자만 업로드 가능
    INSERT INTO storage.policies (name, bucket_id, operation, definition, actions)
    VALUES (
      'Auth Users Upload Access',
      'images',
      'INSERT',
      'auth.role() = ''authenticated''',
      '{"insert"}'
    );
    
    -- 3. Auth Users Delete Access - 인증된 사용자가 자신의 파일만 삭제 가능
    INSERT INTO storage.policies (name, bucket_id, operation, definition, actions)
    VALUES (
      'Auth Users Delete Access',
      'images',
      'DELETE',
      'auth.role() = ''authenticated''',
      '{"delete"}'
    );
    
    RAISE NOTICE 'Successfully created storage bucket and policies.';
  ELSE
    RAISE NOTICE 'Storage bucket "images" already exists. Checking policies...';
    
    -- 정책이 없는 경우 추가
    IF NOT EXISTS (SELECT 1 FROM storage.policies WHERE bucket_id = 'images' AND operation = 'SELECT') THEN
      INSERT INTO storage.policies (name, bucket_id, operation, definition, actions)
      VALUES (
        'Public Read Access',
        'images',
        'SELECT',
        'TRUE',
        '{"select"}'
      );
      RAISE NOTICE 'Added Public Read Access policy.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM storage.policies WHERE bucket_id = 'images' AND operation = 'INSERT') THEN
      INSERT INTO storage.policies (name, bucket_id, operation, definition, actions)
      VALUES (
        'Auth Users Upload Access',
        'images',
        'INSERT',
        'auth.role() = ''authenticated''',
        '{"insert"}'
      );
      RAISE NOTICE 'Added Auth Users Upload Access policy.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM storage.policies WHERE bucket_id = 'images' AND operation = 'DELETE') THEN
      INSERT INTO storage.policies (name, bucket_id, operation, definition, actions)
      VALUES (
        'Auth Users Delete Access',
        'images',
        'DELETE',
        'auth.role() = ''authenticated''',
        '{"delete"}'
      );
      RAISE NOTICE 'Added Auth Users Delete Access policy.';
    END IF;
  END IF;
  
EXCEPTION
  WHEN others THEN
    RAISE EXCEPTION 'Error creating storage bucket: %', SQLERRM;
END $$;

COMMIT;

-- 참고: 스토리지 정책은 Supabase 콘솔에서 수동으로 설정해야 합니다.
-- 버킷을 생성한 후 다음 정책을 추가하세요:
-- 1. Public Read Access - 모든 사용자가 읽기 가능
-- 2. Auth Users Upload Access - 인증된 사용자만 업로드 가능
-- 3. Auth Users Delete Access - 인증된 사용자가 자신의 파일만 삭제 가능 