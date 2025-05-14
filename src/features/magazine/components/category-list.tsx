'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/constants/category';
import { BookOpenText, MessagesSquare, Music, GraduationCap, Users } from 'lucide-react';

export function CategoryList() {
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case '에세이':
        return <BookOpenText className="h-14 w-14" />;
      case '인문학':
        return <GraduationCap className="h-14 w-14" />;
      case '문화':
        return <Music className="h-14 w-14" />;
      case '상담':
        return <MessagesSquare className="h-14 w-14" />;
      case '인터뷰':
        return <Users className="h-14 w-14" />;
      default:
        return <BookOpenText className="h-14 w-14" />;
    }
  };

  const getCategoryIconColor = (categoryId: string) => {
    switch (categoryId) {
      case '에세이':
        return 'text-emerald-600 group-hover:text-emerald-500';
      case '인문학':
        return 'text-green-600 group-hover:text-green-500';
      case '문화':
        return 'text-teal-600 group-hover:text-teal-500';
      case '상담':
        return 'text-lime-600 group-hover:text-lime-500';
      case '인터뷰':
        return 'text-emerald-700 group-hover:text-emerald-600';
      default:
        return 'text-green-600 group-hover:text-green-500';
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-12">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="group flex flex-col items-center justify-center transition-all"
          >
            <div className={`mb-4 md:mb-5 transition-colors duration-200 ${getCategoryIconColor(category.id)}`}>
              {getCategoryIcon(category.id)}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-center group-hover:text-emerald-600 transition-colors duration-200">{category.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}