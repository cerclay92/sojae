'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, FileText, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { formatNumber } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getPostCount, getPosts } from '@/features/magazine/api';
import { getSubscriberCount } from '@/features/subscribe/api';
import { PostList } from '@/features/magazine/components/post-list';
import { CATEGORIES } from '@/constants/category';

export function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
    
    // 인증 확인
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          router.push('/admin');
        }
      } catch (error) {
        console.error('인증 확인 실패:', error);
        router.push('/admin');
      }
    };
    
    checkAuth();
  }, [router]);
  
  const { data: posts = [] } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: () => getPosts({ limit: 5, onlyPublished: false }),
    enabled: isClient,
  });
  
  const { data: postCount = 0 } = useQuery({
    queryKey: ['admin-post-count'],
    queryFn: () => getPostCount(),
    enabled: isClient,
  });
  
  const { data: subscriberCount = 0 } = useQuery({
    queryKey: ['admin-subscriber-count'],
    queryFn: () => getSubscriberCount(),
    enabled: isClient,
  });
  
  // 카테고리별 게시물 쿼리
  const { data: categoryPosts = [] } = useQuery({
    queryKey: ['admin-category-posts', activeCategory],
    queryFn: () => getPosts({ 
      limit: 20, 
      onlyPublished: false,
      category: activeCategory as any
    }),
    enabled: isClient && !!activeCategory,
  });
  
  const handleSignOut = async () => {
    try {
      // 모든 세션 스토리지와 로컬 스토리지 클리어
      sessionStorage.clear();
      localStorage.clear();
      
      // 클라이언트 사이드에서 쿠키 삭제 (document.cookie 접근)
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // GET 방식으로 로그아웃 API 호출 (타임스탬프 추가로 캐시 방지)
      const timestamp = new Date().getTime();
      window.location.href = `/api/auth/signout?t=${timestamp}`;
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  
  if (!isClient) {
    return null;
  }
  
  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">관리자 대시보드</h1>
        <div className="flex flex-wrap gap-3 md:gap-4">
          <Button asChild size="sm" className="h-9 md:h-10">
            <Link href="/admin/post/create">
              <Plus className="mr-2 h-4 w-4" />
              새 글 작성
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-9 md:h-10" onClick={handleSignOut}>
            로그아웃
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 md:mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              총 게시물
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(postCount)}</div>
            <p className="text-xs text-muted-foreground">
              작성된 모든 게시물 수
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              구독자 수
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(subscriberCount)}</div>
            <p className="text-xs text-muted-foreground">
              활성 구독자 수
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              이번 달 수익
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{formatNumber(subscriberCount * 1000)}</div>
            <p className="text-xs text-muted-foreground">
              모든 구독 수익 합계
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto p-1">
          <TabsTrigger value="posts" className="flex-grow text-xs md:text-sm py-1">최근 게시물</TabsTrigger>
          <TabsTrigger value="categories" className="flex-grow text-xs md:text-sm py-1">카테고리별 관리</TabsTrigger>
          <TabsTrigger value="subscribers" className="flex-grow text-xs md:text-sm py-1">구독자</TabsTrigger>
          <TabsTrigger value="analytics" className="flex-grow text-xs md:text-sm py-1">통계</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">최근 게시물</CardTitle>
              <CardDescription>
                최근에 작성한 게시물 목록입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PostList posts={posts} variant="list" showViewMore={false} />
              <div className="mt-6 flex justify-center">
                <Button asChild variant="outline">
                  <Link href="/admin/posts">모든 게시물 관리</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">카테고리별 게시물 관리</CardTitle>
              <CardDescription>
                카테고리별로 게시물을 관리할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="mb-6 overflow-x-auto">
                <div className="flex border-b">
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                        activeCategory === category.id
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 sm:p-0">
                {activeCategory ? (
                  categoryPosts.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2 font-medium">제목</th>
                            <th className="text-center py-3 px-2 font-medium whitespace-nowrap w-24">발행 상태</th>
                            <th className="text-center py-3 px-2 font-medium whitespace-nowrap w-24">작업</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryPosts.map((post) => (
                            <tr key={post.id} className="border-b">
                              <td className="py-3 px-2">
                                <div className="font-medium line-clamp-1">{post.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(post.created_at).toLocaleDateString('ko-KR')}
                                </div>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <span 
                                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                                    post.published 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}
                                >
                                  {post.published ? '발행됨' : '임시저장'}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center">
                                <div className="flex justify-center gap-1">
                                  <Button size="sm" variant="ghost" asChild className="h-7 px-2">
                                    <Link href={`/admin/post/edit/${post.id}`}>
                                      수정
                                    </Link>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      이 카테고리에 게시물이 없습니다.
                    </div>
                  )
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    카테고리를 선택하여 게시물을 관리하세요.
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-center p-4 sm:p-0">
                <Button asChild>
                  <Link href="/admin/post/create">
                    <Plus className="mr-2 h-4 w-4" />
                    새 글 작성
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscribers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">구독자 관리</CardTitle>
              <CardDescription>
                구독자 목록 및 관리 기능입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">이메일</th>
                      <th className="text-center py-3 px-4 font-medium">상태</th>
                      <th className="text-center py-3 px-4 font-medium">구독 타입</th>
                      <th className="text-right py-3 px-4 font-medium">구독일</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4" colSpan={4}>
                        <div className="text-muted-foreground text-center py-4">
                          구독자 관리 기능은 개발 중입니다.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">통계 및 분석</CardTitle>
              <CardDescription>
                서비스 통계 및 분석 데이터입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">일일 방문자</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">142</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">페이지뷰</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">584</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">전환율</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">3.2%</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm">평균 체류시간</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">2:32</div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-muted-foreground text-center py-10 mt-6">
                자세한 통계 기능은 개발 중입니다.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 