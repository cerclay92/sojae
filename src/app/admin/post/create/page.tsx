import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { PostEditor } from '@/features/admin/components/post-editor';

export const metadata: Metadata = {
  title: '새 글 작성',
  description: '새로운 글을 작성합니다.',
};

export default function CreatePostPage() {
  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-8">새 글 작성</h1>
        <PostEditor />
      </div>
    </MainLayout>
  );
} 