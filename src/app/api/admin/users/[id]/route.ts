import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  const hasAccess = user.email === 'info@wbhskin.com' || (profile && (profile.role === 'admin' || profile.role === 'superadmin'));
  if (!hasAccess) return null;
  
  return user;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data: scans, error: scansError } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (scansError) throw scansError;

    // Generate signed URLs for scan images
    const scansWithUrls = await Promise.all((scans || []).map(async (scan) => {
      const signedUrls: string[] = [];
      if (scan.image_urls && scan.image_urls.length > 0) {
        for (const path of scan.image_urls) {
          const { data: urlData } = await supabase.storage.from('scans').createSignedUrl(path, 3600);
          if (urlData?.signedUrl) signedUrls.push(urlData.signedUrl);
        }
      }
      return { ...scan, signed_image_urls: signedUrls };
    }));

    const { data: consultations, error: consultationsError } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (consultationsError) throw consultationsError;

    return NextResponse.json({ profile, scans: scansWithUrls, consultations: consultations || [] });
  } catch (err) {
    console.error('Admin user detail GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const admin = await requireAdmin(supabase);
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const body = await request.json();

    // Only allow updating plan and role (never let role escalation happen without audit)
    const allowedFields: Record<string, unknown> = {};
    if (body.plan && ['free', 'pro'].includes(body.plan)) {
      allowedFields.plan = body.plan;
    }
    if (body.role && ['user', 'admin'].includes(body.role)) {
      allowedFields.role = body.role;
    }

    if (Object.keys(allowedFields).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(allowedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error('Admin user PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
