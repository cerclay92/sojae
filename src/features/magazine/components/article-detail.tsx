'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Eye, Heart, Share } from 'lucide-react';

interface ArticleDetailProps {
  id: string;
  initialData?: any; // 서버에서 미리 가져온 데이터
}

export function ArticleDetail({ id, initialData }: ArticleDetailProps) {
  const [article, setArticle] = useState<any>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData); // 초기 데이터가 있으면 로딩 상태 아님
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 초기 데이터가 있으면 API 호출을 건너뛰지만,
    // 조회수 증가를 위해 API를 호출해야 함
    async function loadArticle() {
      if (initialData) {
        // 초기 데이터가 있어도 조회수를 증가시키기 위해 API 호출
        fetch(`/api/articles/${id}`).catch(e => 
          console.error('조회수 증가 실패:', e)
        );
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/articles/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('게시글을 찾을 수 없습니다.');
          }
          throw new Error('게시글을 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        setArticle(data);
      } catch (err: any) {
        console.error('게시글 로딩 에러:', err);
        setError(err.message || '게시글을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadArticle();
  }, [id, initialData]);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container py-10">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4">
            {error || '게시글을 찾을 수 없습니다'}
          </h1>
          <p className="text-muted-foreground mb-6">
            요청하신 게시글을 불러올 수 없습니다. 다시 시도해주세요.
          </p>
          <Button asChild>
            <Link href="/articles">모든 게시글 보기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/articles" className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          목록으로 돌아가기
        </Link>
      </Button>

      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-6">
            {article.categories && (
              <Badge variant="outline">{article.categories.name}</Badge>
            )}
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {article.views || 0}
            </span>
            <time dateTime={article.created_at}>
              {format(new Date(article.created_at), 'yyyy년 MM월 dd일')}
            </time>
          </div>

          {article.featured_image && (
            <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-8">
              <Image
                src={article.featured_image || `https://picsum.photos/id/${(parseInt(article.id) % 100) || 1}/1200/630`}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        <div className="prose prose-lg max-w-none mb-10" dangerouslySetInnerHTML={{ __html: article.content }} />

        <div className="flex justify-between items-center border-t border-b py-4 my-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{article.likes || 0}</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Share className="h-4 w-4" />
              공유하기
            </Button>
          </div>
          <div>
            <time className="text-sm text-muted-foreground" dateTime={article.updated_at}>
              마지막 수정: {format(new Date(article.updated_at), 'yyyy년 MM월 dd일')}
            </time>
          </div>
        </div>
      </article>
    </div>
  );
} 