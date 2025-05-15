'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { type Database } from '@/lib/supabase';
import { Category, CATEGORY_ID_TO_NUMERIC } from '@/constants/category';

export type Post = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  thumbnail_url: string | null;
  category: string;
  excerpt: string;
  slug: string;
  likes: number;
  published: boolean;
  is_premium: boolean;
};

// 샘플 게시글 데이터
const samplePosts: Post[] = [
  {
    id: '1',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    updated_at: '2025-05-14T04:21:17.782891+00:00',
    title: '에세이: 개인적인 경험과 생각을 담은 글',
    content: '<p>개인적인 경험과 생각을 담은 글로, 다양한 주제에 대한 에세이를 담고 있습니다.</p>',
    excerpt: '개인적인 경험과 생각을 담은 글로, 다양한 주제에 대한 에세이를 담고 있습니다.',
    thumbnail_url: 'https://picsum.photos/id/24/800/600',
    category: '에세이',
    slug: 'essay-personal-experience',
    likes: 120,
    published: true,
    is_premium: false
  },
  {
    id: '2',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    updated_at: '2025-05-14T04:21:17.782891+00:00',
    title: '인문학: 사고의 틀을 넓히는 글',
    content: '<p>인문학적 사고와 통찰을 담은 글로, 철학, 역사, 문학 등 다양한 인문학 주제를 다룹니다.</p>',
    excerpt: '인문학적 사고와 통찰을 담은 글로, 철학, 역사, 문학 등 다양한 인문학 주제를 다룹니다.',
    thumbnail_url: 'https://picsum.photos/id/42/800/600',
    category: '인문학',
    slug: 'humanities-expanding-thoughts',
    likes: 98,
    published: true,
    is_premium: false
  },
  {
    id: '3',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    updated_at: '2025-05-14T04:21:17.782891+00:00',
    title: '문화: 현대사회 트렌드에 관한 분석',
    content: '<p>문화적 현상과 트렌드에 관한 분석과 해석을 담은 글입니다.</p>',
    excerpt: '문화적 현상과 트렌드에 관한 분석과 해석을 담은 글입니다.',
    thumbnail_url: 'https://picsum.photos/id/68/800/600',
    category: '문화',
    slug: 'culture-trend-analysis',
    likes: 76,
    published: true,
    is_premium: false
  },
  {
    id: '4',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    updated_at: '2025-05-14T04:21:17.782891+00:00',
    title: '상담 사례: 다양한 심리 상담 이야기',
    content: '<p>다양한 심리 상담 사례와 해석, 그리고 조언을 담은 글입니다.</p>',
    excerpt: '다양한 심리 상담 사례와 해석, 그리고 조언을 담은 글입니다.',
    thumbnail_url: 'https://picsum.photos/id/96/800/600',
    category: '상담',
    slug: 'counseling-cases',
    likes: 64,
    published: true,
    is_premium: false
  },
  {
    id: '5',
    created_at: '2025-05-12T04:21:17.782891+00:00',
    updated_at: '2025-05-14T04:21:17.782891+00:00',
    title: '인터뷰: 분야의 전문가들과의 대화',
    content: '<p>다양한 분야의 전문가들과 진행한 인터뷰 내용을 담은 글입니다.</p>',
    excerpt: '다양한 분야의 전문가들과 진행한 인터뷰 내용을 담은 글입니다.',
    thumbnail_url: 'https://picsum.photos/id/100/800/600',
    category: '인터뷰',
    slug: 'expert-interviews',
    likes: 58,
    published: true,
    is_premium: false
  }
];

// 샘플 인기 게시글 조회 (내부 헬퍼 함수)
function _getSamplePopularPosts(limit: number = 5): Post[] {
  return [...samplePosts].sort((a, b) => b.likes - a.likes).slice(0, limit);
}

// 카테고리별 게시글 찾기 (내부 헬퍼 함수)
function _getSamplePostsByCategory(category: string): Post[] {
  return samplePosts.filter(post => post.category === category);
}

// 게시글 상세 조회 (내부 헬퍼 함수)
function _getSamplePostBySlug(slug: string): Post | undefined {
  return samplePosts.find(post => post.slug === slug);
}

// 카테고리 이름을 ID로 변환하는 함수
function getCategoryIdFromName(categoryName: string): number {
  if (categoryName in CATEGORY_ID_TO_NUMERIC) {
    return CATEGORY_ID_TO_NUMERIC[categoryName as Category];
  }
  
  // 직접 매핑 (fallback)
  const categoryMap: Record<string, number> = {
    '에세이': 1,
    '인문학': 2,
    '문화': 3,
    '상담': 4,
    '인터뷰': 5
  };
  
  return categoryMap[categoryName] || 1; // 기본값으로 1(에세이) 반환
}

