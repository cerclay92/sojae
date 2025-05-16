"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, FileText, MessageSquare, Users, Tag, BarChart2, 
  LogOut, Loader2, Settings, PenTool, Bell, Shield, Sparkles, Home
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import useSWR from "swr";
import { toast } from "sonner";

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
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
  color: string;
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

  // 로그아웃 처리 함수 추가
  const handleLogout = () => {
    // 클라이언트 사이드에서 세션 스토리지와 로컬 스토리지 초기화
    sessionStorage.clear();
    localStorage.clear();
    
    // 쿠키 삭제 시도
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // GET 방식으로 로그아웃 API 호출
    const timestamp = new Date().getTime();
    window.location.href = `/api/auth/signout?t=${timestamp}`;
  };

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
    <div className="space-y-6 sm:space-y-8 mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
      <div className="text-center mb-6 sm:mb-10 bg-gradient-to-r from-emerald-600 to-blue-600 text-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md relative">
        <Link 
          href="/" 
          className="absolute left-3 sm:left-4 top-3 sm:top-4 bg-white/20 p-1.5 sm:p-2 rounded-full hover:bg-white/30 transition-colors text-white flex items-center gap-1 sm:gap-2"
        >
          <Home className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline text-sm">홈으로</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">관리자 대시보드</h1>
        <p className="text-base sm:text-lg lg:text-xl opacity-90">블로그 통계 및 컨텐츠 관리</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardCard
          title="게시글"
          value={`${stats.articles}개`}
          icon={<FileText className="h-5 w-5 sm:h-6 sm:w-6" />}
          color="text-blue-500"
        />
        <DashboardCard
          title="댓글"
          value={`${stats.comments}개`}
          icon={<MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />}
          color="text-emerald-500"
        />
        <DashboardCard
          title="카테고리"
          value={`${stats.categories}개`}
          icon={<Tag className="h-5 w-5 sm:h-6 sm:w-6" />}
          color="text-purple-500"
        />
        <DashboardCard
          title="사용자"
          value={`${stats.users}명`}
          icon={<Users className="h-5 w-5 sm:h-6 sm:w-6" />}
          color="text-amber-500"
        />
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="w-full flex justify-center mb-4 sm:mb-6 lg:mb-8 bg-white border p-1 rounded-lg shadow-sm overflow-x-auto no-scrollbar">
          <TabsTrigger value="recent" className="flex items-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">최근 활동</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">
            <PenTool className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">콘텐츠 관리</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 py-2 px-3 sm:py-3 sm:px-6 text-sm sm:text-base whitespace-nowrap">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="font-medium">설정</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-4 sm:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <RecentArticlesCard 
              title="최근 게시글" 
              icon={<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />} 
              path="/admin/articles"
              articles={recentArticles}
            />
            <RecentCommentsCard 
              title="최근 댓글" 
              icon={<MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />} 
              path="/admin/comments"
              comments={recentComments}
            />
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-4 sm:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <ActionCard
              title="게시글 관리"
              description="게시글 목록, 작성, 수정, 삭제"
              icon={<FileText className="h-8 w-8 sm:h-10 sm:w-10" />}
              path="/admin/articles"
              color="text-blue-600"
            />
            <ActionCard
              title="카테고리 관리"
              description="카테고리 목록, 생성, 수정, 삭제"
              icon={<Tag className="h-8 w-8 sm:h-10 sm:w-10" />}
              path="/admin/categories"
              color="text-purple-600"
            />
            <ActionCard
              title="댓글 관리"
              description="댓글 목록, 승인, 삭제"
              icon={<MessageSquare className="h-8 w-8 sm:h-10 sm:w-10" />}
              path="/admin/comments"
              color="text-emerald-600"
            />
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4 sm:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <ActionCard
              title="블로그 설정"
              description="블로그 이름, 설명, 댓글 설정 등"
              icon={<Settings className="h-8 w-8 sm:h-10 sm:w-10" />}
              path="/admin/settings"
              color="text-amber-600"
            />
            <ActionCard
              title="사용자 관리"
              description="사용자 목록, 권한 관리"
              icon={<Shield className="h-8 w-8 sm:h-10 sm:w-10" />}
              path="/admin/users"
              color="text-indigo-600"
            />
            <ActionCard
              title="통계"
              description="방문자 통계, 인기 게시글 등"
              icon={<Sparkles className="h-8 w-8 sm:h-10 sm:w-10" />}
              path="/admin/statistics"
              color="text-pink-600"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DashboardCard({ title, value, icon, color }: DashboardCardProps) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <h3 className="font-medium text-gray-600 text-sm sm:text-base">{title}</h3>
          <div className={`${color} bg-gray-50 p-1.5 sm:p-2 rounded-full`}>
            {icon}
          </div>
        </div>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function RecentArticlesCard({ title, icon, path, articles }: RecentArticlesCardProps) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b">
          <div className="flex items-center space-x-2">
            <div className="text-blue-500">{icon}</div>
            <CardTitle className="font-medium text-sm sm:text-base">{title}</CardTitle>
          </div>
          <a href={path} className="text-xs sm:text-sm text-blue-500 hover:underline">
            더 보기
          </a>
        </div>
        
        {articles.length > 0 ? (
          <ul className="space-y-2 sm:space-y-3">
            {articles.map((article) => (
              <li key={article.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                <a href={`/admin/articles/${article.id}`} className="hover:text-blue-600 truncate font-medium text-xs sm:text-sm">
                  {article.title}
                </a>
                <span className="text-xs bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-gray-600 whitespace-nowrap ml-2">
                  {format(new Date(article.created_at), "yy.MM.dd")}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-4 sm:p-6 text-gray-500 text-sm">
            <p>게시글이 없습니다.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentCommentsCard({ title, icon, path, comments }: RecentCommentsCardProps) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b">
          <div className="flex items-center space-x-2">
            <div className="text-emerald-500">{icon}</div>
            <CardTitle className="font-medium text-sm sm:text-base">{title}</CardTitle>
          </div>
          <a href={path} className="text-xs sm:text-sm text-emerald-500 hover:underline">
            더 보기
          </a>
        </div>
        
        {comments.length > 0 ? (
          <ul className="space-y-2 sm:space-y-3">
            {comments.map((comment) => (
              <li key={comment.id} className="flex flex-col border-b pb-2 last:border-0">
                <div className="truncate font-medium text-xs sm:text-sm">{comment.content}</div>
                <div className="flex flex-wrap gap-2 justify-between mt-1">
                  <span className="text-xs bg-emerald-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-emerald-600 truncate max-w-[170px]">
                    {comment.articles?.title || "삭제된 게시글"}
                  </span>
                  <span className="text-xs bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-gray-600 whitespace-nowrap">
                    {format(new Date(comment.created_at), "yy.MM.dd")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center p-4 sm:p-6 text-gray-500 text-sm">
            <p>댓글이 없습니다.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActionCard({ title, description, icon, path, color }: ActionCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // 카테고리 관리와 댓글 관리인 경우 기본 동작 방지 및 팝업 메시지 표시
    if (title === "카테고리 관리" || title === "댓글 관리") {
      e.preventDefault();
      toast("개발 중", {
        description: `${title} 기능은 현재 개발 중입니다.`,
      });
    }
    // 다른 카드는 일반적으로 링크 작동
  };

  return (
    <a href={path} onClick={handleCardClick}>
      <Card className="border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
            <div className={`${color} bg-gray-50 p-1.5 sm:p-2 rounded-full`}>
              {icon}
            </div>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-600">{description}</CardDescription>
        </CardContent>
      </Card>
    </a>
  );
} 