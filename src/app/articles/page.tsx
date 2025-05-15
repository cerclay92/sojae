import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { getPosts, getPopularPosts } from '@/features/magazine/api';
import { CategoryList } from '@/features/magazine/components/category-list';
import { BookOpen, Clock, Flame } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { SITE_CONFIG } from '@/constants/metadata';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: '모든 게시글 | 서재',
  description: '서재의 모든 게시글을 확인하세요.',
};

export default async function ArticlesPage() {
  const latestPosts = await getPosts({ limit: 20 });
  const popularPosts = await getPopularPosts(20);

  const renderPostsList = (posts: any[]) => {
    if (posts.length === 0) {
      return (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">게시글이 없습니다</h2>
          <p className="text-muted-foreground">곧 새로운 게시글이 업데이트될 예정입니다.</p>
        </div>
      );
    }

    return (
      <ul className="space-y-8 divide-y">
        {posts.map((post) => (
          <li key={post.id} className="pt-8 first:pt-0">
            <article className="group">
              <Link href={`/articles/${post.id}`} className="flex flex-col md:flex-row gap-6">
                {post.thumbnail_url && (
                  <div className="relative aspect-video md:w-64 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={post.thumbnail_url || `https://picsum.photos/id/${(parseInt(post.id) % 100) || 1}/400/225`}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Badge variant="outline">{SITE_CONFIG.categories.find(c => c.id === post.category)?.name || '일반'}</Badge>
                    <time dateTime={post.created_at}>{format(new Date(post.created_at), 'yyyy년 MM월 dd일')}</time>
                  </div>
                  
                  <h2 className="text-xl font-semibold group-hover:text-emerald-600 transition-colors mb-2">{post.title}</h2>
                  
                  <p className="text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                  
                  <span className="text-emerald-600 font-medium group-hover:underline">자세히 보기</span>
                </div>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <MainLayout>
      {/* 카테고리 섹션 */}
      <section className="py-10">
        <div className="container">
          <CategoryList />
        </div>
      </section>
      
      {/* 게시글 목록 */}
      <section className="container py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">모든 게시글</h1>
          
          <Tabs defaultValue="latest" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="latest" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>최신 글</span>
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex items-center gap-2">
                <Flame className="h-4 w-4" />
                <span>인기 글</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="latest" className="mt-0">
              {renderPostsList(latestPosts)}
            </TabsContent>
            
            <TabsContent value="popular" className="mt-0">
              {renderPostsList(popularPosts)}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MainLayout>
  );
} 