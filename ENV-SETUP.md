# 환경 변수 설정 가이드

서재 프로젝트를 올바르게 실행하려면 다음 환경 변수를 설정해야 합니다.

## 필수 환경 변수

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API URL (선택 사항)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Supabase 환경 변수 찾는 방법

1. [Supabase 대시보드](https://app.supabase.com/)에 로그인합니다.
2. 프로젝트를 선택합니다.
3. 왼쪽 사이드바에서 "프로젝트 설정"을 클릭합니다.
4. "API" 섹션에서 다음 값을 찾을 수 있습니다:
   - URL: `NEXT_PUBLIC_SUPABASE_URL`에 사용
   - anon/public: `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 사용

## 개발 환경에서 사용하기

개발 서버를 시작하기 전에 위의 환경 변수가 올바르게 설정되었는지 확인하세요.

```bash
npm run dev
```

## 프로덕션 환경에서 사용하기

프로덕션 배포에서는 Vercel 대시보드의 "환경 변수" 섹션에 동일한 환경 변수를 설정해야 합니다.

## 문제 해결

- "Invalid URL" 오류가 발생하는 경우 `NEXT_PUBLIC_SUPABASE_URL`이 올바르게 설정되었는지 확인하세요.
- 인증 오류가 발생하는 경우 `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 올바른지 확인하세요.
- 환경 변수가 인식되지 않는 경우 개발 서버를 다시 시작해보세요. 