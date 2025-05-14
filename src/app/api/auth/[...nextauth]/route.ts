import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

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
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});

export { handler as GET, handler as POST };
