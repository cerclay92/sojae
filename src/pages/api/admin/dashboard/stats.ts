import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServer } from "@/lib/supabase-server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseServer();

  // 게시글, 댓글, 카테고리, 사용자 수 집계
  const [{ count: articles }, { count: comments }, { count: categories }, { count: users }] = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("users").select("*", { count: "exact", head: true }),
  ]);

  res.status(200).json({
    articles: articles ?? 0,
    comments: comments ?? 0,
    categories: categories ?? 0,
    users: users ?? 0,
  });
} 