import { MainLayout } from '@/components/layouts/main-layout';
import { getPostBySlug } from '@/features/magazine/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_MAP } from '@/constants/category';
import { Separator } from '@/components/ui/separator';
import { PostActions } from '@/features/magazine/components/post-actions';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug).catch(() => null);
    
    if (!post) {
      return {
        title: '포스트를 찾을 수 없습니다.',
      };
    }
    
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.created_at,
        modifiedTime: post.updated_at,
        authors: ['서재, 사람을 잇다'],
        images: [
          {
            url: post.thumbnail_url || `https://picsum.photos/id/${post.id.length % 100}/1200/630`,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
    };
  } catch (error) {
    console.error('메타데이터 생성 중 오류 발생:', error);
    return {
      title: '포스트를 찾을 수 없습니다.',
    };
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug).catch(() => null);
    
    if (!post) {
      notFound();
    }
    
    return (
      <MainLayout>
        <article className="container py-12">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4 mb-8">
              <Badge variant="outline" className="mb-2">
                {CATEGORY_MAP[post.category as keyof typeof CATEGORY_MAP]?.name}
              </Badge>
              
              <h1 className="text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
              
              <div className="text-muted-foreground mb-8">
                {formatDate(post.created_at)}
              </div>
              
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                <Image
                  src={post.thumbnail_url || `https://picsum.photos/id/${post.id.length % 100}/1200/630`}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            
            <div className="prose prose-lg prose-primary max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
            
            <Separator className="my-12" />
            
            <PostActions post={post} />
          </div>
        </article>
      </MainLayout>
    );
  } catch (error) {
    console.error('게시물 페이지 렌더링 중 오류 발생:', error);
    notFound();
  }
} 