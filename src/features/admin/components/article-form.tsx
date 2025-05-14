"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createClient } from "@supabase/supabase-js";
import { RichTextEditor } from '@mantine/rte';
import { uploadImageToSupabase, fetchSupabaseImages } from "../lib/image";

interface Category {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  icon?: string;
}

interface ArticleFormProps {
  article?: {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category_id: number;
    published: boolean;
    featured_image?: string;
  };
  categories: Category[];
}

export function ArticleForm({ article, categories }: ArticleFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: article?.title || "",
    slug: article?.slug || "",
    content: article?.content || "",
    excerpt: article?.excerpt || "",
    category_id: article?.category_id?.toString() || "",
    published: article?.published || false,
    featured_image: article?.featured_image || ""
  });
  const [error, setError] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);

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
      };

      let result;
      if (article?.id) {
        // 기존 게시글 수정
        result = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", article.id)
          .select();
      } else {
        // 새 게시글 작성
        result = await supabase
          .from("articles")
          .insert(articleData)
          .select();
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
    setFormData((prev) => ({
      ...prev,
      content: prev.content + `<img src="${url}" alt="업로드 이미지" />`
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
        <RichTextEditor
          value={formData.content}
          onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
        />
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        <div className="flex flex-wrap gap-2">
          {images.map((url) => (
            <img
              key={url}
              src={url}
              alt="업로드 이미지"
              className="w-16 h-16 object-cover cursor-pointer"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  content: prev.content + `<img src=\"${url}\" alt=\"이미지\" />`
                }))
              }
            />
          ))}
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