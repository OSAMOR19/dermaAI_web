/**
 * WBH Recommendation Engine
 * 
 * Matches user skin concerns from scan data against the product database
 * to generate intelligent, category-diverse product recommendations.
 */

// ─── Types ───────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  category_id: string;
  category_name: string;
  product_name: string;
  brand: string;
  sub_type: string | null;
  finish: string | null;
  best_for: string | null;
  confidence_level: string;
  skin_concern_tags: string[];
  description: string | null;
  image_url: string | null;
  product_url: string | null;
  status: string;
}

export interface RecommendedProduct {
  product: Product;
  matchScore: number;        // 0–100
  matchReason: string;       // why it was recommended
  concernMatch: string[];    // which user concerns it addresses
  confidenceLabel: string;   // "High", "Medium", "Low"
}

// ─── Concern Tag Mapping ─────────────────────────────────────────────────
// Normalises user-facing concern labels → product database tags

const CONCERN_TAG_MAP: Record<string, string[]> = {
  // Acne variants
  'acne':                     ['Acne', 'Acne-Prone', 'Breakouts', 'Blemishes', 'Inflammatory Acne', 'Bacteria'],
  'acne (inflammatory)':      ['Acne', 'Inflammatory Acne', 'Breakouts', 'Blemishes', 'Bacteria'],
  'acne (comedonal)':         ['Acne', 'Blackheads', 'Pores', 'Breakouts'],
  'breakouts':                ['Acne', 'Breakouts', 'Blemishes'],

  // Pigmentation variants
  'hyperpigmentation':        ['Hyperpigmentation', 'PIH', 'Dark Spots', 'Brightening', 'Melasma'],
  'dark spots':               ['Dark Spots', 'PIH', 'Hyperpigmentation', 'Brightening'],
  'dark spots / sun damage':  ['Dark Spots', 'PIH', 'Hyperpigmentation', 'Brightening', 'Sun Protection'],
  'melasma':                  ['Melasma', 'Hyperpigmentation', 'PIH', 'Dark Spots'],
  'uneven skin tone':         ['Brightening', 'Glow', 'Hyperpigmentation', 'Dullness'],
  'pih':                      ['PIH', 'Hyperpigmentation', 'Dark Spots', 'Brightening'],

  // Oil & pore concerns
  'oily skin':                ['Oiliness', 'Excess Sebum', 'Oil Control', 'Matte', 'Pores'],
  'oily skin / excess sebum': ['Oiliness', 'Excess Sebum', 'Oil Control', 'Matte'],
  'enlarged pores':           ['Pores', 'Enlarged Pores', 'Pore Minimizing', 'Blackheads'],

  // Hydration / dryness
  'dehydration':              ['Dehydration', 'Hydration', 'Barrier Repair', 'Soothing'],
  'dry skin':                 ['Dryness', 'Hydration', 'Barrier Repair', 'Nourishing'],
  'dryness':                  ['Dryness', 'Hydration', 'Barrier Repair', 'Nourishing'],

  // Sensitivity
  'rosacea':                  ['Rosacea', 'Sensitive', 'Soothing', 'Redness'],
  'sensitive skin':           ['Sensitive', 'Soothing', 'Gentle', 'Redness'],
  'eczema':                   ['Eczema', 'Barrier Repair', 'Sensitive', 'Hydration'],

  // Ageing
  'fine lines / wrinkles':    ['Anti-Aging', 'Fine Lines', 'Wrinkles', 'Firmness'],
  'fine lines':               ['Anti-Aging', 'Fine Lines', 'Wrinkles', 'Firmness'],
  'wrinkles':                 ['Wrinkles', 'Anti-Aging', 'Fine Lines', 'Firmness'],
  'ageing':                   ['Anti-Aging', 'Fine Lines', 'Wrinkles', 'Firmness'],

  // Eye area
  'dark circles':             ['Dark Circles', 'Under-Eye', 'Puffiness', 'Brightening'],

  // Texture
  'rough texture':            ['Texture', 'Exfoliation', 'Smoothing'],
  'dullness':                 ['Dullness', 'Brightening', 'Glow'],
  'uneven texture':           ['Texture', 'Exfoliation', 'Smoothing'],

  // Sun
  'sun damage':               ['Sun Protection', 'UV Defense', 'Brightening', 'Dark Spots'],
};

// ─── Confidence Level Weights ────────────────────────────────────────────

const CONFIDENCE_WEIGHT: Record<string, number> = {
  'High': 1.0,
  'Medium': 0.7,
  'Low': 0.4,
};

// ─── Category Priority for Routine ──────────────────────────────────────
// Ensures a balanced routine covering essential categories

const ROUTINE_CATEGORIES = [
  'Cleansers',
  'Toner',
  'Serum',
  'Moisturizer',
  'Sunscreen',
  'Treatment',
  'Exfoliant',
];

// ─── Core Engine ─────────────────────────────────────────────────────────

/**
 * Normalise a concern string to lookup key
 */
function normaliseConcern(concern: string): string {
  return concern.toLowerCase().trim();
}

