'use client';

import { BookOpenText, MessagesSquare, Music, GraduationCap, Users } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface CategoryHeaderProps {
  category: {
    id: string;
    name: string;
    description: string;
  };
  postCount: number;
}

export function CategoryHeader({ category, postCount }: CategoryHeaderProps) {
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case '에세이':
        return <BookOpenText className="h-10 w-10" />;
      case '인문학':
        return <GraduationCap className="h-10 w-10" />;
      case '문화':
        return <Music className="h-10 w-10" />;
      case '상담':
        return <MessagesSquare className="h-10 w-10" />;
      case '인터뷰':
        return <Users className="h-10 w-10" />;
      default:
        return <BookOpenText className="h-10 w-10" />;
    }
  };

  return (
    <div className="bg-muted">
      <div className="container py-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="flex justify-center text-primary mb-4">
            {getCategoryIcon(category.id)}
          </div>
          <h1 className="text-4xl font-bold">{category.name}</h1>
          <p className="text-xl text-muted-foreground">{category.description}</p>
          <div className="text-sm text-muted-foreground">
            총 {formatNumber(postCount)}개의 게시물
          </div>
        </div>
      </div>
    </div>
  );
} 