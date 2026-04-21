import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') return null;
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    let query = supabase
      .from('profiles')
      .select('id, email, first_name, last_name, avatar_url, role, plan, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    const { data: users, count, error } = await query;
    if (error) throw error;

    // Get scan counts per user
    const userIds = (users || []).map(u => u.id);
    let scanCounts: Record<string, number> = {};
    if (userIds.length > 0) {
      const { data: scanData } = await supabase
        .from('scans')
        .select('user_id')
        .in('user_id', userIds);
      (scanData || []).forEach(s => {
        scanCounts[s.user_id] = (scanCounts[s.user_id] || 0) + 1;
      });
    }

    const enriched = (users || []).map(u => ({
      ...u,
      scan_count: scanCounts[u.id] || 0,
    }));

    return NextResponse.json({ users: enriched, total: count ?? 0, page, limit });
  } catch (err) {
    console.error('Admin users GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
