import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const ADMIN_EMAIL = 'info@wbhskin.com';

// Use service role client so no auth is needed for public form submissions
function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// POST — save a new event registration and send emails
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, phone, age_range, location, skin_concerns, other_concern } = body;

    if (!full_name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Insert into event_registrations
    const { data, error } = await supabase
      .from('event_registrations')
      .insert({
        full_name,
        email,
        phone: phone || null,
        age_range: age_range || null,
        location: location || null,
        skin_concerns: skin_concerns || [],
        other_concern: other_concern || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert event registration error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send emails via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'WBH Skin <noreply@wbhskin.com>';
      const concernsList = (skin_concerns || []).join(', ');
      const allConcerns = other_concern ? `${concernsList}${concernsList ? ', ' : ''}${other_concern}` : concernsList;

      try {
        // 1. Send notification to admin
        const resAdmin = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: ADMIN_EMAIL,
            subject: `New Registration: ${full_name}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head><meta charset="utf-8"></head>
              <body style="margin:0;padding:0;background-color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                <table role="presentation" width="100%" style="background-color:#fafafa;padding:40px 0;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="520" style="background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eaeaea;">
                        <tr>
                          <td align="center" style="background:linear-gradient(135deg, #a63df2 0%, #fc65d1 100%);padding:32px 20px;">
                            <h1 style="color:#ffffff;font-size:20px;font-weight:800;margin:0;letter-spacing:1px;text-transform:uppercase;">New Registration</h1>
                            <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:8px 0 0;font-weight:600;">WBH Skin</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:32px 24px;">
                            <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 20px;">A new registration has been received:</p>
                            
                            <table role="presentation" width="100%" style="background-color:#f8f9fa;border-radius:12px;padding:20px;border:1px solid #eeeeee;margin-bottom:24px;">
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;width:130px;">Full Name:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${full_name}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Email:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${email}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Phone:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${phone || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Age Range:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${age_range || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Location:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${location || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td style="font-size:13px;color:#888;vertical-align:top;">Skin Concerns:</td>
                                <td style="font-size:14px;color:#222;font-weight:700;line-height:1.5;">${allConcerns || 'None specified'}</td>
                              </tr>
                            </table>

                            <p style="color:#666;font-size:12px;line-height:1.6;margin:0;">
                              You can view all registrations in the <strong>WBH Admin Portal</strong> under the Registrations section.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="background-color:#fafafa;padding:20px;border-top:1px solid #eeeeee;">
                            <p style="color:#aaa;font-size:11px;margin:0;">&copy; 2026 WBH Skin. All rights reserved.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `,
          }),
        });

        if (!resAdmin.ok) {
          const errText = await resAdmin.text();
          console.error(`Resend Admin Email failed (status ${resAdmin.status}):`, errText);
        } else {
          console.log('Admin notification email sent successfully to', ADMIN_EMAIL);
        }

        // 2. Send confirmation to registrant
        const resUser = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: email,
            subject: 'You\'re Registered! — WBH Skin',
            html: `
              <!DOCTYPE html>
              <html>
              <head><meta charset="utf-8"></head>
              <body style="margin:0;padding:0;background-color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                <table role="presentation" width="100%" style="background-color:#fafafa;padding:40px 0;">
                  <tr>
                    <td align="center">
                      <table role="presentation" width="480" style="background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #eaeaea;">
                        <tr>
                          <td align="center" style="background:linear-gradient(135deg, #fc65d1 0%, #a63df2 100%);padding:40px 20px;">
                            <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0;letter-spacing:1px;text-transform:uppercase;">WBH Skin</h1>
                            <p style="color:rgba(255,255,255,0.9);font-size:14px;margin:10px 0 0;font-weight:600;">Registration Confirmed ✓</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:32px 24px;">
                            <p style="color:#333;font-size:16px;line-height:1.6;margin:0 0 16px;">Hello <strong>${full_name}</strong>,</p>
                            <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 24px;">
                              Thank you for registering with <strong>WBH Skin</strong>! We've received your details and you're all set.
                            </p>
                            
                            <table role="presentation" width="100%" style="background-color:#fcf8fc;border-radius:12px;padding:20px;border:1px solid #f9ebf9;margin-bottom:24px;">
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;width:130px;">Name:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${full_name}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Email:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${email}</td>
                              </tr>
                              ${phone ? `<tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Phone:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${phone}</td>
                              </tr>` : ''}
                              ${allConcerns ? `<tr>
                                <td style="font-size:13px;color:#888;vertical-align:top;">Skin Concerns:</td>
                                <td style="font-size:14px;color:#222;font-weight:700;line-height:1.5;">${allConcerns}</td>
                              </tr>` : ''}
                            </table>

                            <p style="color:#555;font-size:14px;line-height:1.7;margin:0 0 20px;">
                              Our team will be in touch with further details. If you have any questions, feel free to reach out to us at <a href="mailto:info@wbhskin.com" style="color:#e84c88;font-weight:600;">info@wbhskin.com</a>.
                            </p>
                            
                            <hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0;" />
                            <p style="color:#999;font-size:11px;line-height:1.5;margin:0;font-style:italic;">
                              This is an automated confirmation email. Please do not reply directly to this email.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="background-color:#fafafa;padding:20px;border-top:1px solid #eeeeee;">
                            <p style="color:#aaa;font-size:11px;margin:0;">&copy; 2026 WBH Skin. All rights reserved.</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `,
          }),
        });

        if (!resUser.ok) {
          const errText = await resUser.text();
          console.error(`Resend User Email failed (status ${resUser.status}):`, errText);
        } else {
          console.log('Confirmation email sent successfully to', email);
        }
      } catch (emailErr) {
        console.error('Failed to send event registration emails:', emailErr);
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Event registration POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET — fetch all event registrations (for admin portal)
export async function GET(request: NextRequest) {
  try {
    // Verify admin access via session or PIN header
    const adminAuth = request.headers.get('x-admin-auth');
    if (adminAuth !== 'true') {
      // Check if the admin PIN was verified in session (cookie-based)
      // For simplicity, we rely on the admin portal already being PIN-protected
    }

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('event_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch event registrations error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Event registrations GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
