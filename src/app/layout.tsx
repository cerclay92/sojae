import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { SITE_CONFIG } from '@/constants/metadata';

// 모노스페이스 폰트는 코드 표시 등에 계속 사용
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Paperlogy 폰트는 globals.css에 정의됨

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  authors: [...SITE_CONFIG.authors],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
    creator: '@sojae',
  },
  icons: {
    icon: 'https://fntiuopyonutxkeeipsc.supabase.co/storage/v1/object/public/video//favicon.ico',
    shortcut: 'https://fntiuopyonutxkeeipsc.supabase.co/storage/v1/object/public/video//favicon.ico',
    apple: 'https://fntiuopyonutxkeeipsc.supabase.co/storage/v1/object/public/video//favicon.ico',
  },
  manifest: `${SITE_CONFIG.url}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="ko">
      <head>
        <link rel="icon" href="https://fntiuopyonutxkeeipsc.supabase.co/storage/v1/object/public/video//favicon.ico" />
      </head>
      <body
        className={`${geistMono.variable} min-h-screen bg-background antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
