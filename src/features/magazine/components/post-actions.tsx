'use client';

import { useState } from 'react';
import { Post } from '@/features/magazine/api';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Bookmark } from 'lucide-react';
import { CATEGORY_MAP } from '@/constants/category';
import { getSupabaseClient } from '@/lib/supabase-client';
import Link from 'next/link';

interface PostActionsProps {
  post: Post;
}

export function PostActions({ post }: PostActionsProps) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const handleLike = async () => {
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
  
  const handleSave = () => {
    setIsSaved(!isSaved);
    // 실제 구현에서는 저장 로직이 추가될 수 있습니다
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('공유하기 실패:', error);
      }
    } else {
      // 클립보드 복사 폴백
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 클립보드에 복사되었습니다.');
      } catch (error) {
        console.error('클립보드 복사 실패:', error);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button
          variant={isLiked ? "default" : "outline"} 
          className="gap-2"
          onClick={handleLike}
        >
          <Heart className={isLiked ? "fill-primary-foreground" : ""} size={18} />
          <span>{likes}</span>
        </Button>
        
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleShare}
        >
          <Share2 size={18} />
          <span>공유하기</span>
        </Button>
        
        <Button
          variant={isSaved ? "default" : "outline"}
          className="gap-2"
          onClick={handleSave}
        >
          <Bookmark className={isSaved ? "fill-primary-foreground" : ""} size={18} />
          <span>{isSaved ? "저장됨" : "저장하기"}</span>
        </Button>
      </div>
      
      <div className="pt-4 border-t">
        <p className="font-medium mb-2">같은 카테고리의 다른 글</p>
        <Button variant="link" asChild className="p-0 h-auto text-primary">
          <Link href={`/category/${post.category}`}>
            {CATEGORY_MAP[post.category as keyof typeof CATEGORY_MAP]?.name} 더보기
          </Link>
        </Button>
      </div>
    </div>
  );
} 