'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRelativeDate, truncateText } from '@/lib/utils';
import { CATEGORY_MAP } from '@/constants/category';
import { Post } from '@/features/magazine/api';
import { useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase-client';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'horizontal';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLiked) {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
      
      try {
        // supabaseClient가 null일 수 있으므로 getSupabaseClient 함수 사용
        const supabase = getSupabaseClient();
        
        const { error } = await supabase.rpc('increment_post_likes', {
          post_id: post.id,
        });
        
        if (error) {
          throw error;
        }
      } catch (error) {
        // 실패시 원래대로 되돌림
        setLikes((prev) => prev - 1);
        setIsLiked(false);
        console.error('좋아요 업데이트 실패:', error);
      }
    }
  };
  
  if (variant === 'horizontal') {
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 relative h-40 sm:h-full min-h-[8rem]">
            <Image
              src={post.thumbnail_url || `https://picsum.photos/id/${post.id.length % 100}/800/600`}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
          </div>
          <div className="w-full sm:w-2/3 flex flex-col">
            <CardHeader className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="outline" className="mb-1 sm:mb-2 text-xs sm:text-sm">
                  {CATEGORY_MAP[post.category as keyof typeof CATEGORY_MAP]?.name}
                </Badge>
                {post.is_premium && (
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    구독자 전용
                  </Badge>
                )}
              </div>
              <Link href={`/post/${post.slug}`}>
                <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight hover:text-primary transition-colors mt-1">
                  {post.title}
                </h3>
              </Link>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <p className="text-sm md:text-base text-muted-foreground line-clamp-2 sm:line-clamp-3">
                {truncateText(post.excerpt, 150)}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between items-center mt-auto p-3 sm:p-4 md:p-6 pt-0">
              <div className="text-xs sm:text-sm text-muted-foreground">
                {formatRelativeDate(post.created_at)}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1 px-2 h-8 ${isLiked ? 'text-primary' : ''}`}
                onClick={handleLike}
              >
                <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isLiked ? 'fill-primary' : ''}`} />
                <span className="text-xs sm:text-sm">{likes}</span>
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
      <div className="relative h-36 sm:h-40 md:h-48">
        <Image
          src={post.thumbnail_url || `https://picsum.photos/id/${post.id.length % 100}/800/600`}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
        {post.is_premium && (
          <Badge variant="secondary" className="absolute top-2 right-2 text-xs sm:text-sm">
            구독자 전용
          </Badge>
        )}
      </div>
      <CardHeader className="p-3 sm:p-4 md:p-6">
        <Badge variant="outline" className="mb-1 sm:mb-2 w-fit text-xs sm:text-sm">
          {CATEGORY_MAP[post.category as keyof typeof CATEGORY_MAP]?.name}
        </Badge>
        <Link href={`/post/${post.slug}`}>
          <h3 className="text-base sm:text-lg md:text-xl font-bold leading-tight hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-3 sm:p-4 md:p-6 pt-0">
        <p className="text-sm md:text-base text-muted-foreground line-clamp-2">
          {truncateText(post.excerpt, 100)}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-3 sm:p-4 md:p-6 pt-0">
        <div className="text-xs sm:text-sm text-muted-foreground">
          {formatRelativeDate(post.created_at)}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1 px-2 h-8 ${isLiked ? 'text-primary' : ''}`}
          onClick={handleLike}
        >
          <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isLiked ? 'fill-primary' : ''}`} />
          <span className="text-xs sm:text-sm">{likes}</span>
        </Button>
      </CardFooter>
    </Card>
  );
} 