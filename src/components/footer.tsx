'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { SITE_CONFIG } from '@/constants/metadata';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-background py-12">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            서재 기반의 감성 콘텐츠를 블로그 스타일로 제공하는 온라인 매거진
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">카테고리</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/category/에세이"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                에세이
              </Link>
            </li>
            <li>
              <Link 
                href="/category/인문학"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                인문학
              </Link>
            </li>
            <li>
              <Link 
                href="/category/문화"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                문화
              </Link>
            </li>
            <li>
              <Link 
                href="/category/상담"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                상담
              </Link>
            </li>
            <li>
              <Link 
                href="/category/인터뷰"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                인터뷰
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">구독</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/subscribe"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                구독하기
              </Link>
            </li>
            <li>
              <Link 
                href="/policy/privacy"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                개인정보처리방침
              </Link>
            </li>
            <li>
              <Link 
                href="/policy/terms"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                이용약관
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">문의</h3>
          <ul className="space-y-2">
            <li className="text-sm text-muted-foreground">
              이메일: contact@sojae.com
            </li>
            <li className="text-sm text-muted-foreground">
              전화: 02-123-4567
            </li>
            <li className="text-sm text-muted-foreground">
              주소: 서울특별시 강남구 테헤란로 123
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-8 pt-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {SITE_CONFIG.name}. 모든 권리 보유.
          </p>
          <div className="flex items-center gap-4">
            <Link 
              href={SITE_CONFIG.links.twitter}
              className="text-sm text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </Link>
            <Link 
              href={SITE_CONFIG.links.github}
              className="text-sm text-muted-foreground hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 