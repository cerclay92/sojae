'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate, truncateText } from '@/lib/utils';
import { CATEGORY_MAP } from '@/constants/category';
import { Post } from '@/features/magazine/api';

interface PopularPostsProps {
  posts: Post[];
}

export function PopularPosts({ posts }: PopularPostsProps) {
  if (posts.length === 0) {
    return null;
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
            <Link href={`/post/${post.slug}`} className="flex gap-3 md:gap-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                <Image
                  src={post.thumbnail_url || `https://picsum.photos/id/${post.id.length % 100 + index}/800/600`}
                  alt={post.title}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 56px, 64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Badge variant="outline" className="mb-1 text-xs">
                  {CATEGORY_MAP[post.category as keyof typeof CATEGORY_MAP]?.name}
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
          href="/popular" 
          className="text-sm text-primary hover:text-primary/80 transition-colors flex justify-center"
        >
          모든 인기 글 보기
        </Link>
      </div>
    </div>
  );
} 