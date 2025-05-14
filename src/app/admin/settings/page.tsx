import { Suspense } from "react";
import { Metadata } from "next";
import BlogSettingsForm from "@/features/admin/components/BlogSettingsForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "블로그 설정 관리 | 서재",
  description: "블로그 설정을 관리합니다.",
};

export default async function AdminSettingsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">블로그 설정 관리</h1>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <Suspense fallback={<SettingsSkeleton />}>
          <BlogSettingsForm />
        </Suspense>
      </div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-24 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <Skeleton className="h-10 w-32" />
    </div>
  );
} 