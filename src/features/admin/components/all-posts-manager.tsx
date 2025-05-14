'use client';

import { useState, useEffect } from 'react';
import { getPosts } from '@/features/magazine/api';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, ArrowUpDown, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase-client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES } from '@/constants/category';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { PostList } from '@/features/magazine/components/post-list';
import { type Post } from '@/features/magazine/api';

export function AllPostsManager() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [publishedStatus, setPublishedStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'created_at' | 'title' | 'likes'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const postsPerPage = 10;
  
  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
    
    // 인증 확인
    const checkAuth = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          router.push('/admin');
        }
      } catch (error) {
        console.error('인증 확인 실패:', error);
        router.push('/admin');
      }
    };
    
    checkAuth();
  }, [router]);
  
  // 모든 게시물 가져오기
  const { data: allPosts = [], isLoading, error } = useQuery({
    queryKey: ['admin-all-posts'],
    queryFn: () => getPosts({ limit: 9999, onlyPublished: false }),
    enabled: isClient,
  });
  
  // 검색 및 필터링된 게시물
  const filteredPosts = allPosts.filter((post) => {
    // 검색어 필터링
    const matchesSearch = !search || 
      post.title.toLowerCase().includes(search.toLowerCase()) || 
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    
    // 카테고리 필터링
    const matchesCategory = !category || post.category === category;
    
    // 발행 상태 필터링
    const matchesPublishedStatus = 
      publishedStatus === null ? true : 
      publishedStatus === 'published' ? post.published : 
      !post.published;
    
    return matchesSearch && matchesCategory && matchesPublishedStatus;
  });
  
  // 정렬된 게시물
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortField === 'created_at') {
      return sortDirection === 'desc'
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    
    if (sortField === 'title') {
      return sortDirection === 'desc'
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
    }
    
    if (sortField === 'likes') {
      return sortDirection === 'desc'
        ? b.likes - a.likes
        : a.likes - b.likes;
    }
    
    return 0;
  });
  
  // 페이지네이션
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = sortedPosts.slice(startIndex, endIndex);
  
  // 정렬 토글
  const toggleSort = (field: 'created_at' | 'title' | 'likes') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const resetFilters = () => {
    setSearch('');
    setCategory(null);
    setPublishedStatus(null);
    setSortField('created_at');
    setSortDirection('desc');
    setCurrentPage(1);
  };
  
  if (!isClient) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            총 {filteredPosts.length}개의 게시물
          </Badge>
          {(search || category || publishedStatus) && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              필터 초기화
            </Button>
          )}
        </div>
        <Button asChild>
          <Link href="/admin/post/create">
            <Plus className="mr-2 h-4 w-4" />
            새 글 작성
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>게시물 목록</CardTitle>
          <CardDescription>
            모든 게시물을 관리하세요. 검색과 필터링으로 원하는 게시물을 쉽게 찾을 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="제목, 내용으로 검색"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Select value={category || ''} onValueChange={(val) => setCategory(val || null)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">모든 카테고리</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={publishedStatus || ''} 
                onValueChange={(val) => setPublishedStatus(val || null)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="발행 상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">모든 상태</SelectItem>
                  <SelectItem value="published">발행됨</SelectItem>
                  <SelectItem value="draft">임시저장</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={`${sortField}_${sortDirection}`} 
                onValueChange={(val) => {
                  const [field, direction] = val.split('_');
                  setSortField(field as 'created_at' | 'title' | 'likes');
                  setSortDirection(direction as 'asc' | 'desc');
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at_desc">최신순</SelectItem>
                  <SelectItem value="created_at_asc">오래된순</SelectItem>
                  <SelectItem value="title_asc">제목 (가나다순)</SelectItem>
                  <SelectItem value="title_desc">제목 (역순)</SelectItem>
                  <SelectItem value="likes_desc">좋아요 (높은순)</SelectItem>
                  <SelectItem value="likes_asc">좋아요 (낮은순)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-10">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-muted-foreground">게시물을 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-destructive">
              데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              {search || category || publishedStatus
                ? '검색 결과가 없습니다.'
                : '등록된 게시물이 없습니다.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium">
                      <button 
                        className="flex items-center space-x-1 hover:text-primary"
                        onClick={() => toggleSort('title')}
                      >
                        <span>제목</span>
                        {sortField === 'title' && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-center py-3 px-2 font-medium">카테고리</th>
                    <th className="text-center py-3 px-2 font-medium whitespace-nowrap">
                      <button 
                        className="flex items-center space-x-1 mx-auto hover:text-primary"
                        onClick={() => toggleSort('created_at')}
                      >
                        <span>작성일</span>
                        {sortField === 'created_at' && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-center py-3 px-2 font-medium whitespace-nowrap">
                      <button 
                        className="flex items-center space-x-1 mx-auto hover:text-primary"
                        onClick={() => toggleSort('likes')}
                      >
                        <span>좋아요</span>
                        {sortField === 'likes' && (
                          <ArrowUpDown className="h-3 w-3" />
                        )}
                      </button>
                    </th>
                    <th className="text-center py-3 px-2 font-medium">상태</th>
                    <th className="text-center py-3 px-2 font-medium">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPosts.map((post) => (
                    <tr key={post.id} className="border-b">
                      <td className="py-3 px-2">
                        <div className="font-medium line-clamp-1">{post.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {post.excerpt}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-1 text-xs bg-zinc-100 rounded-full">
                          {post.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center whitespace-nowrap text-xs">
                        {new Date(post.created_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="py-3 px-2 text-center">
                        {post.likes}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span 
                          className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                            post.published 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {post.published ? '발행됨' : '임시저장'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex justify-center gap-1">
                          <Button size="sm" variant="ghost" asChild className="h-7 px-2">
                            <Link href={`/admin/post/edit/${post.id}`}>
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              수정
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // 현재 페이지 주변 페이지만 표시
                      return (
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(page - currentPage) <= 1
                      );
                    })
                    .map((page, i, arr) => {
                      // 페이지 사이에 간격이 있는 경우 ...을 표시
                      if (i > 0 && arr[i] - arr[i - 1] > 1) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <span className="px-4 py-2">...</span>
                          </PaginationItem>
                        );
                      }
                      
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 