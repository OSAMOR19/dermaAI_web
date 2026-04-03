-- ==========================================
-- DermaAI Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  first_name text,
  last_name text,
  avatar_url text,
  skin_type text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Trigger to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Safe trigger creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ==========================================
-- 2. Create Scans Table
-- ==========================================

CREATE TABLE IF NOT EXISTS public.scans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  score integer NOT NULL,
  analysis_data jsonb NOT NULL,
  recommendation_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security for scans
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Scans RLS Policies (Users can only see and add their own scans)
CREATE POLICY "Users can view their own scans"
  ON public.scans FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own scans"
  ON public.scans FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own scans"
  ON public.scans FOR UPDATE
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own scans"
  ON public.scans FOR DELETE
  USING ( auth.uid() = user_id );


-- ==========================================
-- 3. Create Storage Buckets
-- ==========================================

-- Create 'avatars' bucket (Public so everyone can see the image)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Avatars Bucket Policies
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Anyone can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner )
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );


-- Create 'scans' bucket (Private, only visible to the user)
INSERT INTO storage.buckets (id, name, public)
VALUES ('scans', 'scans', false)
ON CONFLICT (id) DO NOTHING;

-- Scans Bucket Policies
CREATE POLICY "Users can view their own scan images"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'scans' AND auth.uid() = owner );

CREATE POLICY "Users can upload their own scan images"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'scans' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can update their own scan images"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'scans' AND auth.uid() = owner );

CREATE POLICY "Users can delete their own scan images"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'scans' AND auth.uid() = owner );
