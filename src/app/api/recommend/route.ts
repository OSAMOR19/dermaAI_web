import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/data/products.json';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const RECOMMEND_PROMPT = `You are a simple skincare assistant. You do NOT diagnose diseases.

Given this skin analysis JSON, return product recommendations.

Rules:
- Explain in simple English (like talking to a beginner)
- No medical terms or jargon
- Keep summary under 2 sentences
- Use phrases like "it looks like" or "this may be"
- Do NOT say the user has a disease
- Keywords should be product-friendly (e.g. "acne cleanser", "hydrating cream")
- Routine should be simple (max 4 steps, short names)
- Match products from the provided catalog based on the skin issues and keywords

PRODUCT CATALOG:
${JSON.stringify(productsData.map(p => ({ id: p.id, name: p.name, category: p.category, issues: p.issues, keywords: p.keywords })), null, 2)}

Return STRICT JSON only, no extra text:

{
  "issue": "main skin concern in simple words",
  "skin_type": "oily | dry | combination | normal | sensitive",
  "summary": "friendly 1-2 sentence summary",
  "routine": ["Step 1 name", "Step 2 name", "Step 3 name", "Step 4 name"],
  "matched_product_ids": ["prod_001", "prod_003"]
}

Pick 3-5 products from the catalog that best match the detected conditions and skin type. Only use product IDs from the catalog.`;

interface AnalysisInput {
  detected_conditions?: { condition: string; confidence: number; severity: string }[];
  skin_type_estimate?: string;
  recommendations?: string[];
  warning_signs?: string[];
}

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const analysis: AnalysisInput = await request.json();

    if (!analysis || (!analysis.detected_conditions && !analysis.skin_type_estimate)) {
      return NextResponse.json(
        { error: 'Invalid analysis data' },
        { status: 400 }
      );
    }

    const geminiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: RECOMMEND_PROMPT },
            { text: `\n\nSKIN ANALYSIS:\n${JSON.stringify(analysis)}` },
          ],
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini recommend error:', geminiResponse.status, errText);

      if (geminiResponse.status === 429) {
        return NextResponse.json(
          { error: 'AI rate limit reached. Product recommendations will appear on your next scan.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `AI service error (${geminiResponse.status})` },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();
    const textContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      return NextResponse.json(
        { error: 'AI returned an empty recommendation response' },
        { status: 502 }
      );
    }

    let recommendation;
    try {
      recommendation = JSON.parse(textContent);
    } catch {
      const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[1].trim());
      } else {
        console.error('Failed to parse recommend JSON:', textContent);
        return NextResponse.json(
          { error: 'AI returned invalid recommendation format' },
          { status: 502 }
        );
      }
    }

    // Resolve product IDs to full product objects
    const matchedIds: string[] = recommendation.matched_product_ids || [];
    const recommended_products = matchedIds
      .map(id => productsData.find(p => p.id === id))
      .filter(Boolean)
      .map(p => ({
        id: p!.id,
        name: p!.name,
        category: p!.category,
        image: p!.image,
        link: p!.link,
        reason: '', // Will be filled below
      }));

    // If Gemini didn't match enough, fallback to keyword matching
    if (recommended_products.length < 3) {
      const conditions = (analysis.detected_conditions || []).map(c => c.condition.toLowerCase());
      const skinType = (analysis.skin_type_estimate || '').toLowerCase();

      const fallbacks = productsData
        .filter(p => !matchedIds.includes(p.id))
        .filter(p =>
          p.issues.some(issue => conditions.some(c => issue.includes(c) || c.includes(issue))) ||
          p.issues.some(issue => issue.includes(skinType))
        )
        .slice(0, 5 - recommended_products.length);

      for (const p of fallbacks) {
        recommended_products.push({
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          link: p.link,
          reason: '',
        });
      }
    }

    // Generate short reasons per product category
    const categoryReasons: Record<string, string> = {
      cleanser: 'Helps keep your skin clean and fresh',
      serum: 'Targets your specific skin concerns',
      moisturizer: 'Keeps your skin hydrated and protected',
      sunscreen: 'Protects against sun damage and dark spots',
      treatment: 'Helps calm and soothe irritation',
    };

    for (const p of recommended_products) {
      p.reason = categoryReasons[p.category] || 'Matched to your skin analysis';
    }

    return NextResponse.json({
      issue: recommendation.issue || '',
      skin_type: recommendation.skin_type || '',
      summary: recommendation.summary || '',
      routine: recommendation.routine || [],
      recommended_products,
    });
  } catch (error) {
    console.error('Recommend route error:', error);
    return NextResponse.json(
      { error: 'Internal server error during recommendation' },
      { status: 500 }
    );
  }
}
