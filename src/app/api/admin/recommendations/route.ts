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

    // Trigger emails if status is finalized
    if (status === 'finalized') {
      // 1. Fetch full recommendation details with items, products, and profile
      const { data: fullRec } = await supabase
        .from('recommendations')
        .select('*, recommendation_items(*, products(*)), profiles(*)')
        .eq('id', id)
        .single();

      if (fullRec && fullRec.profiles) {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (resendApiKey) {
          const fromEmail = process.env.RESEND_FROM_EMAIL || 'WBH Skin <noreply@wbhskin.com>';
          const ADMIN_EMAIL = 'info@wbhskin.com';
          const SALES_EMAIL = 'sales@wbhskin.com';

          const userProfile = fullRec.profiles;
          const user_name = `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'Valued Customer';
          const user_email = userProfile.email;
          const concernsText = (fullRec.skin_concerns || []).join(', ');
          const notesText = fullRec.notes || '';
          const items = (fullRec.recommendation_items || []) as any[];
          const products = items.map((item: any) => item.products).filter(Boolean) as any[];

          // Build product cards HTML for customer
          const productCardsHTML = products.map((p: any) => `
            <tr>
              <td style="padding:8px 0;">
                <table role="presentation" width="100%" style="background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden;">
                  <tr>
                    ${p.image_url ? `
                    <td style="width:80px;padding:12px;" valign="top">
                      <img src="${p.image_url}" alt="${p.product_name}" width="64" height="64" style="border-radius:8px;object-fit:cover;display:block;" />
                    </td>
                    ` : ''}
                    <td style="padding:12px ${p.image_url ? '12px 12px 0' : '12px'};" valign="top">
                      <div style="font-size:15px;font-weight:700;color:#1a1a1a;margin-bottom:3px;">${p.product_name}</div>
                      <div style="font-size:12px;color:#888;margin-bottom:4px;">${p.brand}</div>
                      <div style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;background:rgba(0,180,250,0.08);color:#0288D1;">${p.category_name}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          `).join('');

          const emailHTML = `
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="margin:0;padding:0;background-color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
              <table role="presentation" width="100%" style="background-color:#fafafa;padding:40px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
                      <!-- Header -->
                      <tr>
                        <td style="background:linear-gradient(135deg,#e84c88,#d63a74);padding:32px 28px;text-align:center;">
                          <div style="font-size:28px;margin-bottom:4px;">✨</div>
                          <div style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.3px;">Your Personalised Skincare</div>
                          <div style="font-size:13px;color:rgba(255,255,255,0.85);margin-top:6px;">Recommended just for you by WBH Skin</div>
                        </td>
                      </tr>
                      <!-- Greeting -->
                      <tr>
                        <td style="padding:28px 28px 0;">
                          <div style="font-size:16px;font-weight:700;color:#1a1a1a;margin-bottom:8px;">Hi ${user_name}! 👋</div>
                          <div style="font-size:14px;color:#555;line-height:1.6;">
                            Based on your skin analysis concerns${concernsText ? ` (${concernsText})` : ''}, our skincare specialist has hand-picked these products for you:
                          </div>
                        </td>
                      </tr>
                      <!-- Products -->
                      <tr>
                        <td style="padding:20px 28px;">
                          <table role="presentation" width="100%">
                            ${productCardsHTML}
                          </table>
                        </td>
                      </tr>
                      <!-- Consultant Notes -->
                      ${notesText ? `
                      <tr>
                        <td style="padding:0 28px 20px;">
                          <div style="background:#fff3f6;border-left:4px solid #e84c88;padding:16px;border-radius:0 12px 12px 0;">
                            <div style="font-size:12px;font-weight:800;color:#e84c88;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">💡 Consultant Advice / Other Recommendations</div>
                            <div style="font-size:13px;color:#555;line-height:1.5;white-space:pre-wrap;">${notesText}</div>
                          </div>
                        </td>
                      </tr>
                      ` : ''}
                      <!-- CTA -->
                      <tr>
                        <td style="padding:8px 28px 28px;" align="center">
                          <a href="https://wholesalebeautyhub.co.uk" style="display:inline-block;background:linear-gradient(135deg,#e84c88,#d63a74);color:#fff;text-decoration:none;padding:14px 36px;border-radius:50px;font-size:14px;font-weight:700;letter-spacing:0.5px;">
                            Shop These Products →
                          </a>
                        </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                        <td style="padding:20px 28px;background:#fafafa;border-top:1px solid #f0f0f0;text-align:center;">
                          <div style="font-size:11px;color:#999;">
                            Wholesale Beauty Hub · <a href="https://wholesalebeautyhub.co.uk" style="color:#e84c88;text-decoration:none;">wholesalebeautyhub.co.uk</a>
                          </div>
                          <div style="font-size:10px;color:#ccc;margin-top:6px;">
                            This recommendation was created by WBH Skin AI
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `;

          try {
            // Customer email dispatch removed (only store and admin are notified)

            // 2. Notify admin (info@wbhskin.com)
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: fromEmail,
                to: ADMIN_EMAIL,
                subject: `Recommendation sent to ${user_name}`,
                html: `
                  <div style="font-family:sans-serif;color:#333;padding:20px;">
                    <h3>Skincare Recommendation Dispatched</h3>
                    <p>A recommendation has been sent to client <strong>${user_name}</strong> (${user_email}).</p>
                    <p><strong>Concerns:</strong> ${concernsText || 'None'}</p>
                    ${notesText ? `<p><strong>Other Recommendations / Consultant Notes:</strong><br />${notesText.replace(/\n/g, '<br />')}</p>` : ''}
                    <p><strong>Products Recommended:</strong></p>
                    <ul>
                      ${products.map((p: any) => `<li>${p.product_name} (${p.brand})</li>`).join('')}
                    </ul>
                  </div>
                `,
              }),
            });

            // 3. Notify Store (sales@wbhskin.com) for Fulfillment
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                from: fromEmail,
                to: SALES_EMAIL,
                subject: `[Store Fulfillment] Sort & Pack Skincare Routine - ${user_name}`,
                html: `
                  <div style="font-family:sans-serif;color:#333;padding:20px;border:1px solid #ddd;border-radius:12px;">
                    <h2 style="color:#d63a74;margin-top:0;">Fulfillment Order Request</h2>
                    <p>Please sort, pack, and prepare for delivery the following recommended products for customer <strong>${user_name}</strong> (${user_email}):</p>
                    
                    <h3 style="border-bottom:1px solid #eee;padding-bottom:6px;margin-top:24px;">Recommended Products list</h3>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      ${products.map((p: any) => `
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #eee;">
                            <div style="font-weight:bold;font-size:14px;color:#1a1a1a;">${p.product_name}</div>
                            <div style="font-size:12px;color:#666;margin-top:2px;">Brand: ${p.brand} | Category: ${p.category_name}</div>
                            ${p.id ? `<div style="font-size:11px;color:#999;margin-top:2px;">Product ID: ${p.id}</div>` : ''}
                          </td>
                        </tr>
                      `).join('')}
                    </table>

                    ${notesText ? `
                    <div style="background:#fcf8fc;border-left:4px solid #e84c88;padding:12px;border-radius:0 8px 8px 0;margin-top:20px;">
                      <div style="font-size:11px;font-weight:bold;color:#e84c88;text-transform:uppercase;">Consultant Side Note</div>
                      <div style="font-size:13px;color:#555;margin-top:4px;white-space:pre-wrap;">${notesText}</div>
                    </div>
                    ` : ''}

                    <p style="margin-top:30px;font-size:11px;color:#aaa;text-align:center;">Sent automatically from WBH Skin Admin portal.</p>
                  </div>
                `,
              }),
            });

          } catch (emailErr) {
            console.error('Failed to send Resend emails on finalize:', emailErr);
          }
        }
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Recommendation PATCH error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
