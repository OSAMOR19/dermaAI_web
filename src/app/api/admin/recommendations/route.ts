import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateRecommendations, extractConcernsFromScans, type Product } from '@/lib/recommendation-engine';

// GET — Get recommendations for a user (by user_id query param)
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const consultationId = searchParams.get('consultation_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Build query
    let query = supabase
      .from('recommendations')
      .select('*, recommendation_items(*, products(*))')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (consultationId) {
      query = query.eq('consultation_id', consultationId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Recommendations fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ recommendations: data || [] });
  } catch (err) {
    console.error('Recommendations API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — Generate new recommendations for a user
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { user_id, consultation_id, concerns: manualConcerns, skip_generate } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Determine concerns: use manual if provided, else extract from scans
    let concerns: string[] = manualConcerns || [];

    if (concerns.length === 0 && !skip_generate) {
      // Fetch user's scan data
      const { data: scans } = await supabase
        .from('scans')
        .select('analysis')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(5);

      concerns = extractConcernsFromScans(scans || []);
    }

    // If skip_generate, just create an empty recommendation record
    if (skip_generate) {
      const { data: rec, error: recError } = await supabase
        .from('recommendations')
        .insert({
          user_id,
          consultation_id: consultation_id || null,
          skin_concerns: concerns.length > 0 ? concerns : ['Manual Selection'],
          status: 'draft',
        })
        .select('*, recommendation_items(*, products(*))')
        .single();

      if (recError) {
        console.error('Recommendation insert error:', recError);
        return NextResponse.json({ error: recError.message }, { status: 500 });
      }

      return NextResponse.json({ recommendation: rec });
    }

    if (concerns.length === 0) {
      return NextResponse.json({
        error: 'No skin concerns found. The user needs at least one scan before recommendations can be generated.',
      }, { status: 400 });
    }

    // Fetch all active products
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active');

    if (!products || products.length === 0) {
      return NextResponse.json({
        error: 'No products in the database. Please add products first.',
      }, { status: 400 });
    }

    // Run the recommendation engine
    const recommendations = generateRecommendations(concerns, products as Product[]);

    // Create a recommendation record
    const { data: rec, error: recError } = await supabase
      .from('recommendations')
      .insert({
        user_id,
        consultation_id: consultation_id || null,
        skin_concerns: concerns,
        status: 'draft',
      })
      .select()
      .single();

    if (recError) {
      console.error('Recommendation insert error:', recError);
      return NextResponse.json({ error: recError.message }, { status: 500 });
    }

    // Insert recommendation items
    const items = recommendations.map((r, index) => ({
      recommendation_id: rec.id,
      product_id: r.product.id,
      match_reason: r.matchReason,
      concern_match: r.concernMatch,
      confidence_score: r.matchScore,
      added_by: 'system',
      sort_order: index,
    }));

    if (items.length > 0) {
      const { error: itemsError } = await supabase
        .from('recommendation_items')
        .insert(items);

      if (itemsError) {
        console.error('Recommendation items insert error:', itemsError);
      }
    }

    // Fetch the complete recommendation with items and products
    const { data: fullRec } = await supabase
      .from('recommendations')
      .select('*, recommendation_items(*, products(*))')
      .eq('id', rec.id)
      .single();

    return NextResponse.json({
      recommendation: fullRec,
      concerns,
      totalMatches: recommendations.length,
    });
  } catch (err) {
    console.error('Recommendations POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — Update recommendation status/notes
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updates: Record<string, string> = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
      .from('recommendations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Recommendation PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
