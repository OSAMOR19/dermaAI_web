import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET — Product dashboard stats
export async function GET() {
  try {
    const supabase = createAdminClient();

    // Total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Total categories
    const { count: totalCategories } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    // Products by category
    const { data: categories } = await supabase
      .from('categories')
      .select('id, name, group_name, product_count')
      .order('product_count', { ascending: false });

    // Count actual products per category from the products table
    const { data: catCounts } = await supabase
      .from('products')
      .select('category_id, category_name');

    const categoryCountMap: Record<string, number> = {};
    (catCounts || []).forEach(p => {
      const cid = p.category_id;
      categoryCountMap[cid] = (categoryCountMap[cid] || 0) + 1;
    });

    const productsByCategory = (categories || []).map(c => ({
      ...c,
      actual_count: categoryCountMap[c.id] || 0,
    }));

    // Recently added products (last 10)
    const { data: recentProducts } = await supabase
      .from('products')
      .select('id, product_name, brand, category_name, image_url, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Most recommended products (top 10 by recommendation count)
    const { data: recItems } = await supabase
      .from('recommendation_items')
      .select('product_id');

    const recCountMap: Record<string, number> = {};
    (recItems || []).forEach(item => {
      recCountMap[item.product_id] = (recCountMap[item.product_id] || 0) + 1;
    });

    const topRecProductIds = Object.entries(recCountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id);

    let topRecommended: { id: string; product_name: string; brand: string; category_name: string; rec_count: number }[] = [];

    if (topRecProductIds.length > 0) {
      const { data: topProducts } = await supabase
        .from('products')
        .select('id, product_name, brand, category_name, image_url')
        .in('id', topRecProductIds);

      topRecommended = (topProducts || []).map(p => ({
        ...p,
        rec_count: recCountMap[p.id] || 0,
      })).sort((a, b) => b.rec_count - a.rec_count);
    }

    // Unique brands count
    const { data: brandRows } = await supabase
      .from('products')
      .select('brand')
      .not('brand', 'is', null);

    const uniqueBrands = new Set((brandRows || []).map(r => r.brand).filter(Boolean));

    return NextResponse.json({
      totalProducts: totalProducts || 0,
      totalCategories: totalCategories || 0,
      totalBrands: uniqueBrands.size,
      productsByCategory,
      recentProducts: recentProducts || [],
      topRecommended,
    });
  } catch (err) {
    console.error('Product stats error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
