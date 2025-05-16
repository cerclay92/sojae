import { MainLayout } from '@/components/layouts/main-layout';
import { Metadata } from 'next';
import { getArticleById } from '@/features/magazine/api';
import { notFound } from 'next/navigation';
import { ArticleDetail } from '@/features/magazine/components/article-detail';

interface ArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  try {
    // 메타데이터 생성에서는 React.use()를 사용할 수 없으므로 await를 사용
    const resolvedParams = await params;
    const article = await getArticleById(resolvedParams.id);
    return {
      title: `${article.title} | 서재`,
      description: article.excerpt || '게시글 상세 내용',
    };
  } catch (error) {
    return {
      title: '게시글을 찾을 수 없습니다 | 서재',
      description: '요청하신 게시글을 찾을 수 없습니다.',
    };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    // async 함수에서는 use() 대신 await 사용
    const resolvedParams = await params;
    
    // 서버에서 초기 데이터 가져오기
    const initialData = await getArticleById(resolvedParams.id);
    
    return (
      <MainLayout>
        {/* 클라이언트 컴포넌트를 렌더링하고 초기 데이터 전달 */}
        <ArticleDetail id={resolvedParams.id} initialData={initialData} />
      </MainLayout>
    );
  } catch (error) {
    // article을 찾을 수 없으면 404 페이지 표시
    notFound();
  }
} 