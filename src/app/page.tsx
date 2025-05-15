import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';
import { getPosts, getPopularPosts } from '@/features/magazine/api';
import { PostList } from '@/features/magazine/components/post-list';
import { CategoryList } from '@/features/magazine/components/category-list';
import { Hero } from '@/features/magazine/components/hero';
import { PopularPosts } from '@/features/magazine/components/popular-posts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, ArrowRight, BookOpen, Star, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSupabaseServer } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
};

// 샘플 게시글 데이터
const sampleArticles = [
  {
    id: '1',
    title: '에세이: 개인적인 경험과 생각을 담은 글',
    excerpt: '개인적인 경험과 생각을 담은 글로, 다양한 주제에 대한 에세이를 담고 있습니다.',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    featured_image: 'https://picsum.photos/id/24/800/600',
    category: '에세이'
  },
  {
    id: '2',
    title: '인문학: 사고의 틀을 넓히는 글',
    excerpt: '인문학적 사고와 통찰을 담은 글로, 철학, 역사, 문학 등 다양한 인문학 주제를 다룹니다.',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    featured_image: 'https://picsum.photos/id/42/800/600',
    category: '인문학'
  },
  {
    id: '3',
    title: '문화: 현대사회 트렌드에 관한 분석',
    excerpt: '문화적 현상과 트렌드에 관한 분석과 해석을 담은 글입니다.',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    featured_image: 'https://picsum.photos/id/68/800/600',
    category: '문화'
  },
  {
    id: '4',
    title: '상담 사례: 다양한 심리 상담 이야기',
    excerpt: '다양한 심리 상담 사례와 해석, 그리고 조언을 담은 글입니다.',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    featured_image: 'https://picsum.photos/id/96/800/600',
    category: '상담'
  },
  {
    id: '5',
    title: '인터뷰: 분야의 전문가들과의 대화',
    excerpt: '다양한 분야의 전문가들과 진행한 인터뷰 내용을 담은 글입니다.',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    featured_image: 'https://picsum.photos/id/100/800/600',
    category: '인터뷰'
  }
];

// 샘플 인기 게시글 데이터
const samplePopularPosts = [
  {
    id: '1',
    title: '에세이: 개인적인 경험과 생각을 담은 글',
    excerpt: '개인적인 경험과 생각을 담은 글로, 다양한 주제에 대한 에세이를 담고 있습니다.',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    thumbnail_url: 'https://picsum.photos/id/24/800/600',
    category: '에세이',
    likes: 120,
    slug: 'essay-personal-experience'
  },
  {
    id: '2',
    title: '인문학: 사고의 틀을 넓히는 글',
    excerpt: '인문학적 사고와 통찰을 담은 글로, 철학, 역사, 문학 등 다양한 인문학 주제를 다룹니다.',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    thumbnail_url: 'https://picsum.photos/id/42/800/600',
    category: '인문학',
    likes: 98,
    slug: 'humanities-expanding-thoughts'
  },
  {
    id: '3',
    title: '문화: 현대사회 트렌드에 관한 분석',
    excerpt: '문화적 현상과 트렌드에 관한 분석과 해석을 담은 글입니다.',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    thumbnail_url: 'https://picsum.photos/id/68/800/600',
    category: '문화',
    likes: 76,
    slug: 'culture-trend-analysis'
  },
  {
    id: '4',
    title: '상담 사례: 다양한 심리 상담 이야기',
    excerpt: '다양한 심리 상담 사례와 해석, 그리고 조언을 담은 글입니다.',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    thumbnail_url: 'https://picsum.photos/id/96/800/600',
    category: '상담',
    likes: 64,
    slug: 'counseling-cases'
  },
  {
    id: '5',
    title: '인터뷰: 분야의 전문가들과의 대화',
    excerpt: '다양한 분야의 전문가들과 진행한 인터뷰 내용을 담은 글입니다.',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    thumbnail_url: 'https://picsum.photos/id/100/800/600',
    category: '인터뷰',
    likes: 58,
    slug: 'expert-interviews'
  }
];

