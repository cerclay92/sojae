import type { NextApiRequest, NextApiResponse } from "next";
import { checkAdminAccess } from "@/lib/admin-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await checkAdminAccess();
  res.status(200).json(result);
} 