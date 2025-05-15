export const SITE_CONFIG = {
  name: '서재, 사람을 잇다',
  description: '서재 기반의 감성 콘텐츠를 블로그 스타일로 제공하는 온라인 매거진',
  url: 'https://sojae.vercel.app',
  ogImage: 'https://sojae.vercel.app/og.jpg',
  links: {
    twitter: 'https://twitter.com/sojae',
    github: 'https://github.com/sojae',
  },
  authors: [
    {
      name: 'Sojae Team',
      url: 'https://sojae.vercel.app',
    },
  ],
  categories: [
    { id: 'essay', name: '에세이' },
    { id: 'review', name: '리뷰' },
    { id: 'interview', name: '인터뷰' },
    { id: 'culture', name: '문화' },
    { id: 'lifestyle', name: '라이프스타일' },
    { id: 'tech', name: '테크' },
    { id: 'general', name: '일반' }
  ]
} as const; 