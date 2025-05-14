import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';
import { getPosts, getPopularPosts } from '@/features/magazine/api';
import { PostList } from '@/features/magazine/components/post-list';
import { CategoryList } from '@/features/magazine/components/category-list';
import { Hero } from '@/features/magazine/components/hero';
import { PopularPosts } from '@/features/magazine/components/popular-posts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { createClient } from "@supabase/supabase-js";

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
};

async function getArticles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, excerpt, created_at")
    .order("created_at", { ascending: false });
  return data || [];
}

export default async function HomePage() {
  const articles = await getArticles();

  return (
    <MainLayout>
      <Hero />
      
      {/* 카테고리 섹션 - 배경색 제거 */}
      <section className="py-12 md:py-20">
        <div className="container">
          <CategoryList />
        </div>
      </section>
      
      <section className="container py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 md:mb-8">최신 글</h2>
            <ul className="space-y-4">
              {articles.map((article) => (
                <li key={article.id} className="border-b pb-4">
                  <Link href={`/articles/${article.id}`}>
                    <h2 className="text-xl font-semibold hover:underline">{article.title}</h2>
                  </Link>
                  <p className="text-muted-foreground">{article.excerpt}</p>
                  <span className="text-xs text-gray-400">{new Date(article.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full lg:w-80 xl:w-96">
            <PopularPosts posts={await getPopularPosts(5)} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
} 