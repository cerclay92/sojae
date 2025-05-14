import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { AdminLoginForm } from '@/features/admin/components/admin-login-form';

export const metadata: Metadata = {
  title: '관리자 로그인',
  description: '서재, 사람을 잇다 관리자 로그인 페이지입니다.',
};

export default function AdminLoginPage() {
  return (
    <MainLayout>
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-8 text-center">관리자 로그인</h1>
          <div className="border rounded-lg p-6 bg-card">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 