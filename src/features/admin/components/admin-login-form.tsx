"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

// Supabase 클라이언트 생성 - 브라우저에서만 실행됨
const getSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 마운트 시 세션 스토리지 초기화
  useEffect(() => {
    try {
      // 기존 세션 상태 초기화
      sessionStorage.clear();
      localStorage.removeItem('supabase-auth-token');
      
      // 안전한 쿠키 삭제 함수
      const clearCookies = () => {
        document.cookie.split(";").forEach(function(c) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      };
      
      clearCookies();
    } catch (e) {
      console.error("세션 초기화 오류:", e);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Supabase로 로그인
      const supabase = getSupabaseClient();
      
      // 로그인 시도
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        console.error("Supabase 로그인 오류:", loginError);
        setError("로그인 실패! 이메일/비밀번호를 확인하세요.");
        setIsLoading(false);
        return;
      }

      // 2. 관리자 권한 체크 (클라이언트에서 직접 체크)
      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .eq("is_active", true)
        .single();

      console.log("관리자 계정 조회 결과:", { admin, adminError });

      if (adminError || !admin) {
        const errorMsg = adminError 
          ? `관리자 권한 체크 오류: ${adminError.message}`
          : "관리자 권한이 없거나 계정이 비활성화되었습니다.";
        setError(errorMsg);
        setIsLoading(false);
        await supabase.auth.signOut();
        return;
      }

      // 3. Next.js API 라우트를 통해 세션 생성
      try {
        const response = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            token: data.session?.access_token,
            refreshToken: data.session?.refresh_token,
            userId: data.user?.id
          }),
          cache: "no-store",
        });

        if (!response.ok) {
          const responseData = await response.json();
          throw new Error(responseData.error || "세션 생성 중 오류가 발생했습니다.");
        }
        
        const responseData = await response.json();
        
        // 4. 클라이언트 세션 저장
        if (responseData.token) {
          // 브라우저 로컬 스토리지에 토큰 저장 (EasyNext 환경용)
          localStorage.setItem('supabase-auth-token', responseData.token);
          
          // 세션 스토리지에 관리자 정보 저장
          const adminData = {
            email: email,
            role: 'admin',
            isAuthenticated: true,
            token: responseData.token,
            nextAuthToken: responseData.nextAuthToken
          };
          
          sessionStorage.setItem('admin-user', JSON.stringify(adminData));
          
          // 로그인 성공
          toast.success("로그인 성공");
          
          // 브라우저 캐시를 완전히 우회하기 위한 방법
          setIsLoading(false);
          
          // 약간의 지연 후 라우팅 (토스트 메시지가 보이도록)
          setTimeout(() => {
            const timestamp = new Date().getTime();
            window.location.href = `/admin?t=${timestamp}`;
          }, 1000);
        } else {
          throw new Error("인증 토큰을 받지 못했습니다");
        }
      } catch (apiError: any) {
        console.error("API 호출 오류:", apiError);
        setError(apiError.message || "로그인 중 오류가 발생했습니다.");
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("로그인 처리 중 오류:", err);
      setError(err.message || "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="pjs@admin.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-sm font-medium text-red-500">{error}</div>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        로그인
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        <p>관리자 계정</p>
        <p>
          이메일: <strong>pjs@admin.com</strong>
        </p>
        <p>
          비밀번호: <strong>password</strong>
        </p>
      </div>
    </form>
  );
} 