export async function getPosts({
  limit = 10,
  offset = 0,
  category,
  onlyPublished = true,
}: {
  limit?: number;
  offset?: number;
  category?: Category;
  onlyPublished?: boolean;
}) {
  try {
    // 환경 변수가 설정되어 있는지 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase 환경 변수가 설정되어 있지 않습니다. 샘플 데이터를 사용합니다.');
      if (category) {
        return _getSamplePostsByCategory(category).slice(offset, offset + limit);
      }
      return samplePosts.slice(offset, offset + limit);
    }
    
    const supabase = getSupabaseServer();
    
    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (onlyPublished) {
      query = query.eq('published', true);
    }

    if (category) {
      // 카테고리 이름이 숫자가 아닌 경우, ID로 변환
      const categoryId = isNaN(Number(category)) ? getCategoryIdFromName(category) : Number(category);
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('데이터베이스 쿼리 오류(articles):', error.message);
      // 오류 발생 시 빈 배열 반환
      return [];
    }

    if (!data || data.length === 0) {
      // 데이터가 없을 경우 빈 배열 반환
      return [];
    }

    // articles 테이블의 데이터를 Post 타입에 맞게 변환
    const posts = data.map(article => ({
      id: article.id.toString(),
      title: article.title,
      slug: article.slug || `article-${article.id}`,
      content: article.content,
      excerpt: article.excerpt,
      thumbnail_url: article.featured_image,
      category: article.category_id?.toString() || '1',
      created_at: article.created_at,
      updated_at: article.updated_at,
      likes: article.views || 0,
      published: article.published,
      is_premium: false
    }));

    return posts as Post[];
  } catch (error) {
    console.error('게시물 가져오기 실패:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    // 환경 변수가 설정되어 있는지 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase 환경 변수가 설정되어 있지 않습니다. 샘플 데이터를 사용합니다.');
      const post = _getSamplePostBySlug(slug);
      if (post) {
        return post;
      }
      throw new Error(`게시물을 찾을 수 없습니다: ${slug}`);
    }
    
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      throw new Error(`게시물을 가져오는데 실패했습니다: ${error.message}`);
    }

    // articles 테이블의 데이터를 Post 타입에 맞게 변환
    const post = {
      id: data.id.toString(),
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      thumbnail_url: data.featured_image,
      category: data.category_id?.toString() || '1',
      created_at: data.created_at,
      updated_at: data.updated_at,
      likes: data.views || 0,
      published: data.published,
      is_premium: false
    };

    return post as Post;
  } catch (error) {
    console.error('게시물 가져오기 실패:', error);
    throw error;
  }
}

export async function getPostById(id: string) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`게시물을 가져오는데 실패했습니다: ${error.message}`);
    }

    // articles 테이블의 데이터를 Post 타입에 맞게 변환
    const post = {
      id: data.id.toString(),
      title: data.title,
      slug: data.slug || `article-${data.id}`,
      content: data.content,
      excerpt: data.excerpt,
      thumbnail_url: data.featured_image,
      category: data.category_id?.toString() || '1',
      created_at: data.created_at,
      updated_at: data.updated_at,
      likes: data.views || 0,
      published: data.published,
      is_premium: false
    };

    return post as Post;
  } catch (error) {
    console.error('게시물 조회 실패:', error);
    throw error;
  }
}

