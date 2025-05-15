import { Metadata } from "next";
import Link from "next/link";
import { protectAdminRoute } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
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

export const metadata: Metadata = {
  title: "게시글 관리 | 서재",
  description: "게시글 목록 및 관리",
};

async function getArticles() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("articles")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("게시글 조회 실패:", error);
    return [];
  }

  return data || [];
}

export default async function AdminArticlesPage() {
  await protectAdminRoute();
  const articles = await getArticles();

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
          <h1 className="text-3xl font-bold">게시글 관리</h1>
          <p className="text-muted-foreground">게시글 목록, 작성, 수정, 삭제</p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            새 게시글
          </Link>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>공개 상태</TableHead>
              <TableHead>작성일</TableHead>
              <TableHead>수정일</TableHead>
              <TableHead className="text-right">조회수</TableHead>
              <TableHead className="w-[60px]">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length > 0 ? (
              articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell>{article.id}</TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="font-medium hover:underline"
                    >
                      {article.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {article.categories && (
                      <Badge variant="outline">{article.categories.name}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {article.published ? (
                      <Badge variant="default">공개</Badge>
                    ) : (
                      <Badge variant="secondary">비공개</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(article.created_at), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(article.updated_at), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell className="text-right">{article.views || 0}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">메뉴</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/articles/${article.id}`} className="flex items-center">
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>수정</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          asChild
                        >
                          <Link href={`/admin/articles/${article.id}/delete`} className="flex items-center">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>삭제</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                  게시글이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 