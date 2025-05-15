import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { PostEditor } from '@/features/admin/components/post-editor';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { checkAdminAccess } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: '게시물 편집',
  description: '기존 게시물을 수정합니다.',
};

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getArticleById(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('게시글 조회 실패:', error.message);
    throw new Error(error.message);
  }

  return data;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  await checkAdminAccess();
  const resolvedParams = await params;
  let post;
  
  try {
    post = await getArticleById(resolvedParams.id);
  } catch (error) {
    console.error('게시글을 찾을 수 없습니다:', error);
    notFound();
  }
  
  return (
    <MainLayout>
      <div className="container py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 md:mb-8">게시글 편집</h1>
        <PostEditor post={post} />
      </div>
    </MainLayout>
  );
} 