export async function getArticleById(id: string) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('articles')
      .select('*, categories(*)')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`게시글 조회 실패: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    throw error;
  }
}

export async function getPostsByCategory(category: Category, limit = 10) {
  try {
    const supabase = getSupabaseServer();
    
    // 카테고리 이름이 숫자가 아닌 경우, ID로 변환
    const categoryId = isNaN(Number(category)) ? getCategoryIdFromName(category) : Number(category);
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category_id', categoryId)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('카테고리별 게시물 가져오기 실패:', error.message);
      // 오류 발생 시 빈 배열 반환
      return [];
    }

    if (!data || data.length === 0) {
      // 데이터가 없을 경우 빈 배열 반환
      return [];
    }

    // articles 테이블의 데이터를 Post 타입에 맞게 변환
    const posts = data.map(article => ({
      id: article.id.toString(),
      title: article.title,
      slug: article.slug || `article-${article.id}`,
      content: article.content,
      excerpt: article.excerpt,
      thumbnail_url: article.featured_image,
      category: article.category_id?.toString() || '1',
      created_at: article.created_at,
      updated_at: article.updated_at,
      likes: article.views || 0,
      published: article.published,
      is_premium: false
    }));

    return posts as Post[];
  } catch (error) {
    console.error('카테고리별 게시물 가져오기 실패:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
}

export async function getPopularPosts(limit = 5) {
  try {
    // 환경 변수가 설정되어 있는지 확인
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase 환경 변수가 설정되어 있지 않습니다. 샘플 데이터를 사용합니다.');
      return _getSamplePopularPosts(limit);
    }
    
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('views', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('인기 게시물 가져오기 실패:', error.message);
      // 오류 발생 시 빈 배열 반환
      return [];
    }

    if (!data || data.length === 0) {
      // 데이터가 없을 경우 빈 배열 반환
      return [];
    }

    // articles 테이블의 데이터를 Post 타입에 맞게 변환
    const posts = data.map(article => ({
      id: article.id.toString(),
      title: article.title,
      slug: article.slug || `article-${article.id}`,
      content: article.content,
      excerpt: article.excerpt,
      thumbnail_url: article.featured_image,
      category: article.category_id?.toString() || '1',
      created_at: article.created_at,
      updated_at: article.updated_at,
      likes: article.views || 0,
      published: article.published,
      is_premium: false
    }));

    return posts as Post[];
  } catch (error) {
    console.error('인기 게시물 가져오기 실패:', error);
    // 오류 발생 시 빈 배열 반환
    return [];
  }
}

export async function getPostCount(category?: Category) {
  try {
    const supabase = getSupabaseServer();
    
    let query = supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);

    if (category) {
      // 카테고리 이름이 숫자가 아닌 경우, ID로 변환
      const categoryId = isNaN(Number(category)) ? getCategoryIdFromName(category) : Number(category);
      query = query.eq('category_id', categoryId);
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`게시물 수 가져오기 실패: ${error.message}`);
    }

    return count;
  } catch (error) {
    console.error('게시물 수 가져오기 실패:', error);
    throw error;
  }
}

export async function updatePostLikes(id: string) {
  try {
    const supabase = getSupabaseServer();
    
    // views 컬럼 업데이트
    const { error } = await supabase.rpc('increment_article_views', {
      article_id: id
    });

    if (error) {
      throw new Error(`게시물 조회수 업데이트 실패: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('게시물 조회수 업데이트 실패:', error);
    throw error;
  }
}

// Admin functions
export async function createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes'>) {
  try {
    const supabase = getSupabaseServer();
    
    // Post 타입에서 articles 테이블 형식으로 변환
    const articleData = {
      title: postData.title,
      slug: postData.slug,
      content: postData.content,
      excerpt: postData.excerpt,
      featured_image: postData.thumbnail_url,
      category_id: postData.category,
      published: postData.published
    };
    
    const { data, error } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();

    if (error) {
      throw new Error(`게시물 생성 실패: ${error.message}`);
    }

    // articles 테이블의 데이터를 Post 타입에 맞게 변환
    const post = {
      id: data.id.toString(),
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      thumbnail_url: data.featured_image,
      category: data.category_id?.toString() || '1',
      created_at: data.created_at,
      updated_at: data.updated_at,
      likes: data.views || 0,
      published: data.published,
      is_premium: false
    };

    return post as Post;
  } catch (error) {
    console.error('게시물 생성 실패:', error);
    throw error;
  }
}

export async function updatePost(
  id: string, 
  postData: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>
) {
  try {
    const supabase = getSupabaseServer();
    
    // Post 타입에서 articles 테이블 형식으로 변환
    const articleData: any = {};
    if (postData.title !== undefined) articleData.title = postData.title;
    if (postData.slug !== undefined) articleData.slug = postData.slug;
    if (postData.content !== undefined) articleData.content = postData.content;
    if (postData.excerpt !== undefined) articleData.excerpt = postData.excerpt;
    if (postData.thumbnail_url !== undefined) articleData.featured_image = postData.thumbnail_url;
    if (postData.category !== undefined) articleData.category_id = postData.category;
    if (postData.published !== undefined) articleData.published = postData.published;
    if (postData.is_premium !== undefined) articleData.is_premium = postData.is_premium;
    
    const { data, error } = await supabase
      .from('articles')
      .update(articleData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`게시물 업데이트 실패: ${error.message}`);
    }

    // articles 테이블의 데이터를 Post 타입에 맞게 변환
    const post = {
      id: data.id.toString(),
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      thumbnail_url: data.featured_image,
      category: data.category_id?.toString() || '1',
      created_at: data.created_at,
      updated_at: data.updated_at,
      likes: data.views || 0,
      published: data.published,
      is_premium: false
    };

    return post as Post;
  } catch (error) {
    console.error('게시물 업데이트 실패:', error);
    throw error;
  }
}

export async function deletePost(id: string) {
  try {
    const supabase = getSupabaseServer();
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`게시물 삭제 실패: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('게시물 삭제 실패:', error);
    throw error;
  }
} 