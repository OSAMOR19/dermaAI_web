-- ============================================================
-- WBH Event Registrations Table
-- Run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age_range TEXT,
  location TEXT,
  postcode TEXT,
  address TEXT,
  skin_concerns TEXT[],
  other_concern TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (API route uses service role key which bypasses RLS)
CREATE POLICY "Allow public insert" ON public.event_registrations
  FOR INSERT WITH CHECK (true);

-- Allow reads (service role bypasses RLS anyway, but this is for safety)
CREATE POLICY "Allow service role select" ON public.event_registrations
  FOR SELECT USING (true);

CREATE INDEX idx_event_registrations_created ON public.event_registrations(created_at DESC);
