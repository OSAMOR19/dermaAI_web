-- ============================================================
-- SQL to Promote Evelyn to Admin
-- Run this query in your Supabase Dashboard SQL Editor
-- ============================================================

-- 1. Update profile role to 'admin' based on email
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'Evelyn@wbhskin.com';

-- 2. Verify update
SELECT id, email, first_name, role FROM public.profiles WHERE email = 'Evelyn@wbhskin.com';
