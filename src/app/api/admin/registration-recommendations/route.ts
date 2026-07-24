import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const ADMIN_EMAIL = 'info@wbhskin.com';

interface RecommendationProduct {
  product_id: string;
  product_name: string;
  brand: string;
  category_name: string;
  image_url: string | null;
  match_reason: string;
}

// POST — Save recommendation from registration page and optionally email the user
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();
    const {
      registration_id,
      user_name,
      user_email,
      skin_concerns,
      products,
      send_email,
    }: {
      registration_id: string;
      user_name: string;
      user_email: string;
      skin_concerns: string[];
      products: RecommendationProduct[];
      send_email?: boolean;
    } = body;

    if (!user_email || !products || products.length === 0) {
      return NextResponse.json({ error: 'Email and at least one product required' }, { status: 400 });
    }

    // 1. Save to recommendations table (use registration_id as a reference)
    const { data: rec, error: recError } = await supabase
      .from('recommendations')
      .insert({
        user_id: null, // No auth user — this is from event registration
        consultation_id: null,
        skin_concerns: skin_concerns || [],
        status: 'sent',
        notes: `Registration recommendation for ${user_name} (${user_email}). Registration ID: ${registration_id}`,
      })
      .select()
      .single();

    // If user_id is required (NOT NULL), try alternative approach
    if (recError) {
      console.error('Recommendation insert error (may need user_id):', recError);
      // Still proceed with email even if DB save fails
    }

    // 2. Insert recommendation items if rec was created
    if (rec) {
      const items = products.map((p, i) => ({
        recommendation_id: rec.id,
        product_id: p.product_id,
        match_reason: p.match_reason || `${p.category_name} — admin selected`,
        concern_match: skin_concerns || [],
        confidence_score: 85,
        added_by: 'admin',
        sort_order: i,
      }));

      const { error: itemsError } = await supabase
        .from('recommendation_items')
        .insert(items);

      if (itemsError) {
        console.error('Recommendation items insert error:', itemsError);
      }
    }

    // 3. Send email via Resend
    let emailSent = false;
    if (send_email !== false) {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'WBH Skin <noreply@wbhskin.com>';
        const concernsText = (skin_concerns || []).join(', ');

        // Build product cards HTML
        const productCardsHTML = products.map(p => `
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
                    ${p.match_reason ? `<div style="font-size:11px;color:#888;margin-top:4px;">💡 ${p.match_reason}</div>` : ''}
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
                          Based on your skin concerns${concernsText ? ` (${concernsText})` : ''}, our skincare specialist has hand-picked these products for you:
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
          // Send to user
          const resUser = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: fromEmail,
              to: user_email,
              subject: `${user_name}, your personalised skincare picks are ready! ✨`,
              html: emailHTML,
            }),
          });

          if (resUser.ok) {
            emailSent = true;
          } else {
            const err = await resUser.text();
            console.error('Resend user email error:', err);
          }

          // Also notify admin
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
                <p>A product recommendation has been sent to <strong>${user_name}</strong> (${user_email}).</p>
                <p><strong>Skin Concerns:</strong> ${concernsText || 'N/A'}</p>
                <p><strong>Products (${products.length}):</strong></p>
                <ul>${products.map(p => `<li>${p.product_name} (${p.brand}) — ${p.category_name}</li>`).join('')}</ul>
              `,
            }),
          });
        } catch (emailErr) {
          console.error('Email send error:', emailErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      recommendation_id: rec?.id || null,
      email_sent: emailSent,
    });
  } catch (err) {
    console.error('Registration recommendation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
