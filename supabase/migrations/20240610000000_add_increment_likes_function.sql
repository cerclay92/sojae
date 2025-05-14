-- 게시물 좋아요 증가 함수 추가 (20240610000000)
-- 사용자가 게시물에 좋아요를 눌렀을 때 해당 게시물의 좋아요 수를 1 증가시키는 함수입니다.

DO $$
BEGIN
  -- 함수가 이미 존재하는지 확인
  IF NOT EXISTS (
    SELECT FROM pg_proc
    JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
    WHERE proname = 'increment_post_likes'
    AND nspname = 'public'
  ) THEN
    -- 함수 생성
    EXECUTE '
    CREATE FUNCTION public.increment_post_likes(post_id UUID)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    BEGIN
      UPDATE public.posts
      SET likes = likes + 1
      WHERE id = post_id;
      
      -- 존재하지 않는 게시물 ID인 경우 처리
      IF NOT FOUND THEN
        RAISE EXCEPTION ''게시물을 찾을 수 없습니다. ID: %'', post_id;
      END IF;
    EXCEPTION
      WHEN OTHERS THEN
        -- 오류 처리 및 로깅
        RAISE NOTICE ''게시물 좋아요 업데이트 중 오류 발생: %'', SQLERRM;
        RAISE;
    END;
    $$;';
    
    RAISE NOTICE '게시물 좋아요 증가 함수가 생성되었습니다.';
  ELSE
    RAISE NOTICE '게시물 좋아요 증가 함수가 이미 존재합니다.';
  END IF;
END$$; 