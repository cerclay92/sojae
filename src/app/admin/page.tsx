"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, MessageSquare, Users, Tag, BarChart2, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import useSWR from "swr";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface RecentArticlesCardProps {
  title: string;
  icon: React.ReactNode;
  path: string;
  articles: any[];
}

interface RecentCommentsCardProps {
  title: string;
  icon: React.ReactNode;
  path: string;
  comments: any[];
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // 인증 체크 API 호출
  const { data: authResult, error: authFetchError } = useSWR("/api/admin/auth-check", fetcher);

  // API 엔드포인트를 통해 데이터 가져오기
  const { data: stats, error: statsError } = useSWR('/api/admin/dashboard/stats', fetcher);
  const { data: recentArticles, error: articlesError } = useSWR('/api/admin/dashboard/recent-articles', fetcher);
  const { data: recentComments, error: commentsError } = useSWR('/api/admin/dashboard/recent-comments', fetcher);

  // 클라이언트 측 세션 확인을 추가하여 인증 상태를 더 강력하게 체크
  useEffect(() => {
    // 1. 먼저 세션 스토리지 확인
    let isAuthenticated = false;
    try {
      const adminUser = sessionStorage.getItem('admin-user');
      if (adminUser) {
        const userData = JSON.parse(adminUser);
        isAuthenticated = userData.isAuthenticated === true;
      }
    } catch (e) {
      console.error("세션 스토리지 확인 오류:", e);
    }

    // 2. API 결과와 함께 확인
    if (authFetchError) {
      setAuthError("인증 오류가 발생했습니다.");
      setIsLoading(false);
      return;
    }

    if (!authResult) {
      // API 응답을 기다리되, 세션 스토리지에 인증 정보가 있으면 로딩 상태 유지
      if (!isAuthenticated) {
        setIsLoading(false);
      }
      return;
    }
    
    // 3. API 응답 또는 세션 스토리지 기반으로 인증 상태 결정
    if (!authResult.isAdmin && authResult.shouldRedirect && !isAuthenticated) {
      // 두 검증 모두 실패했을 때만 리다이렉트
      const timestamp = new Date().getTime();
      router.push(`/admin/login?t=${timestamp}`);
      return;
    }
    
    // 어느 하나라도 성공이면 인증됨으로 간주
    setIsLoading(false);
  }, [authResult, authFetchError, router]);

  // 데이터 로딩 상태 또는 오류 상태 처리
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p>인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">인증 오류</h2>
          <p className="mb-4">{authError}</p>
          <Button asChild>
            <Link href="/admin/login">로그인 페이지로 이동</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (statsError || articlesError || commentsError) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">데이터 로딩 중 오류가 발생했습니다</h1>
        <Button onClick={() => window.location.reload()}>새로고침</Button>
      </div>
    );
  }

  if (!stats || !recentArticles || !recentComments) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <p className="text-muted-foreground">블로그 통계 및 컨텐츠 관리</p>
        </div>
        <form action="/api/auth/signout" method="post">
          <Button variant="destructive" size="sm" type="submit">
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="게시글"
          value={`${stats.articles}개`}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="댓글"
          value={`${stats.comments}개`}
          icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="카테고리"
          value={`${stats.categories}개`}
          icon={<Tag className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="사용자"
          value={`${stats.users}명`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">최근 활동</TabsTrigger>
          <TabsTrigger value="content">콘텐츠 관리</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <RecentArticlesCard 
              title="최근 게시글" 
              icon={<BookOpen className="h-4 w-4" />} 
              path="/admin/articles"
              articles={recentArticles}
            />
            <RecentCommentsCard 
              title="최근 댓글" 
              icon={<MessageSquare className="h-4 w-4" />} 
              path="/admin/comments"
              comments={recentComments}
            />
          </div>
        </TabsContent>
        <TabsContent value="content" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <ActionCard
              title="게시글 관리"
              description="게시글 목록, 작성, 수정, 삭제"
              icon={<FileText className="h-8 w-8" />}
              path="/admin/articles"
            />
            <ActionCard
              title="카테고리 관리"
              description="카테고리 목록, 생성, 수정, 삭제"
              icon={<Tag className="h-8 w-8" />}
              path="/admin/categories"
            />
            <ActionCard
              title="댓글 관리"
              description="댓글 목록, 승인, 삭제"
              icon={<MessageSquare className="h-8 w-8" />}
              path="/admin/comments"
            />
          </div>
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <ActionCard
              title="블로그 설정"
              description="블로그 이름, 설명, 댓글 설정 등"
              icon={<BookOpen className="h-8 w-8" />}
              path="/admin/settings"
            />
            <ActionCard
              title="사용자 관리"
              description="사용자 목록, 권한 관리"
              icon={<Users className="h-8 w-8" />}
              path="/admin/users"
            />
            <ActionCard
              title="통계"
              description="방문자 통계, 인기 게시글 등"
              icon={<BarChart2 className="h-8 w-8" />}
              path="/admin/statistics"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function RecentArticlesCard({ title, icon, path, articles }: RecentArticlesCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <a href={path} className="text-sm text-blue-500 hover:underline">
          더 보기
        </a>
      </CardHeader>
      <CardContent className="text-sm">
        {articles.length > 0 ? (
          <ul className="space-y-2">
            {articles.map((article) => (
              <li key={article.id} className="flex justify-between items-center">
                <a href={`/admin/articles/${article.id}`} className="hover:underline truncate">
                  {article.title}
                </a>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(article.created_at), "yy.MM.dd")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">게시글이 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}

function RecentCommentsCard({ title, icon, path, comments }: RecentCommentsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <a href={path} className="text-sm text-blue-500 hover:underline">
          더 보기
        </a>
      </CardHeader>
      <CardContent className="text-sm">
        {comments.length > 0 ? (
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li key={comment.id} className="flex flex-col">
                <div className="truncate">{comment.content}</div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">
                    {comment.articles?.title || "삭제된 게시글"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(comment.created_at), "yy.MM.dd")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">댓글이 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}

function ActionCard({ title, description, icon, path }: ActionCardProps) {
  return (
    <a href={path}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </a>
  );
} 