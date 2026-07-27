import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateRecommendations, type Product } from '@/lib/recommendation-engine';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface AnalysisInput {
  detected_conditions?: { 
    condition: string; 
    confidence: number; 
    severity: string;
    clinical_explanation?: string;
    active_ingredients?: string[];
  }[];
  skin_type_estimate?: string;
  recommendations?: string[];
  warning_signs?: string[];
}

const AVOID_MAP: Record<string, string[]> = {
  'acne (inflammatory)': ["Heavy comedogenic oils", "Picking spots", "Harsh scrubs"],
  'acne (comedonal)': ["Comedogenic ingredients", "Heavy creams"],
  'hyperpigmentation': ["Physical scrubs on active marks", "No SPF exposure"],
  'melasma': ["Excessive heat exposure", "Skipping sunscreen"],
  'dark spots / sun damage': ["Prolonged sun exposure", "Tanning beds"],
  'rosacea': ["Harsh physical exfoliants", "Fragrance", "Spicy foods trigger"],
  'dehydration': ["Alcohol-based toners", "Over-washing face", "Hot water"],
  'oily skin / excess sebum': ["Heavy pore-clogging creams", "Skipping moisturiser"],
  'fine lines / wrinkles': ["Skipping SPF while using retinol"],
  'dark circles': ["Poor sleep", "Rubbing eyes aggressively"],
  'enlarged pores': ["Heavy makeup that clogs pores", "Squeezing pores"],
  'uneven skin tone': ["Sun exposure without protection"],
};

function getAvoidList(userConcerns: string[]): string[] {
  const avoidSet = new Set<string>();
  for (const c of userConcerns) {
    const key = c.toLowerCase().trim();
    const items = AVOID_MAP[key];
    if (items) {
      items.forEach(item => avoidSet.add(item));
    }
  }
  if (avoidSet.size === 0) {
    avoidSet.add("Skipping daily SPF");
    avoidSet.add("Over-exfoliating skin");
  }
  return Array.from(avoidSet);
}

function getProductPrice(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const base = 12 + Math.abs(hash % 34);
  const cents = [49, 99, 0][Math.abs(hash % 3)];
  return `£${base}.${cents === 0 ? '00' : cents}`;
}

function getKeyIngredient(name: string, description: string): string {
  const n = name.toLowerCase();
  const d = description.toLowerCase();
  
  if (n.includes('mandelic') || n.includes('mandelactone')) return 'Mandelic Acid';
  if (n.includes('kojic') || n.includes('kojitrinol')) return 'Kojic Acid';
  if (n.includes('salicylic') || n.includes('bha')) return 'Salicylic Acid (BHA)';
  if (n.includes('glycolic') || n.includes('aha')) return 'Glycolic Acid (AHA)';
  if (n.includes('hyaluronic') || n.includes('hydration') || n.includes('snail mucin') || n.includes('snail 96')) return 'Hyaluronic Acid & Snail Mucin';
  if (n.includes('niacinamide') || n.includes('liqueur')) return 'Niacinamide';
  if (n.includes('ceramide') || n.includes('toleriane')) return 'Ceramides';
  if (n.includes('vitamin c') || n.includes('pigma')) return 'Vitamin C';
  if (n.includes('retinol') || n.includes('redermic')) return 'Retinol';
  if (n.includes('benzoyl peroxide') || n.includes('panoxyl')) return 'Benzoyl Peroxide';
  if (n.includes('zinc') || n.includes('titanium') || n.includes('mineral')) return 'Mineral SPF Filter';
  if (n.includes('rice')) return 'Rice Extract';
  if (n.includes('b5') || n.includes('panthenol')) return 'Vitamin B5 (Panthenol)';
  if (n.includes('peptide')) return 'Peptides';
  
  if (d.includes('mandelic')) return 'Mandelic Acid';
  if (d.includes('kojic')) return 'Kojic Acid';
  if (d.includes('salicylic') || d.includes('bha')) return 'Salicylic Acid';
  if (d.includes('glycolic') || d.includes('aha')) return 'Glycolic Acid';
  if (d.includes('hyaluronic')) return 'Hyaluronic Acid';
  if (d.includes('niacinamide')) return 'Niacinamide';
  if (d.includes('ceramide')) return 'Ceramides';
  if (d.includes('vitamin c')) return 'Vitamin C';
  if (d.includes('retinol')) return 'Retinol';
  
  return 'Dermatologist Approved Active';
}

