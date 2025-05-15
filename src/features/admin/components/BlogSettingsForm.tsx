"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useBlogSettings from "@/hooks/useBlogSettings";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

// 폼 스키마 정의
const formSchema = z.object({
  blog_title: z.string().min(1, { message: "블로그 제목은 필수입니다." }),
  blog_description: z.string().min(1, { message: "블로그 설명은 필수입니다." }),
  posts_per_page: z.coerce.number().int().min(1).max(100),
  comment_approval_required: z.boolean(),
  allow_guest_comments: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function BlogSettingsForm() {
  const { settings, isLoading, updateSetting, isUpdating } = useBlogSettings();
  const [isSaving, setIsSaving] = useState(false);

  // 폼 설정
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      blog_title: "",
      blog_description: "",
      posts_per_page: 10,
      comment_approval_required: true,
      allow_guest_comments: true,
    },
  });

  // 설정이 로드되면 폼 값 업데이트
  if (settings && !isLoading && !form.formState.isDirty) {
    form.reset(settings);
  }

  // 폼 제출 처리
  async function onSubmit(values: FormValues) {
    setIsSaving(true);
    
    try {
      // 각 설정 값을 개별적으로 업데이트
      await updateSetting("blog_title", values.blog_title);
      await updateSetting("blog_description", values.blog_description);
      await updateSetting("posts_per_page", values.posts_per_page);
      await updateSetting("comment_approval_required", values.comment_approval_required);
      await updateSetting("allow_guest_comments", values.allow_guest_comments);
      
      form.reset(values);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <FormField
        control={form.control}
        name="blog_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>블로그 제목</FormLabel>
            <FormControl>
              <Input placeholder="서재, 사람을 읽다" {...field} />
            </FormControl>
            <FormDescription>블로그의 메인 타이틀로 사용됩니다.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="blog_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>블로그 설명</FormLabel>
            <FormControl>
              <Textarea
                placeholder="책과 사람, 그리고 만남을 온라인 공간에서 이룬 블로그 생태계"
                {...field}
                rows={3}
              />
            </FormControl>
            <FormDescription>블로그의 설명이나 슬로건으로 사용됩니다.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="posts_per_page"
        render={({ field }) => (
          <FormItem>
            <FormLabel>페이지당 게시글 수</FormLabel>
            <FormControl>
              <Input type="number" min={1} max={100} {...field} />
            </FormControl>
            <FormDescription>한 페이지에 표시할 게시글 수입니다.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="comment_approval_required"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">댓글 승인 필요</FormLabel>
              <FormDescription>
                활성화하면 관리자 승인 후 댓글이 표시됩니다.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allow_guest_comments"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">비회원 댓글 허용</FormLabel>
              <FormDescription>
                비회원도 댓글을 작성할 수 있습니다.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <Button type="submit" disabled={isSaving || isUpdating || !form.formState.isDirty}>
        {(isSaving || isUpdating) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        설정 저장
      </Button>
    </Form>
  );
} 