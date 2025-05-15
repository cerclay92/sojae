'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layouts/main-layout';
import { Heart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

export function DonatePageClient() {
  const [selectedAmount, setSelectedAmount] = useState<string>('10000');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    // 실제 구현에서는 결제 및 후원 처리 로직이 들어갑니다
    // 여기서는 2초 후 성공으로 처리합니다
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  const donationOptions = [
    { value: '10000', label: '1만원', hearts: 1 },
    { value: '30000', label: '3만원', hearts: 2 },
    { value: '50000', label: '5만원', hearts: 3 },
    { value: 'custom', label: '직접 입력', hearts: 0 },
  ];

  const renderHearts = (count: number) => {
    return Array(count).fill(0).map((_, i) => (
      <Heart key={i} className="h-5 w-5 text-rose-500 inline-block" fill="currentColor" />
    ));
  };

  if (isSuccess) {
    return (
      <MainLayout>
        <div className="container py-16 md:py-24">
          <div className="max-w-md mx-auto text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">후원해 주셔서 감사합니다</h1>
            <p className="text-muted-foreground mb-8">
              소중한 후원금은 더 좋은 콘텐츠를 만드는 데 사용하겠습니다.
              영수증이 이메일로 발송되었습니다.
            </p>
            <Button asChild>
              <a href="/">홈으로 돌아가기</a>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">서재 후원하기</h1>
            <p className="text-lg text-muted-foreground">
              여러분의 후원으로 더 많은 사람들에게 인문학적 지혜를 나눌 수 있습니다.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>후원 정보</CardTitle>
              <CardDescription>
                후원 금액과 정보를 입력해주세요.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>후원 금액</Label>
                  <RadioGroup 
                    value={selectedAmount} 
                    onValueChange={(value) => {
                      setSelectedAmount(value);
                      if (value !== 'custom') setCustomAmount('');
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {donationOptions.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <RadioGroupItem 
                          value={option.value} 
                          id={`amount-${option.value}`}
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor={`amount-${option.value}`}
                          className="flex items-center justify-between w-full p-4 border rounded-lg cursor-pointer peer-checked:border-emerald-500 peer-checked:bg-emerald-50 hover:bg-gray-50"
                        >
                          <span>{option.label}</span>
                          {option.hearts > 0 && (
                            <span>{renderHearts(option.hearts)}</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {selectedAmount === 'custom' && (
                    <div className="mt-3">
                      <Label htmlFor="custom-amount">직접 입력 (원)</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        min="10000"
                        placeholder="최소 10,000원"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">응원 메시지 (선택사항)</Label>
                  <Textarea
                    id="message"
                    placeholder="서재에 전하고 싶은 말씀을 남겨주세요"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  disabled={isSubmitting || (selectedAmount === 'custom' && !customAmount)}
                >
                  {isSubmitting ? '처리 중...' : '후원하기'}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-8 text-sm text-muted-foreground text-center">
            <p>후원금은 콘텐츠 제작과 서비스 운영에 사용됩니다.</p>
            <p>궁금하신 점은 contact@sojae.com으로 문의해주세요.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 