/**
 * Expand user concerns into a flat set of product tags
 */
function expandConcernsToTags(concerns: string[]): Set<string> {
  const tags = new Set<string>();
  for (const concern of concerns) {
    const key = normaliseConcern(concern);
    const mapped = CONCERN_TAG_MAP[key];
    if (mapped) {
      mapped.forEach(t => tags.add(t));
    } else {
      // Direct match fallback — use the concern text itself as a tag
      tags.add(concern);
    }
  }
  return tags;
}

/**
 * Calculate match score between a product and expanded concern tags
 */
function scoreProduct(product: Product, expandedTags: Set<string>): { score: number; matchedTags: string[] } {
  const productTags = product.skin_concern_tags || [];
  const matchedTags: string[] = [];

  for (const tag of productTags) {
    if (expandedTags.has(tag)) {
      matchedTags.push(tag);
    }
  }

  if (matchedTags.length === 0) return { score: 0, matchedTags: [] };

  // Tag overlap ratio (0–1): what fraction of product tags match user concerns
  const tagOverlap = matchedTags.length / Math.max(productTags.length, 1);

  // Concern coverage: how many of the matched tags are present
  const coverageRatio = matchedTags.length / Math.max(expandedTags.size, 1);

  // Confidence weight
  const confWeight = CONFIDENCE_WEIGHT[product.confidence_level] ?? 0.5;

  // Weighted score formula
  const raw = (tagOverlap * 0.40) + (coverageRatio * 0.30) + (confWeight * 0.30);
  const score = Math.round(raw * 100);

  return { score: Math.min(score, 100), matchedTags };
}

/**
 * Generate a human-readable match reason
 */
function buildMatchReason(product: Product, matchedTags: string[], userConcerns: string[]): string {
  const relevantConcerns = userConcerns.filter(c => {
    const key = normaliseConcern(c);
    const mapped = CONCERN_TAG_MAP[key] || [c];
    return mapped.some(t => matchedTags.includes(t));
  });

  if (relevantConcerns.length === 0) {
    return `${product.category_name} recommended for your skin type`;
  }

  const concerns = relevantConcerns.slice(0, 3).join(', ');
  return `${product.category_name} targeting ${concerns}`;
}

/**
 * Main recommendation function
 * 
 * @param userConcerns  Array of user skin concerns (from scan data)
 * @param allProducts   Full product catalog
 * @param maxPerCategory Max products per category (default 3)
 * @returns Sorted array of recommended products
 */
export function generateRecommendations(
  userConcerns: string[],
  allProducts: Product[],
  maxPerCategory: number = 3
): RecommendedProduct[] {
  if (!userConcerns.length || !allProducts.length) return [];

  const expandedTags = expandConcernsToTags(userConcerns);
  const scored: RecommendedProduct[] = [];

  // Score every active product
  for (const product of allProducts) {
    if (product.status !== 'active') continue;

    const { score, matchedTags } = scoreProduct(product, expandedTags);
    if (score === 0) continue;

    scored.push({
      product,
      matchScore: score,
      matchReason: buildMatchReason(product, matchedTags, userConcerns),
      concernMatch: matchedTags,
      confidenceLabel: product.confidence_level || 'Medium',
    });
  }

  // Sort by score descending
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // Limit per category to ensure diversity
  const categoryCounts: Record<string, number> = {};
  const diversified: RecommendedProduct[] = [];

  // First pass: ensure at least 1 from each routine category
  for (const category of ROUTINE_CATEGORIES) {
    const match = scored.find(
      r => r.product.category_name === category && !diversified.includes(r)
    );
    if (match) {
      diversified.push(match);
      categoryCounts[category] = 1;
    }
  }

  // Second pass: fill remaining slots
  for (const rec of scored) {
    if (diversified.includes(rec)) continue;

    const cat = rec.product.category_name || 'Other';
    const count = categoryCounts[cat] || 0;
    if (count >= maxPerCategory) continue;

    diversified.push(rec);
    categoryCounts[cat] = count + 1;
  }

  // Final sort by category priority then score
  const categoryOrder = new Map(ROUTINE_CATEGORIES.map((c, i) => [c, i]));
  diversified.sort((a, b) => {
    const catA = categoryOrder.get(a.product.category_name ?? '') ?? 99;
    const catB = categoryOrder.get(b.product.category_name ?? '') ?? 99;
    if (catA !== catB) return catA - catB;
    return b.matchScore - a.matchScore;
  });

  return diversified;
}

/**
 * Extract user skin concerns from scan analysis data
 * Pulls concerns from the AI scan's detected_conditions array
 */
export function extractConcernsFromScans(
  scans: { analysis: { detected_conditions?: { condition: string; confidence: number }[] } | null }[]
): string[] {
  const concernSet = new Set<string>();

  for (const scan of scans) {
    const conditions = scan.analysis?.detected_conditions || [];
    for (const cond of conditions) {
      if (cond.confidence >= 30) {
        concernSet.add(cond.condition);
      }
    }
  }

  return Array.from(concernSet);
}
