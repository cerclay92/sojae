import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { User } from "next-auth";

// User 타입 확장
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
    }
    token?: any;
  }
}

// JWT 타입 확장
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    supabaseToken?: string;
    supabaseRefreshToken?: string;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Supabase 클라이언트 생성
          const supabase = createClient(supabaseUrl, supabaseServiceKey);

          // 이메일/비밀번호로 로그인 시도
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (authError || !authData.user) {
            console.error("로그인 실패:", authError);
            return null;
          }

          // 관리자 권한 확인
          const { data: adminData, error: adminError } = await supabase
            .from("admin_users")
            .select("*")
            .eq("email", credentials.email)
            .eq("is_active", true)
            .single();

          if (adminError || !adminData) {
            console.error("관리자 권한 없음:", adminError || "사용자가 관리자가 아닙니다.");
            return null;
          }

          // 인증 성공 및 관리자 권한 확인 완료
          return {
            id: authData.user.id,
            email: authData.user.email,
            name: authData.user.user_metadata?.name || authData.user.email,
            role: "admin",
            supabaseToken: authData.session?.access_token,
            supabaseRefreshToken: authData.session?.refresh_token,
          };
        } catch (error) {
          console.error("인증 과정에서 오류 발생:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.supabaseToken = user.supabaseToken;
        token.supabaseRefreshToken = user.supabaseRefreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.token = token;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
