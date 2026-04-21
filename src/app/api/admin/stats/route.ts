import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') return null;
  return user;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // New users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const { count: newUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    // Total scans
    const { count: totalScans } = await supabase
      .from('scans')
      .select('*', { count: 'exact', head: true });

    // Scans per day (last 7 days) — pull recent scans and group in JS
    const { data: recentScans } = await supabase
      .from('scans')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true });

    const scansPerDay: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      scansPerDay[d.toLocaleDateString('en-CA')] = 0; // YYYY-MM-DD
    }
    (recentScans || []).forEach((s) => {
      const day = new Date(s.created_at).toLocaleDateString('en-CA');
      if (scansPerDay[day] !== undefined) scansPerDay[day]++;
    });

    // Top skin conditions — sample last 200 scans
    const { data: conditionScans } = await supabase
      .from('scans')
      .select('analysis')
      .not('analysis', 'is', null)
      .order('created_at', { ascending: false })
      .limit(200);

    const conditionCounts: Record<string, number> = {};
    (conditionScans || []).forEach((s) => {
      const conditions = s.analysis?.detected_conditions || [];
      conditions.forEach((c: { condition: string }) => {
        if (c.condition) {
          conditionCounts[c.condition] = (conditionCounts[c.condition] || 0) + 1;
        }
      });
    });

    const topConditions = Object.entries(conditionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));

    // Recent activity (last 8 scans with user info)
    const { data: activityScans } = await supabase
      .from('scans')
      .select('id, user_id, created_at, analysis')
      .order('created_at', { ascending: false })
      .limit(8);

    // Fetch profile info for activity users
    const userIds = [...new Set((activityScans || []).map(s => s.user_id))];
    let profileMap: Record<string, { email: string; first_name: string }> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, first_name')
        .in('id', userIds);
      (profiles || []).forEach(p => { profileMap[p.id] = p; });
    }

    const activity = (activityScans || []).map(s => ({
      id: s.id,
      user_id: s.user_id,
      email: profileMap[s.user_id]?.email || 'Unknown',
      name: profileMap[s.user_id]?.first_name || 'User',
      created_at: s.created_at,
      condition: s.analysis?.detected_conditions?.[0]?.condition || 'No condition',
    }));

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      newUsers: newUsers ?? 0,
      totalScans: totalScans ?? 0,
      topCondition: topConditions[0]?.name || 'N/A',
      scansPerDay: Object.entries(scansPerDay).map(([date, count]) => ({ date, count })),
      topConditions,
      activity,
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
