import { Metadata } from "next";
import { checkAdminAccess } from "@/lib/admin-auth";
import { ArticleForm } from "@/features/admin/components/article-form";
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: "새 게시글 작성 | 서재",
  description: "새로운 게시글 작성",
};

// 카테고리 목록 조회
async function getCategories() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("카테고리 조회 실패:", error);
    return [];
  }

  return data || [];
}

export default async function NewArticlePage() {
  await checkAdminAccess();
  const categories = await getCategories();

  return (
    <div className="space-y-6 p-6 lg:p-10 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">새 게시글 작성</h1>
        <p className="text-muted-foreground">블로그 게시글 작성 및 발행</p>
      </div>

      <ArticleForm categories={categories} />
    </div>
  );
} 