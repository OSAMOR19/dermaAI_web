import { NextRequest, NextResponse } from 'next/server';
import skinConcerns from '@/data/products.json';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface ProductOption {
  name: string;
  image: string;
  link: string;
}

interface SkinConcern {
  id: number;
  skinConcern: string;
  faceZone: string;
  treatmentSteps: string[];
  products: ProductOption[];
  avoid: string[];
  whyItMatters: string;
}

interface AnalysisInput {
  detected_conditions?: { condition: string; confidence: number; severity: string }[];
  skin_type_estimate?: string;
  recommendations?: string[];
  warning_signs?: string[];
}

// Map Gemini-detected conditions to our dataset concern IDs
function matchConcerns(analysis: AnalysisInput): { primary: SkinConcern[]; secondary: SkinConcern[] } {
  const conditions = (analysis.detected_conditions || []);
  const primary: SkinConcern[] = [];
  const secondary: SkinConcern[] = [];

  const concernMap: Record<string, number[]> = {
    'acne': [2],
    'hyperpigmentation': [1, 3],
    'dark spot': [1],
    'dark spots': [1],
    'pih': [1],
    'uneven': [3],
    'uneven skin tone': [3],
    'eczema': [4],
    'dermatitis': [4],
    'dry': [4],
    'dehydration': [4],
    'oily': [5],
    'rosacea': [3],
    'rash': [4],
    'fungal': [2],
    'psoriasis': [4],
    'normal': [],
  };

  const matchedIds = new Set<number>();

  for (const c of conditions) {
    const name = c.condition.toLowerCase();
    const severity = c.severity;

    // Find matching concern IDs
    let ids: number[] = [];
    for (const [key, val] of Object.entries(concernMap)) {
      if (name.includes(key) || key.includes(name)) {
        ids = [...ids, ...val];
      }
    }

    for (const id of ids) {
      if (matchedIds.has(id)) continue;
      matchedIds.add(id);
      const concern = (skinConcerns as SkinConcern[]).find(sc => sc.id === id);
      if (!concern) continue;

      if (severity === 'high' || severity === 'moderate') {
        primary.push(concern);
      } else {
        secondary.push(concern);
      }
    }
  }

  // If skin type suggests oiliness/dryness and not yet matched
  const skinType = (analysis.skin_type_estimate || '').toLowerCase();
  if (skinType.includes('oily') && !matchedIds.has(5)) {
    secondary.push((skinConcerns as SkinConcern[]).find(sc => sc.id === 5)!);
  }
  if (skinType.includes('dry') && !matchedIds.has(4)) {
    secondary.push((skinConcerns as SkinConcern[]).find(sc => sc.id === 4)!);
  }

  return { primary, secondary };
}

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const analysis: AnalysisInput = await request.json();

    if (!analysis || (!analysis.detected_conditions && !analysis.skin_type_estimate)) {
      return NextResponse.json({ error: 'Invalid analysis data' }, { status: 400 });
    }

    // Step 1: Match concerns from our dataset
    const { primary, secondary } = matchConcerns(analysis);
    const allConcerns = [...primary, ...secondary];

    // Step 2: Build product recommendations (max 6)
    const recommendedProducts: ProductOption[] = [];
    const usedProducts = new Set<string>();

    // Primary concerns: up to 3 products each
    for (const concern of primary) {
      const toAdd = concern.products.filter(p => !usedProducts.has(p.name)).slice(0, 3);
      for (const p of toAdd) {
        if (recommendedProducts.length >= 6) break;
        recommendedProducts.push(p);
        usedProducts.add(p.name);
      }
    }

    // Secondary concerns: 1 product each
    for (const concern of secondary) {
      if (recommendedProducts.length >= 6) break;
      const toAdd = concern.products.find(p => !usedProducts.has(p.name));
      if (toAdd) {
        recommendedProducts.push(toAdd);
        usedProducts.add(toAdd.name);
      }
    }

    // Step 3: Build routine
    const morningSteps = new Set<string>();
    const eveningSteps = new Set<string>();

    for (const concern of allConcerns) {
      for (const step of concern.treatmentSteps) {
        const s = step.toLowerCase();
        if (s.includes('spf') || s.includes('sunscreen')) {
          morningSteps.add(step);
        } else if (s.includes('cleanser')) {
          morningSteps.add(step);
          eveningSteps.add(step);
        } else if (s.includes('treatment') || s.includes('serum')) {
          eveningSteps.add(step);
        } else if (s.includes('moistur')) {
          morningSteps.add(step);
          eveningSteps.add(step);
        } else {
          eveningSteps.add(step);
        }
      }
    }

    // Always add SPF morning if PIH or uneven tone
    if (primary.some(c => c.id === 1 || c.id === 3) || secondary.some(c => c.id === 1 || c.id === 3)) {
      morningSteps.add('SPF');
    }

    // Step 4: Collect avoid list
    const avoidSet = new Set<string>();
    for (const concern of allConcerns) {
      for (const a of concern.avoid) {
        avoidSet.add(a);
      }
    }

    // Step 5: Build a simple summary using Gemini (short, friendly)
    let summary = '';
    try {
      const summaryPrompt = `You are a friendly skincare assistant for people with melanated (dark) skin.

Given these skin concerns: ${primary.map(c => c.skinConcern).join(', ')}${secondary.length ? ` (and minor: ${secondary.map(c => c.skinConcern).join(', ')})` : ''}
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
    } catch {
      // Fallback summary
      summary = `It looks like your skin shows signs of ${primary.map(c => c.skinConcern).join(' and ').toLowerCase()}. With the right routine and daily SPF, you can see real improvement.`;
    }

    // If no concerns matched, provide a healthy-skin response
    if (allConcerns.length === 0) {
      return NextResponse.json({
        issue: 'Healthy skin',
        skin_type: analysis.skin_type_estimate || 'normal',
        summary: 'Your skin looks healthy! Keep up your current routine and always wear SPF to maintain your glow.',
        routine: {
          morning: ['Gentle Cleanser', 'Moisturiser', 'SPF'],
          evening: ['Gentle Cleanser', 'Moisturiser'],
        },
        recommended_products: [],
        avoid: ['Harsh scrubs', 'Skipping sunscreen'],
        primary_concerns: [],
        secondary_concerns: [],
      });
    }

    return NextResponse.json({
      issue: primary.map(c => c.skinConcern).join(', ') || secondary.map(c => c.skinConcern).join(', '),
      skin_type: analysis.skin_type_estimate || 'unknown',
      summary,
      routine: {
        morning: Array.from(morningSteps),
        evening: Array.from(eveningSteps),
      },
      recommended_products: recommendedProducts.map(p => {
        // Find which concern this product belongs to
        const parentConcern = allConcerns.find(c => c.products.some(prod => prod.name === p.name));
        return {
          name: p.name,
          image: p.image,
          link: p.link,
          category: parentConcern?.treatmentSteps[0] || 'Treatment',
          reason: parentConcern ? `Targets ${parentConcern.skinConcern.toLowerCase()}` : 'Matched to your skin analysis',
        };
      }),
      avoid: Array.from(avoidSet),
      primary_concerns: primary.map(c => c.skinConcern),
      secondary_concerns: secondary.map(c => c.skinConcern),
    });
  } catch (error) {
    console.error('Recommend route error:', error);
    return NextResponse.json(
      { error: 'Internal server error during recommendation' },
      { status: 500 }
    );
  }
}
