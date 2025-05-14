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
import { SUBSCRIPTION_TYPES } from '@/constants/subscription';
import { formatPrice } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { SubscriptionDialog } from '@/features/subscribe/components/subscription-dialog';

const formSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
  subscription_type: z.enum(['monthly', 'yearly']),
});

export function SubscriptionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    email: string;
    subscription_type: 'monthly' | 'yearly';
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      subscription_type: 'monthly',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // 제출 데이터 저장
      setSubmittedData({
        email: values.email,
        subscription_type: values.subscription_type as 'monthly' | 'yearly',
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    className="flex flex-col space-y-4"
                  >
                    {SUBSCRIPTION_TYPES.map((type) => (
                      <FormItem
                        key={type.id}
                        className="flex items-start space-x-3 space-y-0 rounded-md border p-4"
                      >
                        <FormControl>
                          <RadioGroupItem value={type.id} />
                        </FormControl>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <FormLabel className="font-normal text-base">
                              {type.name}
                            </FormLabel>
                            <span className="font-medium">
                              {formatPrice(type.price)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </div>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리중...
              </>
            ) : (
              '구독하기'
            )}
          </Button>
        </form>
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