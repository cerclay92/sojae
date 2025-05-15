import { notFound, redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import { checkAdminAccess } from "@/lib/admin-auth";
import { ArticleForm } from "@/features/admin/components/article-form";

export const metadata: Metadata = {
  title: "게시글 수정 | 서재",
  description: "게시글 상세 및 수정",
};

async function getArticle(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}

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
  return data;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  await checkAdminAccess();
  
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const article = await getArticle(id);
  if (!article) return notFound();
  
  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      <ArticleForm 
        article={article} 
        categories={categories}
      />
    </div>
  );
} 