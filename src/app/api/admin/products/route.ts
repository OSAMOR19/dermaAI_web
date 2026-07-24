import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET — List products with search, filter, pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const concern = searchParams.get('concern') || '';
    const brand = searchParams.get('brand') || '';
    const sort = searchParams.get('sort') || 'product_name';
    const order = searchParams.get('order') || 'asc';

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' });

    // Search filter
    if (search) {
      query = query.or(
        `product_name.ilike.%${search}%,brand.ilike.%${search}%,best_for.ilike.%${search}%,category_name.ilike.%${search}%`
      );
    }

    // Category filter
    if (category) {
      query = query.eq('category_id', category);
    }

    // Brand filter
    if (brand) {
      query = query.eq('brand', brand);
    }

    // Concern tag filter
    if (concern) {
      query = query.contains('skin_concern_tags', [concern]);
    }

    // Sorting
    const ascending = order === 'asc';
    query = query.order(sort, { ascending });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: products, count, error } = await query;

    if (error) {
      console.error('Products list error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch unique brands for filter dropdown
    const { data: brandRows } = await supabase
      .from('products')
      .select('brand')
      .not('brand', 'is', null)
      .order('brand');

    const brands = [...new Set((brandRows || []).map(r => r.brand).filter(Boolean))];

    // Fetch categories for filter dropdown
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    // Collect unique skin concern tags
    const { data: tagRows } = await supabase
      .from('products')
      .select('skin_concern_tags');

    const allTags = new Set<string>();
    (tagRows || []).forEach(r => {
      (r.skin_concern_tags || []).forEach((t: string) => allTags.add(t));
    });
    const concerns = [...allTags].sort();

    return NextResponse.json({
      products: products || [],
      total: count || 0,
      categories: categories || [],
      brands,
      concerns,
      page,
      limit,
    });
  } catch (err) {
    console.error('Products API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
