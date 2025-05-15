import { Metadata } from "next";
import Link from "next/link";
import { checkAdminAccess, protectAdminRoute } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, MoreHorizontal, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllSubscribers } from "@/features/subscribe/api";
import { createClient } from "@supabase/supabase-js";
import { SubscriptionActions } from "@/features/admin/components/subscription-actions";

export const metadata: Metadata = {
  title: "구독자 관리 | 서재",
  description: "구독자 목록 및 관리",
};

// 사용자 상세 정보 가져오기
async function getUserDetails(emails: string[]) {
  if (emails.length === 0) return {};
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("users")
    .select("id, email, display_name, created_at")
    .in("email", emails);

  if (error) {
    console.error("사용자 정보 조회 실패:", error);
    return {};
  }

  return data.reduce((acc, user) => {
    acc[user.email] = user;
    return acc;
  }, {} as Record<string, any>);
}

export default async function SubscribersPage() {
  // 인증 체크 및 보호
  await protectAdminRoute();
  
  const subscribers = await getAllSubscribers();
  
  // 구독자 이메일 목록
  const emails = subscribers.map(sub => sub.email);
  
  // 사용자 상세 정보 가져오기
  const userDetails = await getUserDetails(emails);
  
  // 구독 상태에 따른 배지 색상
  const getStatusBadge = (status: string, expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    
    if (status === 'canceled') {
      return <Badge variant="destructive">해지됨</Badge>;
    }
    
    if (expiry < now) {
      return <Badge variant="outline" className="text-yellow-600 border-yellow-600">만료됨</Badge>;
    }
    
    // 7일 이내 만료 예정
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);
    
    if (expiry < sevenDaysLater) {
      return <Badge variant="outline" className="text-orange-600 border-orange-600">곧 만료</Badge>;
    }
    
    return <Badge variant="default" className="bg-green-600">활성</Badge>;
  };
  
  return (
    <div className="space-y-6 p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="sm" asChild className="gap-1">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4" />
                관리자 대시보드
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold">구독자 관리</h1>
          <p className="text-muted-foreground">구독자 목록 및 현황 관리</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          목록 내보내기
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>구독 종류</TableHead>
              <TableHead>구독 시작일</TableHead>
              <TableHead>만료일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="w-[60px]">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.length > 0 ? (
              subscribers.map((subscriber) => {
                const user = userDetails[subscriber.email] || {};
                return (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      {user.display_name || '미등록'}
                    </TableCell>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {subscriber.subscription_type === 'monthly' ? '월간 구독' : '연간 구독'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(subscriber.created_at), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(subscriber.expires_at), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(subscriber.status, subscriber.expires_at)}
                    </TableCell>
                    <TableCell>
                      <SubscriptionActions 
                        subscription={subscriber} 
                        userName={user.display_name || ''}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  구독자가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 