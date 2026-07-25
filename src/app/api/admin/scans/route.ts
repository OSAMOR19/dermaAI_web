import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function requireSuperAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  const isSuper = user.email === 'info@wbhskin.com' || (profile && profile.role === 'superadmin');
  if (!isSuper) return null;
  
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = await requireSuperAdmin(supabase);
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('user_id') || '';
    const condition = searchParams.get('condition') || '';
    const dateFrom = searchParams.get('date_from') || '';
    const dateTo = searchParams.get('date_to') || '';
    const offset = (page - 1) * limit;

    let query = supabase
      .from('scans')
      .select('id, user_id, created_at, analysis, image_urls, score', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) query = query.eq('user_id', userId);
    if (dateFrom) query = query.gte('created_at', dateFrom);
    if (dateTo) query = query.lte('created_at', dateTo);

    const { data: scans, count, error } = await query;
    if (error) throw error;

    // Get user info for each scan
    const userIds = [...new Set((scans || []).map(s => s.user_id))];
    let profileMap: Record<string, { email: string; first_name: string }> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, first_name')
        .in('id', userIds);
      (profiles || []).forEach(p => { profileMap[p.id] = p; });
    }

    // Generate signed URLs for all images
    const enriched = await Promise.all((scans || []).map(async (scan) => {
      const signedUrls: string[] = [];
      if (scan.image_urls && scan.image_urls.length > 0) {
        for (const path of scan.image_urls) {
          const { data: urlData } = await supabase.storage.from('scans').createSignedUrl(path, 3600);
          if (urlData?.signedUrl) signedUrls.push(urlData.signedUrl);
        }
      }

      const conditions = scan.analysis?.detected_conditions || [];
      // Apply condition filter in JS
      if (condition && !conditions.some((c: { condition: string }) =>
        c.condition.toLowerCase().includes(condition.toLowerCase())
      )) {
        return null;
      }

      return {
        id: scan.id,
        user_id: scan.user_id,
        user_email: profileMap[scan.user_id]?.email || 'Unknown',
        user_name: profileMap[scan.user_id]?.first_name || 'User',
        created_at: scan.created_at,
        score: scan.score,
        image_urls: signedUrls,
        conditions: conditions.map((c: { condition: string; severity: string; confidence: number }) => ({
          condition: c.condition,
          severity: c.severity || 'mild',
          confidence: c.confidence || 0,
        })),
      };
    }));

    const filtered = enriched.filter(Boolean);

    return NextResponse.json(filtered);
  } catch (err) {
    console.error('Admin scans GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
