"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";

// 클라이언트 측 Supabase 인스턴스 생성
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface BlogSetting {
  id: number;
  setting_key: string;
  setting_value: string | null;
  description: string | null;
  updated_at: string;
}

// 블로그 설정 타입
export type BlogSettings = {
  blog_title: string;
  blog_description: string;
  comment_approval_required: boolean;
  posts_per_page: number;
  allow_guest_comments: boolean;
  [key: string]: string | number | boolean;
};

// 블로그 설정 가져오기
async function fetchBlogSettings(): Promise<BlogSetting[]> {
  const { data, error } = await supabase
    .from("blog_settings")
    .select("*")
    .order("id");
    
  if (error) {
    throw new Error("블로그 설정을 가져오는데 실패했습니다.");
  }
  
  return data || [];
}

// 블로그 설정 업데이트 (RPC 사용)
async function updateBlogSetting(data: { 
  setting_key: string; 
  setting_value: string; 
}): Promise<boolean> {
  const { data: result, error } = await supabase.rpc(
    "update_blog_setting",
    {
      setting_key_param: data.setting_key,
      new_value: data.setting_value
    }
  );
  
  if (error) {
    throw new Error(error.message || "설정 업데이트에 실패했습니다.");
  }
  
  return result;
}

// 설정 데이터를 사용하기 편한 형태로 변환
function transformSettingsData(data: BlogSetting[]): BlogSettings {
  const settings: Partial<BlogSettings> = {};
  
  data.forEach((setting) => {
    const key = setting.setting_key;
    const value = setting.setting_value;
    
    if (key === "comment_approval_required" || key === "allow_guest_comments") {
      settings[key] = value === "true";
    } else if (key === "posts_per_page") {
      settings[key] = parseInt(value || "10", 10);
    } else {
      settings[key as keyof BlogSettings] = value || "";
    }
  });
  
  return settings as BlogSettings;
}

// 블로그 설정 훅
export default function useBlogSettings() {
  const queryClient = useQueryClient();
  
  // 블로그 설정 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ["blogSettings"],
    queryFn: fetchBlogSettings,
  });
  
  // 변환된 설정 데이터
  const settings = data ? transformSettingsData(data) : undefined;
  
  // 설정 업데이트 뮤테이션
  const updateMutation = useMutation({
    mutationFn: updateBlogSetting,
    onSuccess: () => {
      toast.success("설정이 성공적으로 업데이트되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["blogSettings"] });
    },
    onError: (error: Error) => {
      toast.error(`설정 업데이트 실패: ${error.message}`);
    },
  });
  
  // 설정 업데이트 함수
  const updateSetting = (key: string, value: string | number | boolean) => {
    updateMutation.mutate({
      setting_key: key,
      setting_value: value.toString(),
    });
  };
  
  return {
    settings,
    isLoading,
    error,
    updateSetting,
    isUpdating: updateMutation.isPending,
  };
} 