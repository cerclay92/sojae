'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SUBSCRIPTION_TYPES, SubscriptionType } from '@/constants/subscription';
import { formatPrice } from '@/lib/utils';
import { Loader2, CheckIcon, Heart } from 'lucide-react';
import { SubscriptionDialog } from '@/features/subscribe/components/subscription-dialog';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: '유효한 이메일을 입력해주세요.' }),
  subscription_type: z.enum(['monthly', 'yearly', 'donate']),
});

type FormValues = z.infer<typeof formSchema>;

interface SubscriptionFormProps {
  onSuccess?: () => void;
}

export function SubscriptionForm({ onSuccess }: SubscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    email: string;
    subscription_type: SubscriptionType;
  } | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      subscription_type: 'monthly',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // 후원하기를 선택한 경우 바로 후원 페이지로 이동
      if (values.subscription_type === 'donate') {
        window.location.href = '/donate';
        return;
      }
      
      // 제출 데이터 저장 (donate가 아닌 경우만)
      setSubmittedData({
        email: values.email,
        subscription_type: values.subscription_type as SubscriptionType,
      });
      
      // 결제 다이얼로그 표시
      setIsDialogOpen(true);
    } catch (error) {
      console.error('구독 신청 중 오류가 발생했습니다:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="subscription_type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>구독 유형</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-2"
                >
                  <FormItem
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value="monthly" />
                    </FormControl>
                    <FormLabel className="font-normal text-base">
                      월간 구독 (1,100원/월)
                    </FormLabel>
                  </FormItem>
                  <FormItem
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value="yearly" />
                    </FormControl>
                    <FormLabel className="font-normal text-base">
                      연간 구독 (11,000원/년, 1개월 무료)
                    </FormLabel>
                  </FormItem>
                  <FormItem
                    className="flex items-center space-x-3 space-y-0 pt-2 border-t mt-2"
                  >
                    <FormControl>
                      <RadioGroupItem value="donate" />
                    </FormControl>
                    <FormLabel className="font-normal text-base flex items-center">
                      <Heart className="h-4 w-4 text-rose-500 mr-1" /> 후원하기
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          className="w-full" 
          type="submit" 
          disabled={isSubmitting || isSuccess}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              처리 중...
            </>
          ) : isSuccess ? (
            <>
              <CheckIcon className="mr-2 h-4 w-4" />
              구독 완료!
            </>
          ) : (
            "계속하기"
          )}
        </Button>
      </Form>
      
      {submittedData && (
        <SubscriptionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          data={submittedData}
        />
      )}
    </>
  );
} 