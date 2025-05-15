"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Save, Trash, AlertTriangle } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { uploadImageToSupabase, fetchSupabaseImages } from "../lib/image";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [isDeleting, setIsDeleting] = useState(false);
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
  const [imageUploadError, setImageUploadError] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isImageUploading, setIsImageUploading] = useState(false);

  // 마운트 시 이미지 가져오기
  useEffect(() => {
    const loadImages = async () => {
      try {
        const urls = await fetchSupabaseImages();
        setImages(urls);
      } catch (err: any) {
        console.error("이미지 로드 실패:", err);
        setImageUploadError(err.message || "이미지 목록을 불러오는 중 오류가 발생했습니다.");
      }
    };
    
    loadImages();
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
    } catch (err: any) {
      console.error("게시글 저장 실패:", err);
      setError(err.message || "게시글 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 게시글 삭제 처리
  const handleDelete = async () => {
    if (!article?.id) return;
    
    setIsDeleting(true);
    setError("");
    
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", article.id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      router.push("/admin/articles");
      router.refresh();
    } catch (err: any) {
      console.error("게시글 삭제 실패:", err);
      setError(err.message || "게시글 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 썸네일 업로드 핸들러
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setThumbnailFile(e.target.files[0]);
    
    try {
      setIsImageUploading(true);
      setImageUploadError("");
      const url = await uploadImageToSupabase(e.target.files[0]);
      setFormData((prev) => ({ ...prev, featured_image: url }));
    } catch (err: any) {
      console.error("썸네일 업로드 실패:", err);
      setImageUploadError(err.message || "썸네일 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsImageUploading(false);
    }
  };

  // 본문 이미지 업로드 핸들러
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    try {
      setIsImageUploading(true);
      setImageUploadError("");
      const url = await uploadImageToSupabase(e.target.files[0]);
      setImages((prev) => [...prev, url]);
    } catch (err: any) {
      console.error("이미지 업로드 실패:", err);
      setImageUploadError(err.message || "이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsImageUploading(false);
    }
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
    try {
      setImageUploadError("");
      const urls = await fetchSupabaseImages();
      setImages(urls);
    } catch (err: any) {
      console.error("이미지 목록 로드 실패:", err);
      setImageUploadError(err.message || "이미지 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/articles")}>목록으로</Button>
        {article?.id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" type="button">
                <Trash className="mr-2 h-4 w-4" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>게시글 삭제</AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : '삭제'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
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
        <Input type="file" accept="image/*" onChange={handleThumbnailUpload} disabled={isImageUploading} />
        {isImageUploading && <p className="text-sm text-muted-foreground">이미지 업로드 중...</p>}
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
          <Input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" disabled={isImageUploading} />
          {isImageUploading && <p className="text-sm text-muted-foreground mb-2">이미지 업로드 중...</p>}
          <div className="text-sm text-muted-foreground mb-2">
            이미지를 업로드하거나 아래 목록에서 클릭하여 본문에 삽입할 수 있습니다.
          </div>
          {imageUploadError && (
            <Alert variant="destructive" className="my-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {imageUploadError}
              </AlertDescription>
            </Alert>
          )}
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

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/articles")}>
          취소
        </Button>
        <Button type="submit" disabled={isSubmitting || isImageUploading}>
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