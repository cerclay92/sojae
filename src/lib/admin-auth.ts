import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

// 서버 컴포넌트에서 관리자 권한 체크
export async function checkAdminAccess() {
  const cookieStore = await cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user?.email) {
    return { redirect: true };
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", user.email)
    .single();

  if (adminError || !admin) {
    return { redirect: true };
  }

  return { user, isAdmin: true };
}

// 클라이언트 컴포넌트에서 세션 유효성 체크를 위한 서버 액션
export async function checkSession() {
  const session = await getServerSession();
  return !!session?.user;
} 