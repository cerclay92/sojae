"use client";

import { createContext, useContext, ReactNode } from "react";
import useBlogSettings, { BlogSettings } from "@/hooks/useBlogSettings";

// 컨텍스트 타입 정의
interface BlogSettingsContextType {
  settings?: BlogSettings;
  isLoading: boolean;
  error: Error | null;
}

// 기본 컨텍스트 값
const defaultContext: BlogSettingsContextType = {
  settings: undefined,
  isLoading: false,
  error: null,
};

// 컨텍스트 생성
const BlogSettingsContext = createContext<BlogSettingsContextType>(defaultContext);

// 컨텍스트 사용을 위한 훅
export const useBlogSettingsContext = () => {
  const context = useContext(BlogSettingsContext);
  
  if (context === undefined) {
    throw new Error("useBlogSettingsContext는 BlogSettingsProvider 내에서 사용해야 합니다.");
  }
  
  return context;
};

// 프로바이더 속성 타입
interface BlogSettingsProviderProps {
  children: ReactNode;
}

// 블로그 설정 프로바이더 컴포넌트
export function BlogSettingsProvider({ children }: BlogSettingsProviderProps) {
  const { settings, isLoading, error } = useBlogSettings();
  
  const value = {
    settings,
    isLoading,
    error,
  };
  
  return (
    <BlogSettingsContext.Provider value={value}>
      {children}
    </BlogSettingsContext.Provider>
  );
}

// 컴포넌트에서 바로 사용할 수 있는 헬퍼 함수들
export function useTitle() {
  const { settings } = useBlogSettingsContext();
  return settings?.blog_title || "서재";
}

export function useDescription() {
  const { settings } = useBlogSettingsContext();
  return settings?.blog_description || "";
}

export function usePostsPerPage() {
  const { settings } = useBlogSettingsContext();
  return settings?.posts_per_page || 10;
}

export function useCommentSettings() {
  const { settings } = useBlogSettingsContext();
  return {
    approvalRequired: settings?.comment_approval_required || false,
    allowGuestComments: settings?.allow_guest_comments || false,
  };
} 