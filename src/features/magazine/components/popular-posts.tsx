'use client';

import Link from 'next/link';
import { Flame, InfoIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Post } from '@/features/magazine/api';

interface PopularPostsProps {
  posts: Post[];
}

export function PopularPosts({ posts }: PopularPostsProps) {
  if (posts.length === 0) {
    return (
      <div className="border rounded-lg p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          <Flame className="text-primary w-4 h-4 md:w-5 md:h-5" />
          <h3 className="text-lg md:text-xl font-bold">인기 글</h3>
        </div>
        
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>인기 게시글이 없습니다</AlertTitle>
          <AlertDescription>
            아직 인기 게시글이 없습니다. 곧 새로운 글이 업데이트될 예정입니다.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 카테고리별 뱃지 색상 정의
  const getBadgeVariant = (category: string) => {
    switch (category) {
      case '에세이':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '인문학':
        return 'bg-green-50 text-green-700 border-green-200';
      case '문화':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case '상담':
        return 'bg-lime-50 text-lime-700 border-lime-200';
      case '인터뷰':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="border rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Flame className="text-primary w-4 h-4 md:w-5 md:h-5" />
        <h3 className="text-lg md:text-xl font-bold">인기 글</h3>
      </div>
      
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={post.id} className="group">
            <Link href={`/articles/${post.id}`} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <span className="font-medium text-slate-700">{index + 1}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1.5 py-0 ${getBadgeVariant(post.category || '일반')}`}
                  >
                    {post.category || '일반'}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {formatRelativeDate(post.created_at)}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      <div className="mt-4 md:mt-6 pt-2 md:pt-4 border-t">
        <Link 
          href="/articles" 
          className="text-sm text-primary hover:text-primary/80 transition-colors flex justify-center"
        >
          모든 인기글 보기
        </Link>
      </div>
    </div>
  );
} 