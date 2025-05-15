import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { DonatePageClient } from './client-component';

export const metadata: Metadata = {
  title: '후원하기',
  description: '서재, 사람을 잇다의 활동을 후원해주세요.',
};

export default function DonatePage() {
  return <DonatePageClient />;
} 