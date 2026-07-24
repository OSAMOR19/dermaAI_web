import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET — Get single product detail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;

    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Fetch recommendation count for this product
    const { count: recCount } = await supabase
      .from('recommendation_items')
      .select('*', { count: 'exact', head: true })
      .eq('product_id', id);

    // Fetch the category details
    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('id', product.category_id)
      .single();

    return NextResponse.json({
      product,
      category,
      recommendation_count: recCount || 0,
    });
  } catch (err) {
    console.error('Product detail error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — Update product (future-ready)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Product update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
