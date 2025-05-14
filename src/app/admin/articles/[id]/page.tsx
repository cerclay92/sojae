import { notFound, redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "게시글 상세 | 서재",
  description: "게시글 상세 및 수정",
};

async function getArticle(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data;
}

export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);
  if (!article) return notFound();

  async function handleDelete() {
    "use server";
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.from("articles").delete().eq("id", params.id);
    redirect("/admin/articles");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">게시글 상세</h1>
      <form className="space-y-4">
        <Input value={article.title} readOnly />
        <Textarea value={article.content} readOnly rows={10} />
        <div className="flex gap-2">
          <Button type="button" variant="destructive" formAction={handleDelete}>
            삭제
          </Button>
        </div>
      </form>
    </div>
  );
} 