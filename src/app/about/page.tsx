'use client';

import { MainLayout } from '@/components/layouts/main-layout';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { BookMarked, BookOpen, Coffee, Users, School, Heart, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function AboutPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const sectionRefs = useRef<HTMLElement[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <MainLayout>
      {/* 헤더 섹션 */}
      <section className="relative bg-gradient-to-r from-emerald-700 to-green-600 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              서재, 사람을 잇다
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              인문학과 문화, 종교, 그리고 사람 사이의 이야기를 나누는 공간
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-emerald-100">
              <span className="bg-emerald-800 bg-opacity-50 px-4 py-2 rounded-full">#인문학</span>
              <span className="bg-emerald-800 bg-opacity-50 px-4 py-2 rounded-full">#문화</span>
              <span className="bg-emerald-800 bg-opacity-50 px-4 py-2 rounded-full">#종교</span>
              <span className="bg-emerald-800 bg-opacity-50 px-4 py-2 rounded-full">#사람</span>
              <span className="bg-emerald-800 bg-opacity-50 px-4 py-2 rounded-full">#소통</span>
            </div>
          </div>
        </div>
      </section>

      {/* 창간 메시지 */}
      <section ref={addToRefs} className="py-16 md:py-24 opacity-0 transition-opacity duration-1000">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-10">
              <Quote className="text-emerald-200 absolute -top-6 -left-6 w-16 h-16 opacity-50" />
              <blockquote className="relative z-10 text-xl md:text-2xl text-gray-700 italic leading-relaxed px-8">
                <p className="mb-4">
                  저는 책을 읽고 연구하며, 그 배움을 사람들과 함께 나누는 일을 좋아합니다. 이것이 제 소명이라고 믿습니다. 하지만 제가 접한 소중한 배움들이 많은 사람들에게는 여전히 쉽게 다가가기 어려운 길이었습니다.
                </p>
                <p className="mb-4">
                  어떻게 하면 더 편하고 넓게 나눌 수 있을까 하는 생각 끝에, 온라인 소식지 '서재, 사람을 잇다'를 시작하게 되었습니다. 비록 오프라인 서재 공간은 잠시 쉬어가지만, 서재의 인문학 강좌는 12년째 이어지고 있습니다.
                </p>
                <p>
                  서재의 이름으로 여전히 많은 분들과 의미있는 만남이 계속되고 있기에, 이제는 그 만남을 다시 온라인으로 시작하고자 합니다. 서재, 사람을 잇다를 통해 더 많은 분들과 함께 사유하며 소통할 수 있기를 기대합니다.
                </p>
              </blockquote>
              <div className="text-right mt-4 text-gray-600">- 오지섭 (서재 대표)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 운영자 소개 */}
      <section ref={addToRefs} className="py-16 md:py-24 bg-gray-50 opacity-0 transition-opacity duration-1000">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-500">
              서재를 운영하는 사람들
            </span>
          </h2>
          
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-8">
            {/* 오지섭 교수 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center sm:items-start">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-emerald-100">
                    <Image 
                      src="/images/ojiseop.jpg" 
                      alt="오지섭 교수"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://picsum.photos/id/23/400/400";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">오지섭</h3>
                    <p className="text-emerald-700 font-medium mb-4">서강대학교 종교학과 교수</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">종교학</span>
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">인문학</span>
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">철학</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  서강대학교 종교학과 교수로서 종교학, 철학을 연구하고 강의하며, 12년째 '서재'의 인문학 강좌를 이끌고 있습니다. 책을 읽고 연구하며 그 배움을 많은 사람들과 함께 나누는 것이 인생의 소명이라고 믿습니다.
                </p>
                <p className="text-gray-600">
                  북카페 '서재'를 통해 일반인들에게 인문학을 알리고 소통하는 의미있는 공간을 만들고자 노력해왔으며, 이제 온라인을 통해 더 많은 분들과 인문학적 소통을 이어가고자 합니다.
                </p>
              </div>
            </div>
            
            {/* 박재신 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col sm:flex-row gap-6 mb-6 items-center sm:items-start">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden flex-shrink-0 border-4 border-emerald-100">
                    <Image 
                      src="/images/parkjaeshin.jpg" 
                      alt="박재신" 
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://picsum.photos/id/76/400/400";
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">박재신</h3>
                    <p className="text-emerald-700 font-medium mb-4">유앤아이 프로그램 창시자</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">심리학</span>
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">소통</span>
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1 rounded-full">교육</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  유앤아이 프로그램의 창시자로서 인간 심리와 관계, 소통에 대한 깊은 이해를 바탕으로 다양한 교육 프로그램을 개발해왔습니다. 북카페 '서재'를 오지섭 교수와 함께 운영하며 인문학과 문화, 종교를 주제로 한 모임을 이끌어 왔습니다.
                </p>
                <p className="text-gray-600">
                  사람과 사람 사이의 진정한 소통과 이해를 중요시하며, '서재, 사람을 잇다'를 통해 온라인에서도 의미 있는 대화와 교류가 이루어질 수 있도록 노력하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 서재의 역사 */}
      <section ref={addToRefs} className="py-16 md:py-24 opacity-0 transition-opacity duration-1000">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-500">
              서재의 이야기
            </span>
          </h2>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative border-l-4 border-emerald-200 pl-8 ml-4 md:ml-8 space-y-16">
              {/* 2010년 - 북카페 서재의 시작 */}
              <div className="relative">
                <div className="absolute -left-12 top-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                  <Coffee className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-emerald-800 font-bold text-xl mb-2">2010년 - 북카페 '서재'의 시작</div>
                  <p className="text-gray-600 mb-4">
                    오지섭 교수와 박재신 씨가 인문학을 사랑하는 사람들을 위한 소통의 공간으로 북카페 '서재'를 오픈했습니다. 작은 공간이지만 책과 커피, 그리고 뜻깊은 대화를 나눌 수 있는 문화 사랑방으로 시작되었습니다.
                  </p>
                  <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                    <Image 
                      src="https://picsum.photos/id/42/1200/800" 
                      alt="북카페 서재" 
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* 인문학 강좌의 시작 */}
              <div className="relative">
                <div className="absolute -left-12 top-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-emerald-800 font-bold text-xl mb-2">인문학 강좌의 시작</div>
                  <p className="text-gray-600 mb-4">
                    북카페 '서재'에서는 시니어, 청소년, 가족 등을 위한 다양한 인문학 강좌를 진행했습니다. 
                    논어, 장자, 동서양의 영성 등 깊이 있는 인문학적 주제들을 일반인들이 쉽게 접할 수 있도록 했습니다.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
                      <Image 
                        src="https://picsum.photos/id/20/800/600" 
                        alt="인문학 강좌" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-48 rounded-lg overflow-hidden shadow-md">
                      <Image 
                        src="https://picsum.photos/id/24/800/600" 
                        alt="인문학 강좌" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 온라인으로의 확장 */}
              <div className="relative">
                <div className="absolute -left-12 top-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-emerald-800 font-bold text-xl mb-2">2023년 - '서재, 사람을 잇다' 온라인 플랫폼</div>
                  <p className="text-gray-600 mb-4">
                    오프라인 서재 공간은 잠시 쉬어가지만, 12년 동안 이어온 서재의 인문학 정신을 더 넓게 나누기 위해 온라인 플랫폼 '서재, 사람을 잇다'를 시작했습니다. 인문학과 문화, 종교, 사람 사이의 이야기를 더 많은 분들과 나누고자 합니다.
                  </p>
                  <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                    <Image 
                      src="https://picsum.photos/id/36/1200/800" 
                      alt="서재, 사람을 잇다 온라인 플랫폼" 
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 가치 */}
      <section ref={addToRefs} className="py-16 md:py-24 bg-emerald-50 opacity-0 transition-opacity duration-1000">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-green-500">
              '서재'의 핵심 가치
            </span>
          </h2>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BookMarked className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">인문학의 대중화</h3>
              <p className="text-gray-600 text-center">
                어렵게만 느껴지는 인문학을 일상에서 쉽게 접하고 이해할 수 있도록 합니다. 깊이 있는 사유와 성찰을 누구나 경험할 수 있게 하는 것이 우리의 가치입니다.
              </p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">사람과 사람을 잇다</h3>
              <p className="text-gray-600 text-center">
                '서재'는 단순한 콘텐츠 제공을 넘어 사람과 사람을 연결하는 플랫폼입니다. 함께 읽고, 생각하고, 나누며 의미 있는 관계를 형성합니다.
              </p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Heart className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">일상의 성찰과 지혜</h3>
              <p className="text-gray-600 text-center">
                거창한 변화가 아닌, 일상 속 작은 실천과 성찰을 통해 삶의 지혜를 찾습니다. 인문학이 우리 삶에 실질적인 의미와 가치를 더할 수 있도록 합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section ref={addToRefs} className="py-16 md:py-24 bg-gradient-to-r from-emerald-700 to-green-600 text-white opacity-0 transition-opacity duration-1000">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">함께 인문학의 여정을 떠나요</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            '서재, 사람을 잇다'와 함께 인문학, 문화, 종교, 그리고 사람 사이의 이야기를 발견하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-gray-100">
              <Link href="/articles" className="px-8 py-6">
                콘텐츠 둘러보기
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-emerald-800 bg-opacity-50 hover:bg-opacity-70">
              <Link href="/subscribe" className="px-8 py-6">
                구독하기
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </MainLayout>
  );
} 