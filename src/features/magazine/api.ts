'use server';

import { getSupabaseServer } from '@/lib/supabase-server';
import { type Database } from '@/lib/supabase';
import { Category } from '@/constants/category';
import { samplePosts, samplePopularPosts, getSamplePostsByCategory, getSamplePostBySlug } from '@/data/sample-posts';

export type Post = Database['public']['Tables']['posts']['Row'];

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
    const supabase = getSupabaseServer();
    
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (onlyPublished) {
      query = query.eq('published', true);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    return data as Post[];
  } catch (error) {
    console.error('게시물 가져오기 실패:', error);
    // 샘플 데이터 반환
    if (category) {
      return getSamplePostsByCategory(category).slice(0, limit) as Post[];
    }
    return samplePosts.slice(offset, offset + limit) as Post[];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) {
      throw new Error(`Failed to fetch post: ${error.message}`);
    }

    return data as Post;
  } catch (error) {
    console.error('게시물 가져오기 실패:', error);
    // 샘플 데이터에서 slug로 게시물 찾기
    const post = getSamplePostBySlug(slug);
    if (post) {
      return post as Post;
    }
    throw error;
  }
}

export async function getPostById(id: string) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch post: ${error.message}`);
    }

    return data as Post;
  } catch (error) {
    console.error('게시물 가져오기 실패:', error);
    // 샘플 데이터에서 id로 게시물 찾기
    const post = samplePosts.find(p => p.id === id);
    if (post) {
      return post as Post;
    }
    throw error;
  }
}

export async function getPostsByCategory(category: Category, limit = 10) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('category', category)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch posts by category: ${error.message}`);
    }

    return data as Post[];
  } catch (error) {
    console.error('카테고리별 게시물 가져오기 실패:', error);
    // 샘플 데이터에서 카테고리별 게시물 찾기
    return getSamplePostsByCategory(category).slice(0, limit) as Post[];
  }
}

export async function getPopularPosts(limit = 5) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('likes', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch popular posts: ${error.message}`);
    }

    return data as Post[];
  } catch (error) {
    console.error('인기 게시물 가져오기 실패:', error);
    // 샘플 인기 게시물 반환
    return samplePopularPosts.slice(0, limit) as Post[];
  }
}

export async function getPostCount(category?: Category) {
  try {
    const supabase = getSupabaseServer();
    
    let query = supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('published', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { count, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch post count: ${error.message}`);
    }

    return count;
  } catch (error) {
    console.error('게시물 수 가져오기 실패:', error);
    // 샘플 데이터 카운트 반환
    if (category) {
      return getSamplePostsByCategory(category).length;
    }
    return samplePosts.length;
  }
}

export async function updatePostLikes(id: string) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase.rpc('increment_post_likes', {
      post_id: id,
    });

    if (error) {
      throw new Error(`Failed to update post likes: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('게시물 좋아요 업데이트 실패:', error);
    // 샘플 데이터 좋아요 처리
    const postIndex = samplePosts.findIndex(p => p.id === id);
    if (postIndex >= 0) {
      samplePosts[postIndex].likes += 1;
      return { success: true };
    }
    throw error;
  }
}

// Admin functions
export async function createPost(post: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes'>) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase.from('posts').insert([post]).select();

    if (error) {
      throw new Error(`Failed to create post: ${error.message}`);
    }

    return data[0] as Post;
  } catch (error) {
    console.error('게시물 생성 실패:', error);
    // 개발 환경에서 샘플 데이터 처리
    if (process.env.NODE_ENV === 'development') {
      const newPost: Post = {
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        likes: 0,
        ...post
      };
      samplePosts.unshift(newPost);
      return newPost;
    }
    throw error;
  }
}

export async function updatePost(
  id: string,
  post: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>
) {
  try {
    const supabase = getSupabaseServer();
    
    const { data, error } = await supabase
      .from('posts')
      .update(post)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Failed to update post: ${error.message}`);
    }

    return data[0] as Post;
  } catch (error) {
    console.error('게시물 업데이트 실패:', error);
    // 개발 환경에서 샘플 데이터 처리
    if (process.env.NODE_ENV === 'development') {
      const postIndex = samplePosts.findIndex(p => p.id === id);
      if (postIndex >= 0) {
        samplePosts[postIndex] = {
          ...samplePosts[postIndex],
          ...post,
          updated_at: new Date().toISOString()
        };
        return samplePosts[postIndex];
      }
    }
    throw error;
  }
}

export async function deletePost(id: string) {
  try {
    const supabase = getSupabaseServer();
    
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete post: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('게시물 삭제 실패:', error);
    // 개발 환경에서 샘플 데이터 처리
    if (process.env.NODE_ENV === 'development') {
      const postIndex = samplePosts.findIndex(p => p.id === id);
      if (postIndex >= 0) {
        samplePosts.splice(postIndex, 1);
        return true;
      }
    }
    throw error;
  }
} 