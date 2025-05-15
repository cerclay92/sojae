'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase-client';
import { use } from 'react';

export default function DeleteArticlePage({ params }: { params: { id: string } }) {
  // params를 unwrap하여 안전하게 id에 접근
  const { id } = use(params);
  
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const supabase = getSupabaseClient();
        
        // 게시글 데이터 가져오기
        const { data, error } = await supabase
          .from('articles')
          .select('id, title')
          .eq('id', id)
          .single();
          
        if (error) {
          throw error;
        }
        
        setArticle(data);
      } catch (err: any) {
        console.error('게시글 조회 실패:', err);
        setError(err.message || '게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const supabase = getSupabaseClient();
      
      // 게시글 삭제
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // 목록 페이지로 리다이렉트
      router.push('/admin/articles');
      router.refresh();
    } catch (err: any) {
      console.error('게시글 삭제 실패:', err);
      setError(err.message || '게시글 삭제 중 오류가 발생했습니다.');
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-6">
      <Button variant="ghost" size="sm" asChild className="gap-1 mb-4">
        <Link href="/admin/articles">
          <ArrowLeft className="h-4 w-4" />
          뒤로 가기
        </Link>
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>게시글 삭제</CardTitle>
          <CardDescription>
            이 작업은 되돌릴 수 없습니다. 신중하게 진행해주세요.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                다음 게시글을 삭제하시겠습니까?
              </p>
              <div className="border p-4 rounded-md">
                <h3 className="font-medium">{article?.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">ID: {article?.id}</p>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/admin/articles">취소</Link>
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isLoading || isDeleting || !!error}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? '삭제 중...' : '게시글 삭제'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 