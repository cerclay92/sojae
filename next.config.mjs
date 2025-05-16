/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fntiuopyonutxkeeipsc.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
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
    serverExternalPackages: [],
  },
  async redirects() {
    return [
      {
        source: '/images/ojiseop.jpg',
        destination: 'https://picsum.photos/id/23/400/400',
        permanent: true,
      },
      {
        source: '/images/parkjaeshin.jpg',
        destination: 'https://picsum.photos/id/76/400/400',
        permanent: true,
      },
    ];
  },
};

export default nextConfig; 