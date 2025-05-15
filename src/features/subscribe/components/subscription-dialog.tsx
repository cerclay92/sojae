'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { SUBSCRIPTION_TYPES } from '@/constants/subscription';
import { formatPrice } from '@/lib/utils';
import { createSubscription } from '@/features/subscribe/api';
import { useRouter } from 'next/navigation';

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    email: string;
    subscription_type: 'monthly' | 'yearly' | 'donate';
  };
}

export function SubscriptionDialog({
  open,
  onOpenChange,
  data,
}: SubscriptionDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const subscriptionType = SUBSCRIPTION_TYPES.find(
    (type) => type.id === data.subscription_type
  );

  const handlePayment = async () => {
    if (!subscriptionType) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // 실제 구현에서는 결제 처리 로직이 들어갑니다
      // 모의 결제 처리 (2초 지연)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // 가상의 결제 ID
      const paymentId = `payment_${Date.now()}`;
      
      // 구독 정보 저장
      await createSubscription({
        email: data.email,
        subscriptionType: data.subscription_type,
        paymentId,
      });
      
      setIsCompleted(true);
    } catch (err) {
      console.error('결제 처리 중 오류가 발생했습니다:', err);
      setError('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isCompleted) {
      // 완료 후 닫기 시 페이지 리프레시
      router.refresh();
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>구독 결제</DialogTitle>
          <DialogDescription>
            {isCompleted
              ? '구독 신청이 완료되었습니다.'
              : '선택하신 구독 상품의 결제를 진행합니다.'}
          </DialogDescription>
        </DialogHeader>
        
        {!isCompleted ? (
          <>
            <div className="space-y-4 py-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{subscriptionType?.name}</h4>
                  <span className="font-bold">
                    {subscriptionType && formatPrice(subscriptionType.price)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {subscriptionType?.description}
                </p>
                <div className="mt-4 text-sm">
                  <div className="flex justify-between py-1">
                    <span>이메일</span>
                    <span>{data.email}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>결제 금액</span>
                    <span className="font-medium">
                      {subscriptionType && formatPrice(subscriptionType.price)}
                    </span>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="text-sm text-destructive">{error}</div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={isProcessing}
              >
                취소
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리중...
                  </>
                ) : (
                  '결제하기'
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-6 flex flex-col items-center">
              <CheckCircle2 className="text-primary w-12 h-12 mb-4" />
              <p className="text-center mb-2">
                <span className="font-medium">{data.email}</span>로<br />
                구독 완료 메일이 발송되었습니다.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                매월 새롭게 발행되는 콘텐츠를 이메일로 받아보실 수 있습니다.
              </p>
            </div>
            
            <DialogFooter>
              <Button onClick={handleClose}>
                확인
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 