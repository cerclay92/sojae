import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { AllPostsManager } from '@/features/admin/components/all-posts-manager';

export const metadata: Metadata = {
  title: '모든 게시물 관리',
  description: '서재, 사람을 잇다 게시물 관리 페이지입니다.',
};

export default function AllPostsPage() {
  return (
    <MainLayout>
      <div className="container py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 md:mb-8">모든 게시물 관리</h1>
        <AllPostsManager />
      </div>
    </MainLayout>
  );
} 