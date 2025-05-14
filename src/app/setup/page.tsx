'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layouts/main-layout';
import { checkAndSetupEnv } from '@/lib/setup-env';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function SetupPage() {
  const [status, setStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});
  
  const [isLoading, setIsLoading] = useState(false);
  
  async function handleSetupEnv() {
    setIsLoading(true);
    
    try {
      const result = await checkAndSetupEnv();
      setStatus(result);
    } catch (error) {
      setStatus({
        success: false,
        message: `오류가 발생했습니다: ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <MainLayout>
      <div className="container py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>환경 변수 설정</CardTitle>
              <CardDescription>
                애플리케이션 실행에 필요한 환경 변수를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">
                이 기능은 개발 환경에서만 동작합니다. 프로덕션 환경에서는 
                환경 변수를 직접 설정해야 합니다.
              </p>
              
              {status.message && (
                <Alert className={status.success ? "bg-green-50" : "bg-red-50"}>
                  {status.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertTitle>
                    {status.success ? "성공" : "오류"}
                  </AlertTitle>
                  <AlertDescription>
                    {status.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSetupEnv} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "처리 중..." : ".env.local 파일 생성"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
} 