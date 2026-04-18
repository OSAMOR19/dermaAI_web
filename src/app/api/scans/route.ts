import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST — save a new scan
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { score, analysis, image_urls } = body;

    const { data, error } = await supabase
      .from('scans')
      .insert({
        user_id: user.id,
        score: score ?? null,
        analysis: analysis ?? null,
        image_urls: image_urls ?? [],
      })
      .select()
      .single();

    if (error) {
      console.error('Insert scan error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Scans POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET — fetch user's scan history
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Fetch scans error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Generate signed URLs so client can view private images
    const scansWithUrls = await Promise.all(data.map(async (scan) => {
      const signedUrls = [];
      if (scan.image_urls && scan.image_urls.length > 0) {
        for (const path of scan.image_urls) {
          const { data: urlData } = await supabase.storage.from('scans').createSignedUrl(path, 3600);
          if (urlData?.signedUrl) signedUrls.push(urlData.signedUrl);
        }
      }
      return { ...scan, image_urls: signedUrls.length > 0 ? signedUrls : scan.image_urls };
    }));

    return NextResponse.json(scansWithUrls);
  } catch (err) {
    console.error('Scans GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE — delete a specific scan or all scans
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scan_id } = await request.json().catch(() => ({ scan_id: null }));

    if (scan_id) {
      // Delete specific scan
      const { data: scan } = await supabase.from('scans').select('image_urls').eq('user_id', user.id).eq('id', scan_id).single();
      if (scan && scan.image_urls && scan.image_urls.length > 0) {
        await supabase.storage.from('scans').remove(scan.image_urls);
      }
      const { error } = await supabase.from('scans').delete().eq('user_id', user.id).eq('id', scan_id);
      if (error) throw error;
    } else {
      // Delete all scans
      const { data: scans } = await supabase.from('scans').select('image_urls').eq('user_id', user.id);
      const allUrls = scans?.flatMap(s => s.image_urls || []) || [];
      if (allUrls.length > 0) {
        await supabase.storage.from('scans').remove(allUrls);
      }
      const { error } = await supabase.from('scans').delete().eq('user_id', user.id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Scans DELETE error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
