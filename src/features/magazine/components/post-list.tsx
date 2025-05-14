'use client';

import { Post } from '@/features/magazine/api';
import { PostCard } from '@/features/magazine/components/post-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PostListProps {
  posts: Post[];
  variant?: 'grid' | 'list';
  showViewMore?: boolean;
}

export function PostList({
  posts,
  variant = 'grid',
  showViewMore = true,
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-base md:text-lg text-muted-foreground">게시물이 없습니다.</p>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4 md:space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} variant="horizontal" />
        ))}
        
        {showViewMore && (
          <div className="flex justify-center mt-6 md:mt-8">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/posts">더보기</Link>
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {showViewMore && (
        <div className="flex justify-center mt-6 md:mt-8">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/posts">더보기</Link>
          </Button>
        </div>
      )}
    </div>
  );
} 