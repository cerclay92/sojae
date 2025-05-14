-- Create posts table for magazine content
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  likes INTEGER DEFAULT 0 NOT NULL,
  published BOOLEAN DEFAULT false NOT NULL,
  is_premium BOOLEAN DEFAULT false NOT NULL
);

-- Create subscriptions table for user subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  subscription_type TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  payment_id TEXT
);

-- Create RLS policies
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for posts - allow all users to read published posts
CREATE POLICY "Allow users to read published posts" 
ON public.posts 
FOR SELECT 
USING (published = true);

-- Create policy for posts - allow only authenticated users with admin role to manage posts
CREATE POLICY "Allow admins to manage all posts" 
ON public.posts 
FOR ALL 
USING (auth.role() = 'authenticated' AND auth.email() = ANY(ARRAY['admin@sojae.com']::TEXT[]));

-- Create policy for subscriptions - allow users to read their own subscription
CREATE POLICY "Allow users to read their own subscription" 
ON public.subscriptions 
FOR SELECT 
USING (auth.email() = email);

-- Create policy for subscriptions - allow only authenticated users with admin role to manage subscriptions
CREATE POLICY "Allow admins to manage all subscriptions" 
ON public.subscriptions 
FOR ALL 
USING (auth.role() = 'authenticated' AND auth.email() = ANY(ARRAY['admin@sojae.com']::TEXT[]));

-- Add categories enum
CREATE TYPE public.post_category AS ENUM ('에세이', '인문학', '문화', '상담', '인터뷰');
ALTER TABLE public.posts ALTER COLUMN category TYPE public.post_category USING category::public.post_category;

-- Add subscription types enum
CREATE TYPE public.subscription_type AS ENUM ('monthly', 'yearly');
ALTER TABLE public.subscriptions ALTER COLUMN subscription_type TYPE public.subscription_type USING subscription_type::public.subscription_type;

-- Add subscription status enum
CREATE TYPE public.subscription_status AS ENUM ('active', 'expired', 'canceled');
ALTER TABLE public.subscriptions ALTER COLUMN status TYPE public.subscription_status USING status::public.subscription_status;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for posts
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS posts_category_idx ON public.posts (category);
CREATE INDEX IF NOT EXISTS posts_published_idx ON public.posts (published);
CREATE INDEX IF NOT EXISTS posts_is_premium_idx ON public.posts (is_premium);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts (slug);
CREATE INDEX IF NOT EXISTS subscriptions_email_idx ON public.subscriptions (email);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions (status); 