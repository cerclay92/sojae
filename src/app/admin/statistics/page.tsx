import { Metadata } from "next";
import Link from "next/link";
import { checkAdminAccess } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, TrendingUp, Users, BookOpen, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@supabase/supabase-js";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ko } from "date-fns/locale";
import { DailyViewsChartWrapper, CategoryChartWrapper } from "@/features/admin/components/charts-wrapper";

export const metadata: Metadata = {
  title: "통계 | 서재",
  description: "사이트 통계 및 분석 데이터",
};

async function getViewsStatistics() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 최근 30일간의 일별 조회수
  const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
  
  const { data: dailyViews, error: dailyError } = await supabase
    .from("articles")
    .select("created_at, views")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: true });

  if (dailyError) {
    console.error("일별 조회수 통계 조회 실패:", dailyError);
  }

  // 카테고리별 조회수
  const { data: categoryViews, error: categoryError } = await supabase
    .from("articles")
    .select("categories(name), views")
    .not("categories", "is", null);

  if (categoryError) {
    console.error("카테고리별 통계 조회 실패:", categoryError);
  }

  // 데이터 가공
  const categoryData = categoryViews ? processCategoryData(categoryViews) : [];
  const dailyViewsData = dailyViews ? processDailyViewsData(dailyViews) : [];

  return {
    categoryData,
    dailyViewsData,
  };
}

// 카테고리별 데이터 처리
function processCategoryData(data: any[]) {
  const categoryMap = new Map();

  data.forEach(item => {
    if (item.categories && item.categories.name) {
      const category = item.categories.name;
      const views = item.views || 0;
      
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category) + views);
      } else {
        categoryMap.set(category, views);
      }
    }
  });

  return Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));
}

// 일별 조회수 데이터 처리
function processDailyViewsData(data: any[]) {
  const dailyMap = new Map();
  
  // 최근 30일 날짜 초기화
  const endDate = new Date();
  const startDate = subDays(endDate, 30);
  
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  dateRange.forEach(date => {
    const dateStr = format(date, "yyyy-MM-dd");
    dailyMap.set(dateStr, 0);
  });
  
  // 데이터 집계
  data.forEach(item => {
    if (item.created_at && item.views) {
      const dateStr = format(new Date(item.created_at), "yyyy-MM-dd");
      if (dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, dailyMap.get(dateStr) + (item.views || 0));
      }
    }
  });
  
  return Array.from(dailyMap.entries()).map(([date, views]) => ({
    date,
    views,
  }));
}

async function getStatisticsSummary() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 현재 달의 시작과 끝
  const now = new Date();
  const monthStart = startOfMonth(now).toISOString();
  const monthEnd = endOfMonth(now).toISOString();

  // 총 게시글 수
  const { count: totalArticles, error: articlesError } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true });

  // 이번 달 게시글 수
  const { count: monthlyArticles, error: monthlyArticlesError } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", monthStart)
    .lte("created_at", monthEnd);

  // 총 구독자 수
  const { count: totalSubscribers, error: subscribersError } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // 이번 달 신규 구독자 수
  const { count: monthlySubscribers, error: monthlySubscribersError } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")
    .gte("created_at", monthStart)
    .lte("created_at", monthEnd);

  // 총 조회수
  const { data: viewsData, error: viewsError } = await supabase
    .from("articles")
    .select("views");
    
  const totalViews = viewsData?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

  // 이번 달 인기 게시글 (조회수 기준 상위 5개)
  const { data: popularArticles, error: popularError } = await supabase
    .from("articles")
    .select("id, title, views, created_at")
    .order("views", { ascending: false })
    .limit(5);

  if (articlesError || monthlyArticlesError || subscribersError || 
      monthlySubscribersError || viewsError || popularError) {
    console.error("통계 데이터 조회 실패");
  }

  return {
    totalArticles: totalArticles || 0,
    monthlyArticles: monthlyArticles || 0,
    totalSubscribers: totalSubscribers || 0,
    monthlySubscribers: monthlySubscribers || 0,
    totalViews,
    popularArticles: popularArticles || [],
  };
}

export default async function StatisticsPage() {
  await checkAdminAccess();
  
  const { categoryData, dailyViewsData } = await getViewsStatistics();
  const summary = await getStatisticsSummary();
  
  const currentMonth = format(new Date(), "M월", { locale: ko });

  return (
    <div className="space-y-6 p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
                관리자 대시보드
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">통계 및 분석</h1>
          <p className="text-muted-foreground">사이트 이용 통계 및 분석 데이터</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {format(new Date(), "yyyy년 M월 d일", { locale: ko })} 기준
          </span>
        </div>
      </div>

      {/* 통계 요약 카드 */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-black">총 게시글</CardTitle>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{summary.totalArticles}개</div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonth} 신규: <span className="text-emerald-600">+{summary.monthlyArticles}개</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-black">구독자 수</CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{summary.totalSubscribers}명</div>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonth} 신규: <span className="text-emerald-600">+{summary.monthlySubscribers}명</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-black">총 조회수</CardTitle>
            <Eye className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{summary.totalViews.toLocaleString()}회</div>
            <p className="text-xs text-muted-foreground mt-1">
              게시글 평균: <span className="text-emerald-600">{summary.totalArticles ? Math.round(summary.totalViews / summary.totalArticles) : 0}회</span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-black">월 매출 추정</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">₩{(summary.totalSubscribers * 5000).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* 차트 */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>일별 조회수 추이</CardTitle>
            <CardDescription>최근 30일간 일별 조회수 추이</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <DailyViewsChartWrapper data={dailyViewsData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 조회수</CardTitle>
            <CardDescription>카테고리별 총 조회수 분포</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <CategoryChartWrapper data={categoryData} />
          </CardContent>
        </Card>
      </div>

      {/* 인기 게시글 */}
      <Card>
        <CardHeader>
          <CardTitle>인기 게시글 Top 5</CardTitle>
          <CardDescription>조회수 기준 인기 게시글</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {summary.popularArticles.map((article, index) => (
              <div key={article.id} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/articles/${article.id}`} className="text-lg font-medium hover:text-emerald-600 transition-colors truncate block">
                    {article.title}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{format(new Date(article.created_at), "yyyy.MM.dd")}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {article.views || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 