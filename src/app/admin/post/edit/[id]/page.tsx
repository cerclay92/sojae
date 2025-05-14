import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { PostEditor } from '@/features/admin/components/post-editor';
import { getPostById } from '@/features/magazine/api';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: '게시물 편집',
  description: '기존 게시물을 수정합니다.',
};

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  let post;
  
  try {
    post = await getPostById(params.id);
  } catch (error) {
    console.error('게시물을 찾을 수 없습니다:', error);
    notFound();
  }
  
  return (
    <MainLayout>
      <div className="container py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 md:mb-8">게시물 편집</h1>
        <PostEditor post={post} />
      </div>
    </MainLayout>
  );
} 