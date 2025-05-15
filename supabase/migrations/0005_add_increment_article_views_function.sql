-- 게시글 조회수를 증가시키는 함수 생성
-- 함수가 이미 존재하면 대체하고, 존재하지 않으면 새로 생성합니다.
-- 입력: article_id - 조회수를 증가시킬 게시글의 ID
-- 출력: void - 반환값 없음

DO $$
BEGIN
  -- 함수가 이미 존재하는지 확인
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc
    JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
    WHERE proname = 'increment_article_views'
    AND pg_namespace.nspname = 'public'
  ) THEN
    -- 함수가 없을 경우 CREATE, 있을 경우 OR REPLACE로 대체
    RAISE NOTICE 'Creating increment_article_views function';
  ELSE
    RAISE NOTICE 'Replacing increment_article_views function';
  END IF;
  
  -- 함수 정의
  CREATE OR REPLACE FUNCTION increment_article_views(article_id INTEGER)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $func$
  BEGIN
    -- 조회수를 증가시키는 UPDATE 쿼리
    -- COALESCE를 사용하여 views가 NULL인 경우 0으로 처리
    UPDATE articles
    SET views = COALESCE(views, 0) + 1
    WHERE id = article_id;
    
    -- 오류 처리
    EXCEPTION
      WHEN undefined_table THEN
        RAISE EXCEPTION '테이블이 존재하지 않습니다: articles';
      WHEN undefined_column THEN
        RAISE EXCEPTION '컬럼이 존재하지 않습니다: views';
      WHEN others THEN
        RAISE EXCEPTION '조회수 증가 중 오류가 발생했습니다: %', SQLERRM;
  END;
  $func$;
END
$$; 