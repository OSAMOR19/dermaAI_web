-- ============================================================
-- WBH Product Catalog Schema Migration
-- Run this in your Supabase SQL Editor
-- Creates: categories, products, recommendations, recommendation_items
-- ============================================================

-- ==========================================
-- 1. Categories Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  group_name TEXT NOT NULL,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can manage categories" ON public.categories;
CREATE POLICY "Service role can manage categories"
  ON public.categories FOR ALL
  USING (auth.role() = 'service_role');

-- Seed the 18 categories
INSERT INTO public.categories (id, name, group_name, product_count) VALUES
  ('CAT-01', 'Anti-Aging',  'Treatment',      3),
  ('CAT-02', 'Body Mist',   'Body',            2),
  ('CAT-03', 'Body Oil',    'Body',           12),
  ('CAT-04', 'Body Scrub',  'Body',            6),
  ('CAT-05', 'Body Wash',   'Body',           28),
  ('CAT-06', 'Cleansers',   'Face',           35),
  ('CAT-07', 'Essence',     'Face',            5),
  ('CAT-08', 'Exfoliant',   'Face',            5),
  ('CAT-09', 'Eye Mask',    'Face',            2),
  ('CAT-10', 'Face Cream',  'Face',            2),
  ('CAT-11', 'Mask',        'Face',            3),
  ('CAT-12', 'Moisturizer', 'Face',           78),
  ('CAT-13', 'Patch',       'Face',            3),
  ('CAT-14', 'Serum',       'Face',           53),
  ('CAT-15', 'Sunscreen',   'Sun Protection', 21),
  ('CAT-16', 'Toner',       'Face',           23),
  ('CAT-17', 'Treatment',   'Face',           13),
  ('CAT-18', 'WBH Bundle',  'Bundle',         13)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  group_name = EXCLUDED.group_name,
  product_count = EXCLUDED.product_count;


-- ==========================================
-- 2. Products Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  category_name TEXT,
  product_name TEXT NOT NULL,
  brand TEXT,
  sub_type TEXT,
  finish TEXT,
  best_for TEXT,
  confidence_level TEXT DEFAULT 'Medium',
  skin_concern_tags TEXT[] DEFAULT '{}',
  description TEXT,
  image_url TEXT,
  product_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_concern_tags ON public.products USING GIN(skin_concern_tags);

DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can manage products" ON public.products;
CREATE POLICY "Service role can manage products"
  ON public.products FOR ALL
  USING (auth.role() = 'service_role');


