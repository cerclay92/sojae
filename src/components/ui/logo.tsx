'use client';

import Link from 'next/link';
import { BookOpenText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({
  className,
  size = 'md',
  showText = true,
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const iconSize = {
    sm: 18,
    md: 24,
    lg: 32,
  };

  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2 font-semibold text-primary',
        sizeClasses[size],
        className
      )}
    >
      <BookOpenText size={iconSize[size]} className="text-primary" />
      {showText && (
        <span className="text-primary select-none">
          <span>서재,</span> <span className="font-medium">사람을 잇다</span>
        </span>
      )}
    </Link>
  );
} 