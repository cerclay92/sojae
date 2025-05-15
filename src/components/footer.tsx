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
            책과 사람을 연결하는 인문학의 향연, 지식과 영감이 어우러진 문화 공간
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
          <h3 className="text-lg font-medium mb-4">이용약관</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="https://picturesque-ox-876.notion.site/1f4ae7b4e95380738a46eafb2db525df?pvs=4"
                className="text-sm text-muted-foreground hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보 처리방침
              </Link>
            </li>
            <li>
              <Link 
                href="https://picturesque-ox-876.notion.site/1f4ae7b4e953801fb3b9eb89ce0fbb94?pvs=4"
                className="text-sm text-muted-foreground hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                서비스 이용약관
              </Link>
            </li>
            <li>
              <Link 
                href="https://picturesque-ox-876.notion.site/1f4ae7b4e95380ecbe1fe994c59f8dd3?pvs=4"
                className="text-sm text-muted-foreground hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                오픈소스 라이선스
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