function getProductRoutinePlacement(product: Product): { morning: boolean; evening: boolean } {
  const cat = (product.category_name || '').toLowerCase();
  const name = (product.product_name || '').toLowerCase();
  const desc = (product.description || '').toLowerCase();
  
  if (cat.includes('sunscreen') || cat.includes('sun protection')) {
    return { morning: true, evening: false };
  }
  if (cat.includes('cleanser') || cat.includes('wash')) {
    return { morning: true, evening: true };
  }
  if (cat.includes('moisturizer') || cat.includes('cream') || cat.includes('fluid')) {
    return { morning: true, evening: true };
  }
  if (cat.includes('toner')) {
    return { morning: true, evening: true };
  }
  if (cat.includes('essence')) {
    return { morning: true, evening: true };
  }
  
  const eveningOnlyKeywords = ['retinol', 'retinoid', 'mandelic', 'glycolic', 'salicylic', 'bha', 'exfoliating', 'peel', 'acid', 'kojic', 'trinity'];
  const isEveningOnly = eveningOnlyKeywords.some(keyword => name.includes(keyword) || desc.includes(keyword));
  
  if (isEveningOnly || cat.includes('exfoliant') || cat.includes('treatment') || cat.includes('patch') || cat.includes('mask') || cat.includes('anti-aging')) {
    return { morning: false, evening: true };
  }
  
  return { morning: true, evening: true };
}

