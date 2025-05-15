'use client';

import Link from 'next/link';
import Image from 'next/image';
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

  return (
    <div className="border rounded-lg p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Flame className="text-primary w-4 h-4 md:w-5 md:h-5" />
        <h3 className="text-lg md:text-xl font-bold">인기 글</h3>
      </div>
      
      <div className="space-y-4 md:space-y-6">
        {posts.map((post, index) => (
          <div key={post.id} className="group">
            <Link href={`/articles/${post.id}`} className="flex gap-3 md:gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                <Image
                  src={post.thumbnail_url || `https://picsum.photos/id/${(parseInt(post.id) % 100) + index}/800/600`}
                  alt={post.title}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 56px, 64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Badge 
                  variant="outline" 
                  className="mb-1 text-xs"
                >
                  {post.category || '일반'}
                </Badge>
                <h4 className="font-medium mb-1 text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="text-xs text-muted-foreground">
                  {formatRelativeDate(post.created_at)}
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
          모든 인기 글 보기
        </Link>
      </div>
    </div>
  );
} 