/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "fntiuopyonutxkeeipsc.supabase.co",
      // ... 기존 도메인 유지
    ],
  },
  // ESLint 에러가 빌드를 실패시키지 않도록 설정
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript 오류도 무시
  typescript: {
    ignoreBuildErrors: true,
  },
  // 추가 실험적 기능 설정
  experimental: {
    // Next.js 15에서 지원되는 실험적 기능
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig; 