async function getArticles(limit = 5) {
  try {
    // 환경 변수가 설정되어 있는지 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase 환경 변수가 설정되어 있지 않습니다.');
      return [];
    }
    
    const supabase = getSupabaseServer();
    console.log('Supabase 서버 클라이언트로 데이터 요청 시도...');
    
    // 1. articles 테이블 먼저 시도
    let { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, excerpt, created_at, featured_image, category_id')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (articlesError) {
      console.error('Articles 테이블 쿼리 오류:', articlesError);
      
      // 2. 실패 시 posts 테이블 시도
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, title, excerpt, created_at, thumbnail_url, category')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (postsError) {
        console.error('Posts 테이블 쿼리 오류:', postsError);
        console.log('데이터베이스 접근 실패.');
        return [];
      }
      
      console.log('Posts 테이블에서 데이터를 가져왔습니다. 개수:', posts?.length || 0);
      
      // Posts 테이블 데이터를 articles 형식으로 변환
      return posts?.map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        created_at: post.created_at,
        featured_image: post.thumbnail_url,
        category: post.category
      })) || [];
    }
    
    console.log('Articles 테이블에서 데이터를 가져왔습니다. 개수:', articles?.length || 0);
    
    // 데이터가 없으면 빈 배열 반환
    if (!articles || articles.length === 0) {
      console.log('Articles 테이블에 데이터가 없습니다.');
      return [];
    }
    
    // 카테고리 ID를 이름으로 변환하기 위한 매핑
    const categoryMap = {
      1: '에세이',
      2: '인문학',
      3: '문화',
      4: '상담',
      5: '인터뷰'
    };
    
    return articles.map(article => ({
      ...article,
      category: categoryMap[article.category_id] || 
               (typeof article.category_id === 'string' && article.category_id) || 
               article.category || '기타'
    })) || [];
  } catch (error) {
    console.error('데이터 가져오기 오류:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
}

export default async function HomePage() {
  // API 함수 사용은 유지하되, 수정된 getArticles 함수를 사용
  const articles = await getArticles(5);
  const popularPosts = await getPopularPosts(5);

  return (
    <MainLayout>
      <Hero />
      
      {/* 카테고리 섹션 - 배경색 제거 */}
      <section className="py-12 md:py-20">
        <div className="container">
          <CategoryList />
        </div>
      </section>
      
      {/* 최신 글 섹션 */}
      <section className="container py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">최신 글</h2>
              <Button asChild variant="outline" className="hidden md:flex">
                <Link href="/articles" className="text-sm flex items-center gap-1">
                  모든 최신글 보기 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {articles.length === 0 ? (
              <Alert className="mb-6">
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>게시글이 없습니다</AlertTitle>
                <AlertDescription>
                  현재 등록된 게시글이 없습니다. 곧 새로운 글이 업데이트될 예정입니다.
                </AlertDescription>
              </Alert>
            ) : (
              <ul className="space-y-8">
                {articles.map((article) => (
                  <li key={article.id} className="border-b pb-8 group">
                    <Link href={`/articles/${article.id}`} className="flex flex-col sm:flex-row gap-6 hover:bg-slate-50 rounded-lg transition-colors p-3">
                      <div className="relative w-full sm:w-60 h-60 sm:h-44 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={article.featured_image || `https://picsum.photos/id/${(parseInt(article.id) % 100) || 1}/600/400`}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, 240px"
                        />
                        {article.category && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1 text-sm shadow-md">
                              {article.category}
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h2 className="text-xl md:text-2xl font-semibold group-hover:text-emerald-600 transition-colors mb-3">{article.title}</h2>
                        <p className="text-muted-foreground mb-3 line-clamp-3 flex-grow">{article.excerpt}</p>
                        <span className="text-xs text-gray-400">{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="mt-8 flex md:hidden">
              <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600">
                <Link href="/articles" className="text-sm flex items-center justify-center gap-1">
                  모든 최신글 보기 <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-80 xl:w-96">
            <PopularPosts posts={popularPosts} />
          </div>
        </div>
      </section>
      
      {/* 구독하기 섹션 */}
      <section className="bg-white py-16 md:py-24 border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">서재를 구독하고 모든 콘텐츠를 만나보세요</h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              매월 업데이트되는 양질의 콘텐츠를 가장 먼저 만나보세요.
            </p>
            
            <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 px-8 py-6 text-lg">
              <Link href="/subscribe">
                구독하기
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 