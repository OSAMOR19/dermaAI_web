import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// POST — Add a product to a recommendation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id: recommendationId } = await params;
    const body = await request.json();
    const { product_id, match_reason, concern_match, confidence_score } = body;

    if (!product_id) {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 });
    }

    // Check if this product is already in the recommendation
    const { data: existing } = await supabase
      .from('recommendation_items')
      .select('id')
      .eq('recommendation_id', recommendationId)
      .eq('product_id', product_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Product already in recommendation' }, { status: 409 });
    }

    // Get current max sort_order
    const { data: maxOrder } = await supabase
      .from('recommendation_items')
      .select('sort_order')
      .eq('recommendation_id', recommendationId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextOrder = (maxOrder?.sort_order || 0) + 1;

    const { data, error } = await supabase
      .from('recommendation_items')
      .insert({
        recommendation_id: recommendationId,
        product_id,
        match_reason: match_reason || 'Manually added by admin',
        concern_match: concern_match || [],
        confidence_score: confidence_score || 0,
        added_by: 'admin',
        sort_order: nextOrder,
      })
      .select('*, products(*)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Add recommendation item error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — Remove a product from a recommendation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id: recommendationId } = await params;
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('item_id');

    if (!itemId) {
      return NextResponse.json({ error: 'item_id is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('recommendation_items')
      .delete()
      .eq('id', itemId)
      .eq('recommendation_id', recommendationId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete recommendation item error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
