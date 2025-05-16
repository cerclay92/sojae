"use client";

import { Metadata } from "next";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BookOpen, FileText, Settings, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { Toaster } from "sonner";
import useSWR from "swr";

// 메타데이터는 서버 컴포넌트에서만 사용 가능하므로 별도 파일로 분리해야 합니다
/*
export const metadata: Metadata = {
  title: "관리자 대시보드 | 서재",
  description: "블로그 관리 대시보드",
};
*/

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  
  // 인증 체크 API 호출
  const { data: authResult, error: authFetchError } = useSWR("/api/admin/auth-check", fetcher);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    const timestamp = new Date().getTime();
    window.location.href = `/api/auth/signout?t=${timestamp}`;
  };

  // 클라이언트 측 세션 확인을 추가하여 인증 상태를 체크
  useEffect(() => {
    // 로그인 페이지인 경우 인증 체크 건너뜀
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }
    
    // 세션 스토리지 확인
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

    // API 결과와 함께 확인
    if (!authResult && !authFetchError) {
      // 아직 데이터를 받아오는 중
      return;
    }
    
    if (authFetchError || (authResult && !authResult.isAdmin && !isAuthenticated)) {
      // 인증 실패 시 로그인 페이지로 리다이렉트
      router.push("/admin/login");
      return;
    }
    
    setIsLoading(false);
  }, [authResult, authFetchError, router, pathname]);

  // 로그인 페이지는 레이아웃을 적용하지 않음
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  
  // 로딩 중이면 빈 화면 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navItems = [
    { icon: <BookOpen className="w-5 h-5" />, label: "대시보드", href: "/admin" },
    { icon: <FileText className="w-5 h-5" />, label: "게시글 관리", href: "/admin/articles" },
    { icon: <Settings className="w-5 h-5" />, label: "블로그 설정", href: "/admin/settings" },
    { icon: <Users className="w-5 h-5" />, label: "사용자 관리", href: "/admin/users" },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="text-lg font-bold text-emerald-600 flex items-center">
            <BookOpen className="mr-2 w-6 h-6" />
            관리자
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-1" />
            <span>로그아웃</span>
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
      
      <Toaster richColors position="top-right" />
    </div>
  );
} 