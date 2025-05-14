import { Metadata } from "next";
import { checkAdminAccess } from "@/lib/admin-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, MessageSquare, Users, Tag, BarChart2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "관리자 대시보드 | 서재",
  description: "블로그 관리 대시보드",
};

async function getStats() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const articlesPromise = supabase.from("articles").select("id", { count: "exact" });
  const commentsPromise = supabase.from("comments").select("id", { count: "exact" });
  const usersPromise = supabase.from("users").select("id", { count: "exact" });
  const categoriesPromise = supabase.from("categories").select("id", { count: "exact" });

  const [articles, comments, users, categories] = await Promise.all([
    articlesPromise,
    commentsPromise,
    usersPromise,
    categoriesPromise,
  ]);

  return {
    articles: articles.count || 0,
    comments: comments.count || 0,
    users: users.count || 0,
    categories: categories.count || 0,
  };
}

export default async function AdminPage() {
  await checkAdminAccess();
  const stats = await getStats();

  return (
    <div className="space-y-6 p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">관리자 대시보드</h1>
        <p className="text-muted-foreground">블로그 통계 및 컨텐츠 관리</p>
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
            <RecentContentCard title="최근 게시글" icon={<BookOpen className="h-4 w-4" />} path="/admin/articles" />
            <RecentContentCard title="최근 댓글" icon={<MessageSquare className="h-4 w-4" />} path="/admin/comments" />
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

function DashboardCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
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

function RecentContentCard({ title, icon, path }: { title: string; icon: React.ReactNode; path: string }) {
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
        <p className="text-muted-foreground">로딩 중...</p>
      </CardContent>
    </Card>
  );
}

function ActionCard({
  title,
  description,
  icon,
  path,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}) {
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