"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("로그인 실패! 이메일/비밀번호를 확인하세요.");
      setIsLoading(false);
      return;
    }

    // 관리자 권한 체크 (admin_users 테이블)
    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single();

    if (adminError || !admin) {
      setError("관리자 권한이 없습니다.");
      setIsLoading(false);
      // 로그아웃 처리
      await supabase.auth.signOut();
      return;
    }

    // 로그인 성공
    router.push("/admin");
    router.refresh();
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