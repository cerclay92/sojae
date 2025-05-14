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

export function AdminDashboard() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  
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
  
  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.push('/admin');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };
  
  if (!isClient) {
    return null;
  }
  
  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">관리자 대시보드</h1>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/admin/post/create">
              <Plus className="mr-2 h-4 w-4" />
              새 글 작성
            </Link>
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            로그아웃
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-8">
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
      
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">최근 게시물</TabsTrigger>
          <TabsTrigger value="subscribers">구독자</TabsTrigger>
          <TabsTrigger value="analytics">통계</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>최근 게시물</CardTitle>
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
        
        <TabsContent value="subscribers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>구독자 관리</CardTitle>
              <CardDescription>
                구독자 목록 및 관리 기능입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-6">
                구독자 관리 기능은 개발 중입니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>통계 및 분석</CardTitle>
              <CardDescription>
                서비스 통계 및 분석 데이터입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-6">
                통계 기능은 개발 중입니다.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 