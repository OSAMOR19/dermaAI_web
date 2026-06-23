import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const DOCTOR_EMAILS: Record<string, string> = {
  evelyn: 'info@wholesalebeautyhub.co.uk',
};

// POST — save a new consultation booking and trigger emails
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { doctor_id, doctor_name, date, time, notes, invitee_email, invitee_name, event_uuid } = body;

    if (!doctor_id || !doctor_name || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Deduplication check
    const { data: existingBooking } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', user.id)
      .eq('doctor_id', doctor_id)
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (existingBooking) {
      // Prevent double insertion and return existing record
      return NextResponse.json(existingBooking);
    }

    // Insert into consultations
    const { data, error } = await supabase
      .from('consultations')
      .insert({
        user_id: user.id,
        doctor_id,
        doctor_name,
        date,
        time,
        notes: notes ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert consultation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Trigger confirmation emails via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Wholesale Beauty Hub <onboarding@resend.dev>';
      const bookerEmail = invitee_email || user.email || '';
      const bookerName = invitee_name || user.user_metadata?.first_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ''}`.trim()
        : 'Valued Client';
      const doctorEmail = DOCTOR_EMAILS[doctor_id] || 'info@wholesalebeautyhub.co.uk';

      try {
        // 1. Send Email to the Booker (User)
        const resBooker = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: bookerEmail,
            subject: `Consultation Confirmed: ${doctor_name}`,
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
                          <td align="center" style="background:linear-gradient(135deg, #fc65d1 0%, #a63df2 100%);padding:32px 20px;">
                            <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0;letter-spacing:1px;text-transform:uppercase;">Wholesale Beauty Hub</h1>
                            <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:8px 0 0;font-weight:600;">Consultation Confirmed</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:32px 24px;">
                            <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 16px;">Hello <strong>${bookerName}</strong>,</p>
                            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">Your consultation appointment has been scheduled successfully. Here are your booking details:</p>
                            
                            <table role="presentation" width="100%" style="background-color:#fcf8fc;border-radius:12px;padding:20px;border:1px solid #f9ebf9;margin-bottom:24px;">
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;width:120px;">Specialist:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${doctor_name}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Date:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${date}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Time Slot:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${time}</td>
                              </tr>
                              <tr>
                                <td style="font-size:13px;color:#888;">Fee Status:</td>
                                <td style="font-size:14px;color:#fc65d1;font-weight:700;">Paid</td>
                              </tr>
                            </table>

                            <p style="color:#666;font-size:12px;line-height:1.6;margin:0 0 20px;">
                              Please log in to your account dashboard to view and download your official <strong>Booking Pass</strong> to present for check-in.
                            </p>
                            <hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0;" />
                            <p style="color:#999;font-size:11px;line-height:1.5;margin:0;font-style:italic;">
                              Disclaimer: AI diagnostics and expert consultations on this platform are intended for informational purposes only. They are not a substitute for clinical medical advice or treatment.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="background-color:#fafafa;padding:20px;border-top:1px solid #eeeeee;">
                            <p style="color:#aaa;font-size:11px;margin:0;">&copy; 2026 Wholesale Beauty Hub. All rights reserved.</p>
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

        if (!resBooker.ok) {
          const errText = await resBooker.text();
          console.error(`Resend Booker Email failed (status ${resBooker.status}):`, errText);
        }

        // 2. Send Email to the Doctor
        const resDoctor = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: doctorEmail,
            subject: `New Consultation Booked: ${bookerName}`,
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
                          <td align="center" style="background:linear-gradient(135deg, #a63df2 0%, #fc65d1 100%);padding:32px 20px;">
                            <h1 style="color:#ffffff;font-size:20px;font-weight:800;margin:0;letter-spacing:1px;text-transform:uppercase;">New Appointment</h1>
                            <p style="color:rgba(255,255,255,0.85);font-size:13px;margin:8px 0 0;font-weight:600;">Wholesale Beauty Hub</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:32px 24px;">
                            <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 16px;">Hello <strong>${doctor_name}</strong>,</p>
                            <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">A client has scheduled a new skin consultation with you. Here are the booking details:</p>
                            
                            <table role="presentation" width="100%" style="background-color:#f8f9fa;border-radius:12px;padding:20px;border:1px solid #eeeeee;margin-bottom:24px;">
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;width:120px;">Client Name:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${bookerName}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Client Email:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${bookerEmail}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Date:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${date}</td>
                              </tr>
                              <tr>
                                <td style="padding-bottom:10px;font-size:13px;color:#888;">Time Slot:</td>
                                <td style="padding-bottom:10px;font-size:14px;color:#222;font-weight:700;">${time}</td>
                              </tr>
                              <tr>
                                <td style="font-size:13px;color:#888;vertical-align:top;">Notes / ID:</td>
                                <td style="font-size:14px;color:#222;line-height:1.4;">${notes ?? 'N/A'}</td>
                              </tr>
                            </table>

                            <p style="color:#666;font-size:12px;line-height:1.6;margin:0;">
                              Please prepare for this session accordingly. You can contact the client directly at <strong>${bookerEmail}</strong>.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="background-color:#fafafa;padding:20px;border-top:1px solid #eeeeee;">
                            <p style="color:#aaa;font-size:11px;margin:0;">&copy; 2026 Wholesale Beauty Hub. All rights reserved.</p>
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

        if (!resDoctor.ok) {
          const errText = await resDoctor.text();
          console.error(`Resend Doctor Email failed (status ${resDoctor.status}):`, errText);
        }
      } catch (emailErr) {
        // Log error but don't fail the request so the user's booking screen loads correctly
        console.error('Failed to send Resend emails:', emailErr);
      }
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Consultations POST error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET — fetch user's consultations history
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch consultations error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Consultations GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
