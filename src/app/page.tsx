import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';
import { getPosts, getPopularPosts } from '@/features/magazine/api';
import { PostList } from '@/features/magazine/components/post-list';
import { CategoryList } from '@/features/magazine/components/category-list';
import { Hero } from '@/features/magazine/components/hero';
import { PopularPosts } from '@/features/magazine/components/popular-posts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
};

export default async function HomePage() {
  let posts = [];
  let popularPosts = [];
  
  try {
    // 최신 게시물 가져오기
    posts = await getPosts({ limit: 9 });
    // 인기 게시물 가져오기
    popularPosts = await getPopularPosts(5);
  } catch (error) {
    console.error('홈페이지 데이터 로드 중 오류 발생:', error);
    // 오류 발생 시 빈 배열 사용 (이미 getPosts, getPopularPosts 내부에서 에러 처리됨)
  }
  
  // 환경 변수가 설정되었는지 확인
  const isEnvConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return (
    <MainLayout>
      {!isEnvConfigured && process.env.NODE_ENV === 'development' && (
        <div className="container py-2 px-3 sm:px-4 md:py-4">
          <Alert variant="warning" className="bg-amber-50">
            <InfoIcon className="h-4 w-4 text-amber-600" />
            <AlertTitle>환경 변수 설정 필요</AlertTitle>
            <AlertDescription>
              Supabase 환경 변수가 설정되지 않았습니다. <Link href="/setup" className="font-medium underline text-amber-600">설정 페이지</Link>에서 환경 변수를 구성하세요.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <Hero />
      
      {/* 카테고리 섹션 - 배경색 제거 */}
      <section className="py-12 md:py-20">
        <div className="container">
          <CategoryList />
        </div>
      </section>
      
      <section className="container py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 md:mb-8">최신 글</h2>
            <PostList posts={posts} />
          </div>
          <div className="w-full lg:w-80 xl:w-96">
            <PopularPosts posts={popularPosts} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 