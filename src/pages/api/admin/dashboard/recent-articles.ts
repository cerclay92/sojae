import type { NextApiRequest, NextApiResponse } from "next";
import { getSupabaseServer } from "@/lib/supabase-server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data ?? []);
} 