'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
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
      <div className="container relative z-20 py-24 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
            서재, <span className="text-emerald-400">사람</span>을 잇다
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-8 max-w-xl leading-relaxed">
            다양한 분야의 글로 여러분의 지적 호기심을 채워드립니다.
            당신이 찾던 인사이트가 여기 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/subscribe" className="text-base px-8 py-6">
                지금 구독하기 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
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