export async function POST(request: NextRequest) {
  try {
    const analysis: AnalysisInput = await request.json();

    if (!analysis || (!analysis.detected_conditions && !analysis.skin_type_estimate)) {
      return NextResponse.json({ error: 'Invalid analysis data' }, { status: 400 });
    }

    // Step 1: Connect to Supabase and query active products
    const supabase = createAdminClient();
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active');

    if (dbError) {
      console.error('Failed to fetch products from Supabase:', dbError);
      return NextResponse.json({ error: 'Database service error' }, { status: 502 });
    }

    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ error: 'No products configured in database' }, { status: 500 });
    }

    // Step 2: Determine user concerns and primary vs secondary lists
    const userConcerns = (analysis.detected_conditions || []).map(c => c.condition);
    const skinType = (analysis.skin_type_estimate || '').toLowerCase();
    
    if ((skinType.includes('oily') || skinType.includes('combination')) && !userConcerns.includes('Oily Skin / Excess Sebum')) {
      userConcerns.push('Oily Skin / Excess Sebum');
    }
    if (skinType.includes('dry') && !userConcerns.includes('Dehydration')) {
      userConcerns.push('Dehydration');
    }

    const primary_concerns: string[] = [];
    const secondary_concerns: string[] = [];
    
    for (const c of (analysis.detected_conditions || [])) {
      if (c.severity === 'Severe' || c.severity === 'Moderate') {
        primary_concerns.push(c.condition);
      } else {
        secondary_concerns.push(c.condition);
      }
    }

    // Step 3: Run recommendation engine with the DB products catalog
    const recommendations = generateRecommendations(userConcerns, dbProducts as Product[], 3);
    const recommendedProducts = recommendations.slice(0, 6);

    // Step 4: Build morning/evening routine steps dynamically
    const morningSteps: string[] = [];
    const eveningSteps: string[] = [];

    const cleansers = recommendedProducts.filter(r => r.product.category_name?.toLowerCase().includes('cleanser'));
    const toners = recommendedProducts.filter(r => r.product.category_name?.toLowerCase().includes('toner'));
    const sunscreens = recommendedProducts.filter(r => r.product.category_name?.toLowerCase().includes('sunscreen') || r.product.category_name?.toLowerCase().includes('sun protection'));
    const moisturizers = recommendedProducts.filter(r => r.product.category_name?.toLowerCase().includes('moisturizer') || r.product.category_name?.toLowerCase().includes('cream') || r.product.category_name?.toLowerCase().includes('fluid'));
    
    const treatments = recommendedProducts.filter(r => {
      const cat = (r.product.category_name || '').toLowerCase();
      return !cat.includes('cleanser') && !cat.includes('toner') && !cat.includes('sunscreen') && !cat.includes('sun protection') && !cat.includes('moisturizer') && !cat.includes('cream') && !cat.includes('fluid');
    });

    // A. Cleanse
    if (cleansers.length > 0) {
      morningSteps.push(`Cleanse: ${cleansers[0].product.product_name}`);
      eveningSteps.push(`Cleanse: ${cleansers[0].product.product_name}`);
    } else {
      morningSteps.push('Cleanse: Gentle Cleanser');
      eveningSteps.push('Cleanse: Gentle Cleanser');
    }

    // B. Tone
    if (toners.length > 0) {
      morningSteps.push(`Tone: ${toners[0].product.product_name}`);
      eveningSteps.push(`Tone: ${toners[0].product.product_name}`);
    }

    // C. Target (Serums/Treatments)
    const morningTreatments: string[] = [];
    const eveningTreatments: string[] = [];

    for (const t of treatments) {
      const placement = getProductRoutinePlacement(t.product);
      if (placement.morning) {
        morningTreatments.push(`${t.product.category_name || 'Serum'}: ${t.product.product_name}`);
      }
      if (placement.evening) {
        eveningTreatments.push(`${t.product.category_name || 'Treatment'}: ${t.product.product_name}`);
      }
    }

    morningSteps.push(...morningTreatments.slice(0, 2));
    eveningSteps.push(...eveningTreatments.slice(0, 2));

    // D. Hydrate
    if (moisturizers.length > 0) {
      morningSteps.push(`Moisturise: ${moisturizers[0].product.product_name}`);
      eveningSteps.push(`Moisturise: ${moisturizers[0].product.product_name}`);
    } else {
      morningSteps.push('Moisturise: Hydrating Moisturiser');
      eveningSteps.push('Moisturise: Nourishing Moisturiser');
    }

    // E. Protect
    if (sunscreens.length > 0) {
      morningSteps.push(`Protect: ${sunscreens[0].product.product_name}`);
    } else {
      morningSteps.push('Protect: Broad-spectrum Sunscreen (SPF 50+)');
    }

    // Step 5: Generate AI summary or fallback
    let summary = '';
    if (GEMINI_API_KEY && userConcerns.length > 0) {
      try {
        const summaryPrompt = `You are a friendly skincare assistant for people with melanated (dark) skin.

Given these skin concerns: ${primary_concerns.join(', ')}${secondary_concerns.length ? ` (and minor: ${secondary_concerns.join(', ')})` : ''}
Skin type: ${analysis.skin_type_estimate || 'unknown'}

Write a SHORT, friendly, 2-sentence summary. Rules:
- Use simple English, no medical jargon
- Say "it looks like" or "your skin shows signs of" — NEVER say "you have" a disease
- Be encouraging and positive
- Must be exactly 2 sentences, nothing else
- Do NOT use markdown, bullet points, or formatting
- Return ONLY the 2 sentences, no JSON, no quotes`;

        const geminiRes = await fetch(GEMINI_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: summaryPrompt }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 200 },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) summary = text.trim().replace(/^["']|["']$/g, '');
        }
      } catch (err) {
        console.error('Failed to generate dynamic summary:', err);
      }
    }

    if (!summary) {
      summary = `It looks like your skin shows signs of ${userConcerns.map(c => c.toLowerCase()).join(' and ')}. With the right routine and daily SPF, you can see real improvement.`;
    }

    // Step 6: Map to final output payload format
    return NextResponse.json({
      issue: primary_concerns.join(', ') || secondary_concerns.join(', ') || 'Healthy Skin',
      skin_type: analysis.skin_type_estimate || 'unknown',
      summary,
      routine: {
        morning: morningSteps,
        evening: eveningSteps,
      },
      recommended_products: recommendedProducts.map(p => {
        const brand = p.product.brand || 'WBH';
        const price = getProductPrice(p.product.product_name);
        const ingredient = getKeyIngredient(p.product.product_name, p.product.description || '');
        const image = p.product.image_url || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=300';
        
        let link = p.product.product_url;
        if (!link) {
          const slug = p.product.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          link = `https://www.wholesalebeautyhub.co.uk/product/${slug}/?utm_source=wbhskin&utm_medium=recommendation`;
        }

        return {
          name: p.product.product_name,
          brand,
          price,
          match_score: p.matchScore,
          key_ingredient: ingredient,
          image,
          link,
          category: p.product.category_name || 'Treatment',
          reason: p.matchReason,
        };
      }),
      avoid: getAvoidList(userConcerns),
      primary_concerns,
      secondary_concerns,
    });
  } catch (error) {
    console.error('Recommend route error:', error);
    return NextResponse.json(
      { error: 'Internal server error during recommendation' },
      { status: 500 }
    );
  }
}
