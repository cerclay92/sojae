'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Save } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { uploadImageToSupabase, fetchSupabaseImages } from "../lib/image";

// 클라이언트 사이드에서만 로드하기 위해 dynamic import 사용
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>로딩 중...</p>,
});

// Quill 에디터 모듈 설정
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

interface Category {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  icon?: string;
}

interface PostEditorProps {
  post?: any;
}

export function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    category_id: post?.category?.toString() || "",
    published: post?.published || false,
    featured_image: post?.thumbnail_url || ""
  });
  const [error, setError] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // 마운트 시 카테고리 데이터와 이미지 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (error) {
          throw new Error(error.message);
        }
        
        setCategories(data || []);
      } catch (err) {
        console.error('카테고리 로드 실패:', err);
        setError('카테고리를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchCategories();
    
    fetchSupabaseImages().then(urls => {
      setImages(urls);
    }).catch(err => {
      console.error("이미지 로드 실패:", err);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category_id: value }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: generateSlug(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // 데이터 변환
      const articleData = {
        ...formData,
        category_id: parseInt(formData.category_id),
        featured_image: formData.featured_image
      };

      let result;
      if (post?.id) {
        // 기존 게시글 수정
        result = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', post.id)
          .select();
      } else {
        throw new Error("게시글 ID가 없습니다.");
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      console.error("게시글 저장 실패:", err);
      setError("게시글 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 썸네일 업로드 핸들러
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setThumbnailFile(e.target.files[0]);
    const url = await uploadImageToSupabase(e.target.files[0]);
    setFormData((prev) => ({ ...prev, featured_image: url }));
  };

  // 본문 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const url = await uploadImageToSupabase(e.target.files[0]);
    setImages((prev) => [...prev, url]);
  };

  // 이미지 클릭 시 에디터에 삽입
  const insertImageToEditor = (url: string) => {
    // 현재 content에 이미지 HTML 태그 추가
    setFormData((prev) => ({
      ...prev,
      content: prev.content + `<p><img src="${url}" alt="업로드 이미지" /></p>`
    }));
  };

  // 기존 이미지 불러오기
  const handleFetchImages = async () => {
    const urls = await fetchSupabaseImages();
    setImages(urls);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/articles")}>목록으로</Button>
        <Button type="button" variant="secondary" onClick={handleFetchImages}>기존 이미지 불러오기</Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">제목</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleTitleChange}
          placeholder="게시글 제목"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">슬러그</Label>
        <Input
          id="slug"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="url-friendly-slug"
          required
        />
        <p className="text-sm text-muted-foreground">
          URL에 사용될 식별자입니다. 자동으로 생성되지만 수정할 수 있습니다.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">카테고리</Label>
        <Select
          value={formData.category_id}
          onValueChange={handleSelectChange}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">요약</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="게시글 요약 (목록에 표시됩니다)"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="featured_image">대표 썸네일</Label>
        <Input type="file" accept="image/*" onChange={handleThumbnailUpload} />
        {formData.featured_image && (
          <img src={formData.featured_image} alt="썸네일 미리보기" className="w-32 h-32 object-cover" />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">내용</Label>
        <div className="min-h-[400px] border rounded-md">
          {typeof window !== 'undefined' && (
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
              modules={quillModules}
              className="h-[350px]"
            />
          )}
        </div>
        <div className="mt-4">
          <Label>이미지 업로드</Label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
          <div className="text-sm text-muted-foreground mb-2">
            이미지를 업로드하거나 아래 목록에서 클릭하여 본문에 삽입할 수 있습니다.
          </div>
          <div className="flex flex-wrap gap-2 border p-2 rounded-md">
            {images.length > 0 ? (
              images.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="업로드 이미지"
                  className="w-16 h-16 object-cover cursor-pointer hover:opacity-80"
                  onClick={() => insertImageToEditor(url)}
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground p-2">업로드된 이미지가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="published">공개 여부</Label>
      </div>

      {error && <div className="text-sm font-medium text-red-500">{error}</div>}

      <div className="flex justify-end space-x-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          저장
        </Button>
      </div>
    </form>
  );
} 