-- ==========================================
-- 3. Recommendations Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  skin_concerns TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_recommendations_user ON public.recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_consultation ON public.recommendations(consultation_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_status ON public.recommendations(status);

DROP POLICY IF EXISTS "Users can view their own recommendations" ON public.recommendations;
CREATE POLICY "Users can view their own recommendations"
  ON public.recommendations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage recommendations" ON public.recommendations;
CREATE POLICY "Service role can manage recommendations"
  ON public.recommendations FOR ALL
  USING (auth.role() = 'service_role');


-- ==========================================
-- 4. Recommendation Items Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.recommendation_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  match_reason TEXT,
  concern_match TEXT[] DEFAULT '{}',
  confidence_score INTEGER DEFAULT 0,
  added_by TEXT DEFAULT 'system',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.recommendation_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_rec_items_recommendation ON public.recommendation_items(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_rec_items_product ON public.recommendation_items(product_id);

DROP POLICY IF EXISTS "Users can view their own recommendation items" ON public.recommendation_items;
CREATE POLICY "Users can view their own recommendation items"
  ON public.recommendation_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.recommendations r
      WHERE r.id = recommendation_id AND r.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Service role can manage recommendation items" ON public.recommendation_items;
CREATE POLICY "Service role can manage recommendation items"
  ON public.recommendation_items FOR ALL
  USING (auth.role() = 'service_role');


-- ==========================================
-- 5. Seed Sample Products
-- These are REAL WBH products. Add more via Supabase dashboard.
-- ==========================================
INSERT INTO public.products (id, category_id, category_name, product_name, brand, sub_type, finish, best_for, confidence_level, skin_concern_tags, description, product_url) VALUES
  -- Cleansers (CAT-06)
  ('PRD-001', 'CAT-06', 'Cleansers', 'CeraVe Foaming Facial Cleanser', 'CeraVe', 'Foaming Cleanser', 'Matte', 'Oily & Acne-Prone Skin', 'High', ARRAY['Acne','Oiliness','Excess Sebum','Breakouts'], 'A gentle foaming cleanser with ceramides and niacinamide that removes excess oil without disrupting the skin barrier.', 'https://wholesalebeautyhub.co.uk/?s=CeraVe+Foaming'),
  ('PRD-002', 'CAT-06', 'Cleansers', 'CosRx Low pH Good Morning Gel Cleanser', 'CosRx', 'Gel Cleanser', 'Fresh', 'All Skin Types', 'High', ARRAY['Acne','Oiliness','Sensitive','Daily Use'], 'A low pH gel cleanser with BHA that gently exfoliates while cleansing for a fresh, clear complexion.', 'https://wholesalebeautyhub.co.uk/?s=CosRx+Cleanser'),
  ('PRD-003', 'CAT-06', 'Cleansers', 'CosRx Salicylic Acid Daily Gentle Cleanser', 'CosRx', 'Gel Cleanser', 'Fresh', 'Acne-Prone Skin', 'High', ARRAY['Acne','Blackheads','Pores','Oiliness'], 'Formulated with salicylic acid to unclog pores and prevent breakouts while maintaining moisture.', 'https://wholesalebeautyhub.co.uk/?s=CosRx+Salicylic'),
  ('PRD-004', 'CAT-06', 'Cleansers', 'PanOxyl Acne Foaming Wash 10% Benzoyl Peroxide', 'PanOxyl', 'Foaming Wash', 'Clean', 'Severe Acne', 'High', ARRAY['Acne','Breakouts','Bacteria','Inflammatory Acne'], 'Maximum strength benzoyl peroxide wash that kills acne-causing bacteria on contact.', 'https://wholesalebeautyhub.co.uk/?s=PanOxyl'),
  ('PRD-005', 'CAT-06', 'Cleansers', '25Pskyn Trio Cleanser', '25Pskyn', 'Triple-Action Cleanser', 'Smooth', 'Combination Skin', 'High', ARRAY['Acne','Oiliness','Dullness','Texture'], 'A triple-action cleanser that purifies, brightens, and smooths in one step.', 'https://wholesalebeautyhub.co.uk/?s=25Pskyn+Trio+Cleanser'),
  ('PRD-006', 'CAT-06', 'Cleansers', 'La Roche-Posay Toleriane Purifying Foaming Cleanser', 'La Roche-Posay', 'Foaming Cleanser', 'Gentle', 'Sensitive & Oily Skin', 'High', ARRAY['Sensitive','Oiliness','Redness','Rosacea'], 'Soap-free foaming cleanser that purifies oily skin while respecting its natural pH.', 'https://wholesalebeautyhub.co.uk/?s=La+Roche-Posay+Toleriane'),

  -- Serums (CAT-14)
  ('PRD-007', 'CAT-14', 'Serum', 'Good Molecules Niacinamide Serum', 'Good Molecules', 'Niacinamide Serum', 'Lightweight', 'Enlarged Pores & Oily Skin', 'High', ARRAY['Pores','Oiliness','Texture','Brightening'], 'A 10% niacinamide serum that minimizes the appearance of pores and balances oil production.', 'https://wholesalebeautyhub.co.uk/?s=Good+Molecules+Niacinamide'),
  ('PRD-008', 'CAT-14', 'Serum', 'Naturium Alpha Arbutin Serum 2%', 'Naturium', 'Alpha Arbutin Serum', 'Silky', 'Hyperpigmentation & Dark Spots', 'High', ARRAY['Hyperpigmentation','PIH','Dark Spots','Brightening','Melasma'], 'Targets dark spots and uneven skin tone with alpha arbutin and hyaluronic acid.', 'https://wholesalebeautyhub.co.uk/?s=Naturium+Alpha+Arbutin'),
  ('PRD-009', 'CAT-14', 'Serum', 'Skin By Zaron Vitamin C Serum', 'Skin By Zaron', 'Vitamin C Serum', 'Glow', 'Dull Skin & Hyperpigmentation', 'High', ARRAY['Brightening','Dullness','Hyperpigmentation','Anti-Aging','Antioxidant'], 'A potent vitamin C serum that brightens, protects, and evens out skin tone for melanated skin.', 'https://wholesalebeautyhub.co.uk/?s=Skin+By+Zaron+Vitamin+C'),
  ('PRD-010', 'CAT-14', 'Serum', '25Pskyn Liqueur Brightening Serum', '25Pskyn', 'Brightening Serum', 'Radiant', 'Dark Spots & Uneven Tone', 'High', ARRAY['Hyperpigmentation','PIH','Dark Spots','Brightening','Glow'], 'Professional-grade brightening serum targeting stubborn dark spots and discoloration.', 'https://wholesalebeautyhub.co.uk/?s=25Pskyn+Liqueur'),
  ('PRD-011', 'CAT-14', 'Serum', '25Pskyn Mandelactone Serum', '25Pskyn', 'AHA Serum', 'Smooth', 'Acne & Texture', 'High', ARRAY['Acne','Texture','Pores','Exfoliation','PIH'], 'Mandelic acid-based serum that gently exfoliates, refines texture, and fights breakouts.', 'https://wholesalebeautyhub.co.uk/?s=25Pskyn+Mandelactone'),
  ('PRD-012', 'CAT-14', 'Serum', 'CosRx Advanced Snail 96 Mucin Power Essence', 'CosRx', 'Essence Serum', 'Hydrating', 'Dehydrated & Damaged Skin', 'High', ARRAY['Hydration','Dehydration','Repair','Texture','Soothing'], 'Concentrated snail mucin essence that hydrates, repairs, and soothes compromised skin.', 'https://wholesalebeautyhub.co.uk/?s=CosRx+Snail'),
  ('PRD-013', 'CAT-14', 'Serum', 'La Roche-Posay Redermic Retinol Serum', 'La Roche-Posay', 'Retinol Serum', 'Lightweight', 'Fine Lines & Wrinkles', 'High', ARRAY['Anti-Aging','Fine Lines','Wrinkles','Firmness','Texture'], 'A progressive release retinol serum for reducing fine lines, wrinkles, and improving skin firmness.', 'https://wholesalebeautyhub.co.uk/?s=La+Roche-Posay+Retinol'),

  -- Moisturizers (CAT-12)
  ('PRD-014', 'CAT-12', 'Moisturizer', 'CeraVe Moisturising Cream', 'CeraVe', 'Rich Cream', 'Rich', 'Dry & Eczema-Prone Skin', 'High', ARRAY['Dryness','Eczema','Barrier Repair','Hydration','Sensitive'], 'A rich, non-greasy moisturiser with ceramides that restores and maintains the skin barrier.', 'https://wholesalebeautyhub.co.uk/?s=CeraVe+Moisturising+Cream'),
  ('PRD-015', 'CAT-12', 'Moisturizer', 'Olay Regenerist Whip', 'Olay', 'Whipped Moisturizer', 'Matte', 'Oily & Combination Skin', 'High', ARRAY['Oiliness','Hydration','Anti-Aging','Lightweight','Matte'], 'An ultra-lightweight whipped moisturiser that hydrates without heaviness or greasiness.', 'https://wholesalebeautyhub.co.uk/?s=Olay+Regenerist+Whip'),
  ('PRD-016', 'CAT-12', 'Moisturizer', 'Olay Complete Day Fluid SPF 15', 'Olay', 'Day Fluid', 'Light', 'Sensitive Skin', 'Medium', ARRAY['Sensitive','Rosacea','Hydration','Daily Protection','Lightweight'], 'A lightweight day fluid that provides all-day moisture with gentle sun protection.', 'https://wholesalebeautyhub.co.uk/?s=Olay+Complete+Day'),
  ('PRD-017', 'CAT-12', 'Moisturizer', 'Palmers Cocoa Butter Formula', 'Palmers', 'Body Moisturizer', 'Rich', 'Dehydrated & Dry Skin', 'Medium', ARRAY['Dryness','Dehydration','Barrier Repair','Nourishing'], 'Deeply nourishing cocoa butter formula that softens and hydrates dry skin.', 'https://wholesalebeautyhub.co.uk/?s=Palmers+Cocoa+Butter'),
  ('PRD-018', 'CAT-12', 'Moisturizer', '25Pskyn Pigma Blend Cream', '25Pskyn', 'Pigment Correcting Cream', 'Smooth', 'Hyperpigmentation', 'High', ARRAY['Hyperpigmentation','PIH','Dark Spots','Brightening','Melasma'], 'A targeted pigment-correcting cream that fades dark spots while moisturising the skin.', 'https://wholesalebeautyhub.co.uk/?s=25Pskyn+Pigma+Blend'),

  -- Sunscreen (CAT-15)
  ('PRD-019', 'CAT-15', 'Sunscreen', 'Beauty of Joseon Relief Sun SPF 50+', 'Beauty of Joseon', 'Chemical Sunscreen', 'Dewy', 'All Skin Types', 'High', ARRAY['Sun Protection','UV Defense','Hydration','Daily Use','Brightening'], 'A lightweight, rice-based sunscreen that provides broad-spectrum SPF 50+ protection with a dewy finish.', 'https://wholesalebeautyhub.co.uk/?s=Beauty+of+Joseon+Sunscreen'),
  ('PRD-020', 'CAT-15', 'Sunscreen', '25Pskyn UV Warrior SPF 50+', '25Pskyn', 'Mineral Sunscreen', 'Matte', 'Melanated Skin', 'High', ARRAY['Sun Protection','UV Defense','PIH Prevention','Melasma','No White Cast'], 'A no-white-cast SPF 50+ sunscreen specifically formulated for melanated skin tones.', 'https://wholesalebeautyhub.co.uk/?s=25Pskyn+UV+Warrior'),
  ('PRD-021', 'CAT-15', 'Sunscreen', 'La Roche-Posay Anthelios UVMune 400 SPF 50+', 'La Roche-Posay', 'Broad Spectrum', 'Invisible', 'Sensitive & Reactive Skin', 'High', ARRAY['Sun Protection','UV Defense','Sensitive','Rosacea','Lightweight'], 'Ultra-protection sunscreen with patented Mexoryl 400 filter for maximum UV defense.', 'https://wholesalebeautyhub.co.uk/?s=La+Roche-Posay+Anthelios'),

  -- Toner (CAT-16)
  ('PRD-022', 'CAT-16', 'Toner', 'Tiam Vita B5 Toner', 'Tiam', 'Hydrating Toner', 'Watery', 'Dehydrated & Sensitive Skin', 'High', ARRAY['Hydration','Dehydration','Soothing','Sensitive','Barrier Repair'], 'A vitamin B5-enriched hydrating toner that soothes, hydrates, and strengthens the skin barrier.', 'https://wholesalebeautyhub.co.uk/?s=Tiam+Vita+B5'),
  ('PRD-023', 'CAT-16', 'Toner', 'CosRx AHA/BHA Clarifying Treatment Toner', 'CosRx', 'Exfoliating Toner', 'Clear', 'Oily & Acne-Prone Skin', 'High', ARRAY['Acne','Oiliness','Pores','Blackheads','Exfoliation'], 'A gentle exfoliating toner with AHA and BHA that clears clogged pores and prevents breakouts.', 'https://wholesalebeautyhub.co.uk/?s=CosRx+AHA+BHA+Toner'),

  -- Exfoliant (CAT-08)
  ('PRD-024', 'CAT-08', 'Exfoliant', 'CosRx BHA Blackhead Power Liquid', 'CosRx', 'BHA Exfoliant', 'Liquid', 'Blackheads & Enlarged Pores', 'High', ARRAY['Blackheads','Pores','Oiliness','Acne','Exfoliation'], 'A BHA exfoliant that dissolves blackheads and tightens pores for clearer, smoother skin.', 'https://wholesalebeautyhub.co.uk/?s=CosRx+BHA'),
  ('PRD-025', 'CAT-08', 'Exfoliant', '25Pskyn Kojitrinol Pads', '25Pskyn', 'Exfoliating Pads', 'Smooth', 'Hyperpigmentation & Texture', 'High', ARRAY['Hyperpigmentation','PIH','Dark Spots','Texture','Exfoliation','Brightening'], 'Pre-soaked exfoliating pads with kojic acid and retinol for brightening and texture refinement.', 'https://wholesalebeautyhub.co.uk/?s=25Pskyn+Kojitrinol'),

  -- Treatment (CAT-17)
  ('PRD-026', 'CAT-17', 'Treatment', 'Olay Anti-Wrinkle Pro Vital Moisturiser', 'Olay', 'Anti-Wrinkle Treatment', 'Rich', 'Mature Skin', 'High', ARRAY['Anti-Aging','Fine Lines','Wrinkles','Firmness','Hydration'], 'An anti-wrinkle moisturiser that targets fine lines and loss of firmness in mature skin.', 'https://wholesalebeautyhub.co.uk/?s=Olay+Anti-Wrinkle'),
  ('PRD-027', 'CAT-17', 'Treatment', '25Pskyn Trinity Pads', '25Pskyn', 'Treatment Pads', 'Targeted', 'Acne & Blemishes', 'High', ARRAY['Acne','Breakouts','Blemishes','Bacteria','Spot Treatment'], 'Pre-soaked treatment pads with a triple-acid blend for fast-acting acne control.', 'https://wholesalebeautyhub.co.uk/?s=25Pskyn+Trinity+Pads'),

  -- Patch (CAT-13)
  ('PRD-028', 'CAT-13', 'Patch', 'CosRx Acne Pimple Master Patch', 'CosRx', 'Hydrocolloid Patch', 'Invisible', 'Active Breakouts', 'High', ARRAY['Acne','Breakouts','Blemishes','Spot Treatment','Healing'], 'Hydrocolloid patches that absorb pus and protect blemishes for faster healing.', 'https://wholesalebeautyhub.co.uk/?s=CosRx+Acne+Master+Patch'),

  -- Eye Mask (CAT-09)
  ('PRD-029', 'CAT-09', 'Eye Mask', 'La Roche-Posay Pigmentclar Eyes', 'La Roche-Posay', 'Eye Treatment', 'Lightweight', 'Dark Circles', 'High', ARRAY['Dark Circles','Puffiness','Brightening','Under-Eye','Anti-Aging'], 'A targeted eye treatment that reduces dark circles and brightens the under-eye area.', 'https://wholesalebeautyhub.co.uk/?s=La+Roche-Posay+Pigmentclar+Eyes'),
  ('PRD-030', 'CAT-09', 'Eye Mask', 'Olay Eyes Ultimate Eye Cream', 'Olay', 'Eye Cream', 'Smooth', 'Dark Circles & Wrinkles', 'Medium', ARRAY['Dark Circles','Wrinkles','Fine Lines','Puffiness','Under-Eye'], 'An all-in-one eye cream targeting dark circles, wrinkles, and puffiness.', 'https://wholesalebeautyhub.co.uk/?s=Olay+Eyes'),

  -- Anti-Aging (CAT-01)
  ('PRD-031', 'CAT-01', 'Anti-Aging', 'Olay Regenerist Micro-Sculpting Cream', 'Olay', 'Anti-Aging Cream', 'Rich', 'Fine Lines & Loss of Firmness', 'High', ARRAY['Anti-Aging','Fine Lines','Wrinkles','Firmness','Hydration'], 'A micro-sculpting cream with amino-peptide complex that firms and hydrates ageing skin.', 'https://wholesalebeautyhub.co.uk/?s=Olay+Regenerist+Micro'),

  -- Body Wash (CAT-05)
  ('PRD-032', 'CAT-05', 'Body Wash', 'CeraVe Hydrating Body Wash', 'CeraVe', 'Hydrating Body Wash', 'Gentle', 'Dry & Sensitive Body Skin', 'Medium', ARRAY['Dryness','Sensitive','Hydration','Barrier Repair','Gentle'], 'A hydrating body wash with ceramides and hyaluronic acid that cleanses without stripping moisture.', 'https://wholesalebeautyhub.co.uk/?s=CeraVe+Body+Wash'),

  -- Essence (CAT-07)
  ('PRD-033', 'CAT-07', 'Essence', 'CosRx Advanced Snail 96 Mucin Power Essence', 'CosRx', 'Snail Mucin Essence', 'Hydrating', 'All Skin Types', 'High', ARRAY['Hydration','Repair','Texture','Soothing','Barrier Repair'], 'A concentrated snail mucin essence that deeply hydrates, repairs, and soothes.', 'https://wholesalebeautyhub.co.uk/?s=CosRx+Snail+Essence'),

  -- Body Scrub (CAT-04)
  ('PRD-034', 'CAT-04', 'Body Scrub', 'Bolden Dark Spot Fix Body Scrub', 'Bolden', 'Exfoliating Scrub', 'Gritty', 'Dark Spots on Body', 'Medium', ARRAY['Hyperpigmentation','Dark Spots','Exfoliation','Brightening','Texture'], 'An exfoliating body scrub formulated for melanin-rich skin to fade body dark spots.', 'https://wholesalebeautyhub.co.uk/?s=Bolden+Dark+Spot'),

  -- Mask (CAT-11)
  ('PRD-035', 'CAT-11', 'Mask', 'CosRx Ultimate Nourishing Rice Overnight Spa Mask', 'CosRx', 'Overnight Mask', 'Nourishing', 'Dull & Tired Skin', 'Medium', ARRAY['Brightening','Dullness','Hydration','Nourishing','Glow'], 'An overnight mask enriched with rice extract that brightens and nourishes while you sleep.', 'https://wholesalebeautyhub.co.uk/?s=CosRx+Rice+Mask')

ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  product_name = EXCLUDED.product_name,
  brand = EXCLUDED.brand,
  sub_type = EXCLUDED.sub_type,
  finish = EXCLUDED.finish,
  best_for = EXCLUDED.best_for,
  confidence_level = EXCLUDED.confidence_level,
  skin_concern_tags = EXCLUDED.skin_concern_tags,
  description = EXCLUDED.description,
  product_url = EXCLUDED.product_url;
