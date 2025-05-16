"use client";

import { Suspense } from "react";
import { Metadata } from "next";
import BlogSettingsForm from "@/features/admin/components/BlogSettingsForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, FileText, Users, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// Metadata 정의는 서버 컴포넌트에서만 동작합니다. 
// 클라이언트 컴포넌트로 변경했으므로 메타데이터는 별도의 서버 컴포넌트 파일로 분리해야 합니다.
// 아래 메타데이터 정의는 실제로는 동작하지 않습니다.
/*
export const metadata: Metadata = {
  title: "블로그 설정 관리 | 서재",
  description: "블로그 설정을 관리합니다.",
};
*/

function SettingsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full max-w-md" />
      <Skeleton className="h-32 w-full mb-6" />
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-10 w-full max-w-md mt-4" />
      <Skeleton className="h-24 w-full mt-4" />
      <Skeleton className="h-10 w-32 mt-6" />
    </div>
  );
}

export default function AdminSettingsPage() {
  const handleTestNotification = () => {
    toast.success("테스트 알림이 전송되었습니다.");
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-2">블로그 설정 관리</h1>
      <p className="text-muted-foreground mb-8">블로그 기본 설정 및 환경을 관리하세요.</p>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-background border">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>기본 설정</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>콘텐츠 설정</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>사용자 설정</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>알림 설정</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>기본 설정</CardTitle>
              <CardDescription>블로그의 기본적인 정보를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SettingsSkeleton />}>
                <BlogSettingsForm />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 설정</CardTitle>
              <CardDescription>게시물과 댓글 관련 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTitle>개발 중인 기능</AlertTitle>
                <AlertDescription>콘텐츠 설정 기능은 아직 개발 중입니다.</AlertDescription>
              </Alert>
              
              <p className="text-muted-foreground mb-6">이 섹션에서는 다음과 같은 설정을 관리할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>콘텐츠 자동 저장 간격</li>
                <li>댓글 관리 방식</li>
                <li>게시물 표시 형식</li>
                <li>콘텐츠 보관 정책</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>사용자 설정</CardTitle>
              <CardDescription>사용자 관련 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTitle>개발 중인 기능</AlertTitle>
                <AlertDescription>사용자 설정 기능은 아직 개발 중입니다.</AlertDescription>
              </Alert>
              
              <p className="text-muted-foreground mb-6">이 섹션에서는 다음과 같은 설정을 관리할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>사용자 등록 조건</li>
                <li>권한 관리</li>
                <li>사용자 활동 로그</li>
                <li>계정 비활성화 정책</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>알림 및 이메일 발송 설정을 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <AlertTitle>개발 중인 기능</AlertTitle>
                <AlertDescription>알림 설정 기능은 아직 개발 중입니다.</AlertDescription>
              </Alert>
              
              <p className="text-muted-foreground mb-6">이 섹션에서는 다음과 같은 설정을 관리할 수 있습니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground mb-6">
                <li>이메일 템플릿 설정</li>
                <li>알림 발송 조건</li>
                <li>구독자 이메일 발송 설정</li>
                <li>알림 이력 관리</li>
              </ul>
              
              <button 
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                onClick={handleTestNotification}
              >
                테스트 알림 보내기
              </button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 