-- ==========================================
-- DermaAI Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- (Safe to run multiple times)
-- ==========================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  first_name text,
  last_name text,
  email text,
  phone text,
  date_of_birth date,
  age_range text,
  country text,
  avatar_url text,
  skin_type text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent errors if running multiple times
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT USING ( auth.uid() = id );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE USING ( auth.uid() = id );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, age_range, country)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.email,
    new.raw_user_meta_data->>'age_range',
    new.raw_user_meta_data->>'country'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.profiles.email),
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    age_range = COALESCE(EXCLUDED.age_range, public.profiles.age_range),
    country = COALESCE(EXCLUDED.country, public.profiles.country);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  image_urls text[] DEFAULT '{}',
  score integer NOT NULL DEFAULT 0,
  analysis jsonb,
  recommendation_data jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can insert their own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can update their own scans" ON public.scans;
DROP POLICY IF EXISTS "Users can delete their own scans" ON public.scans;

CREATE POLICY "Users can view their own scans"
  ON public.scans FOR SELECT USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own scans"
  ON public.scans FOR INSERT WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update their own scans"
  ON public.scans FOR UPDATE USING ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own scans"
  ON public.scans FOR DELETE USING ( auth.uid() = user_id );


-- ==========================================
-- 3. Create Storage Buckets
-- ==========================================

-- avatars bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload an avatar." ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar." ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT USING ( bucket_id = 'avatars' );

CREATE POLICY "Authenticated users can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'avatars' AND auth.uid() = owner )
  WITH CHECK ( bucket_id = 'avatars' );

-- scans bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('scans', 'scans', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Users can view their own scan images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own scan images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own scan images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own scan images" ON storage.objects;

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


-- ==========================================
-- 4. Create Consultations Table
-- ==========================================

CREATE TABLE IF NOT EXISTS public.consultations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  doctor_id text NOT NULL,
  doctor_name text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Users can insert their own consultations" ON public.consultations;
DROP POLICY IF EXISTS "Users can delete their own consultations" ON public.consultations;

CREATE POLICY "Users can view their own consultations"
  ON public.consultations FOR SELECT USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert their own consultations"
  ON public.consultations FOR INSERT WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete their own consultations"
  ON public.consultations FOR DELETE USING ( auth.uid() = user_id );

CREATE INDEX IF NOT EXISTS idx_consultations_user_created ON public.consultations(user_id, created_at DESC);

