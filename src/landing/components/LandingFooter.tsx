import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Clock } from 'lucide-react';

const infoItems = [
  { Icon: Mail, title: 'Contact Us', lines: ['info@wbhskin.com', '(123) 465 - 798'] },
  { Icon: MapPin, title: 'Our Location', lines: ['2 Akinmade Street Off Sylvia Crescent', 'Anthony Village Maryland, Lagos, Nigeria.'] },
  { Icon: Clock, title: 'Working Hours', lines: ['Monday - Friday : 9:00 am to 6:00 pm', 'Saturday : 11:00 am to 5pm'] },
];

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Login', href: '/login' },
  { name: 'Get Started', href: '/signup' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
];

const serviceLinks = ['Scar Revision', 'Wrinkle Reduction', 'Chemical Peels', 'Diagnosis Imaging', 'Dermabrasion'];

export default function LandingFooter() {
  return (
    <footer id="contact" style={{ background: '#2d1a12', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 300, height: 300, background: 'rgba(227,27,93,0.04)', borderRadius: '50%', transform: 'translate(50px, 50px)' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 10 }}>
        {/* Info row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, padding: '60px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {infoItems.map(({ Icon, title, lines }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              <Icon size={28} color="#e31b5d" style={{ marginTop: 4, flexShrink: 0 }} />
              <div>
                <h3 style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 22, color: '#fff', marginBottom: 8 }}>{title}</h3>
                {lines.map((l, j) => <p key={j} style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: 15, lineHeight: 1.6 }}>{l}</p>)}
              </div>
            </div>
          ))}
        </div>

        {/* Links grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, padding: '60px 0' }}>
          {/* Brand */}
          <div>
            <div style={{ background: '#fff', padding: 16, borderRadius: 16, display: 'inline-block', marginBottom: 24 }}>
              <div style={{ position: 'relative', width: 120, height: 36 }}>
                <Image src="/wbh-logo.png" alt="Wholesale Beauty Hub" fill style={{ objectFit: 'contain' }} />
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, fontSize: 15, fontWeight: 500, marginBottom: 24 }}>
              Providing professional beauty care with the perfect blend of medical science and artistic precision.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 22, color: '#e31b5d', fontStyle: 'italic', marginBottom: 28 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {quickLinks.map(({ name, href }) => (
                <li key={name}>
                  <Link href={href} style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ display: 'inline-block', width: 0, height: 2, background: '#e31b5d', transition: 'width 0.2s' }} />
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 22, color: '#e31b5d', fontStyle: 'italic', marginBottom: 28 }}>Our Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {serviceLinks.map(s => (
                <li key={s} style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: 16 }}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 22, color: '#e31b5d', fontStyle: 'italic', marginBottom: 16 }}>Newsletter</h4>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: 15, marginBottom: 24, lineHeight: 1.7 }}>
              Join our newsletter to stay updated with latest beauty tips and clinical insights.
            </p>
            <div style={{ position: 'relative' }}>
              <input type="email" placeholder="Enter your email" style={{
                width: '100%', background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
                padding: '16px 120px 16px 20px', color: '#fff', fontSize: 14,
                outline: 'none', boxSizing: 'border-box',
              }} />
              <button style={{
                position: 'absolute', right: 8, top: 8, bottom: 8,
                background: '#e31b5d', color: '#fff', border: 'none', borderRadius: 10,
                padding: '0 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>Join</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: '28px 0', borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
          alignItems: 'center', gap: 16, flexWrap: 'wrap',
          color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.25em',
        }}>
          <p>© 2026 Wholesale Beauty Hub. All Rights Reserved.</p>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Privacy', 'Terms', 'Cookies'].map(l => (
              <Link key={l} href="#" style={{ textDecoration: 'underline', color: 'inherit', textDecorationColor: 'rgba(227,27,93,0.3)', textUnderlineOffset: 6 }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
