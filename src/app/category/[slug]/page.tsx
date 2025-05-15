import { MainLayout } from '@/components/layouts/main-layout';
import { getPostCount, getPostsByCategory } from '@/features/magazine/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CATEGORY_MAP, CATEGORY_ID_TO_NUMERIC } from '@/constants/category';
import { PostList } from '@/features/magazine/components/post-list';
import { PopularPosts } from '@/features/magazine/components/popular-posts';
import { CategoryHeader } from '@/features/magazine/components/category-header';
import { getPopularPosts } from '@/features/magazine/api';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const categoryId = decodeURIComponent(resolvedParams.slug);
  const category = CATEGORY_MAP[categoryId as keyof typeof CATEGORY_MAP];
  
  if (!category) {
    return {
      title: '카테고리를 찾을 수 없습니다.',
    };
  }
  
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categoryId = decodeURIComponent(resolvedParams.slug);
  const category = CATEGORY_MAP[categoryId as keyof typeof CATEGORY_MAP];
  
  if (!category) {
    notFound();
  }
  
  let posts = [];
  let postCount = 0;
  let popularPosts = [];
  
  try {
    posts = await getPostsByCategory(categoryId);
    postCount = await getPostCount(categoryId) || 0;
    popularPosts = await getPopularPosts(5);
  } catch (error) {
    console.error(`카테고리(${categoryId}) 데이터 로드 중 오류 발생:`, error);
    // 오류 발생 시 빈 배열 사용 (이미 API 함수 내부에서 에러 처리됨)
  }
  
  return (
    <MainLayout>
      <CategoryHeader 
        category={category}
        postCount={postCount}
      />
      
      <section className="container py-12">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <PostList posts={posts} variant="list" showViewMore={false} />
          </div>
          <div className="w-full md:w-80 lg:w-96">
            <PopularPosts posts={popularPosts} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 