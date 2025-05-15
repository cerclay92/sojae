import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/constants/metadata';
import { SubscriptionForm } from '@/features/subscribe/components/subscription-form';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: '구독하기',
  description: '서재, 사람을 잇다 구독을 통해 매달 새로운 콘텐츠를 이메일로 받아보세요.',
};

export default function SubscribePage() {
  const benefits = [
    {
      title: '프리미엄 콘텐츠',
      description: '구독자만을 위한 프리미엄 콘텐츠를 이메일로 제공합니다.',
    },
    {
      title: '매달 업데이트',
      description: '매달 새로운 콘텐츠를 메일함으로 바로 받아보세요.',
    },
    {
      title: '아카이브 접근',
      description: '지난 모든 콘텐츠를 언제든지 다시 읽을 수 있습니다.',
    },
    {
      title: '서재 커뮤니티',
      description: '같은 관심사를 가진 독자들과 소통할 수 있습니다.',
    },
  ];

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold tracking-tight mb-4">구독하기</h1>
              <p className="text-muted-foreground mb-8">
                서재, 사람을 잇다 구독을 통해 매달 새로운 콘텐츠를 이메일로 받아보세요.
                월 1,100원으로 모든 프리미엄 콘텐츠를 이용하실 수 있습니다.
              </p>
              
              <div className="space-y-4 mb-12">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="border rounded-lg p-6 bg-card">
                <SubscriptionForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 