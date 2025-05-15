'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useRef } from 'react';

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('비디오 자동 재생 실패:', error);
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[600px]">
      {/* 백그라운드 비디오 */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="https://fntiuopyonutxkeeipsc.supabase.co/storage/v1/object/public/video//hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 콘텐츠 */}
      <div className="container relative z-20 py-24 md:py-32 flex justify-center items-center">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
            서재, <span className="text-emerald-400">사람</span>을 잇다
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 mx-auto leading-relaxed font-medium drop-shadow-md px-4">
            양질의 글과 다양한 관점으로 독자의 지식과 사고를 넓혀드립니다.<br />
            삶의 지혜와 인사이트를 함께 나누는 공간입니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-md">
              <Link href="/about" className="text-base px-8 py-6">
                서비스 소개
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-md">
              <Link href="/posts" className="text-base px-8 py-6">
                모든 콘텐츠 보기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 