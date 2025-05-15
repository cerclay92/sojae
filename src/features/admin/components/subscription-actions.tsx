'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, addMonths, addYears } from 'date-fns';
import { getSupabaseClient } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Subscription = {
  id: string;
  email: string;
  subscription_type: string;
  status: string;
  expires_at: string;
  created_at: string;
};

interface SubscriptionActionsProps {
  subscription: Subscription;
  userName: string;
}

export function SubscriptionActions({ subscription, userName }: SubscriptionActionsProps) {
  const router = useRouter();
  const [isExtending, setIsExtending] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [extensionType, setExtensionType] = useState<'1month' | '3month' | '1year'>('1month');
  
  // 구독 연장
  const handleExtendSubscription = async () => {
    try {
      setIsExtending(true);
      const supabase = getSupabaseClient();
      
      // 새로운 만료일 계산
      let newExpiresAt = new Date(subscription.expires_at);
      
      if (extensionType === '1month') {
        newExpiresAt = addMonths(newExpiresAt, 1);
      } else if (extensionType === '3month') {
        newExpiresAt = addMonths(newExpiresAt, 3);
      } else {
        newExpiresAt = addYears(newExpiresAt, 1);
      }
      
      // 구독 연장
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          expires_at: newExpiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscription.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('구독이 성공적으로 연장되었습니다.');
      setShowExtendDialog(false);
      router.refresh();
    } catch (error: any) {
      console.error('구독 연장 실패:', error);
      toast.error('구독 연장 중 오류가 발생했습니다.');
    } finally {
      setIsExtending(false);
    }
  };
  
  // 구독 해지
  const handleTerminateSubscription = async () => {
    try {
      setIsTerminating(true);
      const supabase = getSupabaseClient();
      
      // 구독 해지
      const { error } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscription.id);
        
      if (error) {
        throw error;
      }
      
      toast.success('구독이 해지되었습니다.');
      router.refresh();
    } catch (error: any) {
      console.error('구독 해지 실패:', error);
      toast.error('구독 해지 중 오류가 발생했습니다.');
    } finally {
      setIsTerminating(false);
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">메뉴</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowExtendDialog(true)}>
            구독 연장
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDetailsDialog(true)}>
            상세 정보
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600"
            onClick={handleTerminateSubscription}
            disabled={isTerminating || subscription.status === 'canceled'}
          >
            {isTerminating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              '구독 해지'
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* 구독 상세 정보 다이얼로그 */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>구독 상세 정보</DialogTitle>
            <DialogDescription>
              사용자의 구독 정보를 확인합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>이름</Label>
                <div className="font-medium">{userName || '미등록'}</div>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>이메일</Label>
                <div className="font-medium">{subscription.email}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>구독 상태</Label>
                <div className="font-medium">
                  {subscription.status === 'active' ? '활성' : '해지됨'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>구독 유형</Label>
                <div className="font-medium">
                  {subscription.subscription_type === 'monthly' ? '월간 구독' : '연간 구독'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>구독 ID</Label>
                <div className="font-medium text-xs">{subscription.id}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>구독 시작일</Label>
                <div className="font-medium">
                  {format(new Date(subscription.created_at), 'yyyy-MM-dd')}
                </div>
              </div>
              <div className="space-y-2">
                <Label>구독 만료일</Label>
                <div className="font-medium">
                  {format(new Date(subscription.expires_at), 'yyyy-MM-dd')}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 구독 연장 다이얼로그 */}
      <Dialog open={showExtendDialog} onOpenChange={setShowExtendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>구독 연장</DialogTitle>
            <DialogDescription>
              {subscription.email} 사용자의 구독을 연장합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="extension-type">연장 기간</Label>
              <Select
                value={extensionType}
                onValueChange={(value: any) => setExtensionType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="연장 기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1개월</SelectItem>
                  <SelectItem value="3month">3개월</SelectItem>
                  <SelectItem value="1year">1년</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>현재 만료일</Label>
              <div className="font-medium">
                {format(new Date(subscription.expires_at), 'yyyy-MM-dd')}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>연장 후 만료일</Label>
              <div className="font-medium text-green-600">
                {extensionType === '1month' && 
                  format(addMonths(new Date(subscription.expires_at), 1), 'yyyy-MM-dd')}
                {extensionType === '3month' && 
                  format(addMonths(new Date(subscription.expires_at), 3), 'yyyy-MM-dd')}
                {extensionType === '1year' && 
                  format(addYears(new Date(subscription.expires_at), 1), 'yyyy-MM-dd')}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExtendDialog(false)}>
              취소
            </Button>
            <Button 
              onClick={handleExtendSubscription}
              disabled={isExtending}
            >
              {isExtending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                '구독 연장'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 