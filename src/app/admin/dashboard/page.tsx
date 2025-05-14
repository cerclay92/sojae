import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { AdminDashboard } from '@/features/admin/components/admin-dashboard';

export const metadata: Metadata = {
  title: '관리자 대시보드',
  description: '서재, 사람을 잇다 관리자 대시보드입니다.',
};

export default function AdminDashboardPage() {
  return (
    <MainLayout>
      <AdminDashboard />
    </MainLayout>
  );
} 