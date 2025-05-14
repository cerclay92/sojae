import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          content: string;
          thumbnail_url: string | null;
          category: string;
          excerpt: string;
          slug: string;
          likes: number;
          published: boolean;
          is_premium: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          content: string;
          thumbnail_url?: string | null;
          category: string;
          excerpt: string;
          slug: string;
          likes?: number;
          published?: boolean;
          is_premium?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          content?: string;
          thumbnail_url?: string | null;
          category?: string;
          excerpt?: string;
          slug?: string;
          likes?: number;
          published?: boolean;
          is_premium?: boolean;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          status: string;
          subscription_type: string;
          expires_at: string | null;
          payment_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          status: string;
          subscription_type: string;
          expires_at?: string | null;
          payment_id?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          status?: string;
          subscription_type?: string;
          expires_at?: string | null;
          payment_id?: string | null;
        };
      };
    };
  };
}; 