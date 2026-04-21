import Image from 'next/image';
import { Check } from 'lucide-react';

const points = [
  'Global Standards in Skin Health',
  'Wholesale Distribution & Clinical Services',
  'Trusted by Professionals Nationwide',
];

export default function LandingWhyChooseUs() {
  return (
    <section id="about" style={{ padding: '80px 0', background: '#fff', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 80, flexWrap: 'wrap' }}>
          {/* Image side */}
          <div style={{ flex: 1, minWidth: 280, position: 'relative' }}>
            <div style={{ position: 'relative', aspectRatio: '1', borderRadius: 48, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.12)', border: '1px solid #e8e2e0' }}>
              <Image src="/professional-treatment.png" alt="Clinical Treatment" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(227,27,93,0.08)' }} />
            </div>
            <div style={{
              position: 'absolute', bottom: -24, right: -24,
              background: '#fff', padding: '20px 28px', borderRadius: 28,
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #e8e2e0',
              display: 'flex', alignItems: 'center', gap: 20, zIndex: 20,
            }}>
              <div style={{ width: 48, height: 48, background: 'rgba(227,27,93,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 14, height: 14, background: '#e31b5d', borderRadius: '50%' }} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(45,26,18,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Session</p>
                <p style={{ fontWeight: 700, color: '#2d1a12', fontSize: 15 }}>Booking Open</p>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div style={{ flex: 1, minWidth: 280, textAlign: 'left' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#f8f6f5', color: '#e31b5d', borderRadius: 50,
              padding: '8px 20px', fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.2em',
              border: '1px solid #e8e2e0', marginBottom: 28,
            }}>
              <div style={{ width: 8, height: 8, background: '#e31b5d', borderRadius: '50%' }} />
              About Wholesale Beauty Hub
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 64px)', fontFamily: 'Georgia,serif',
              fontWeight: 700, color: '#2d1a12', lineHeight: 1.1, marginBottom: 24,
            }}>
              Your premier destination for <span style={{ color: '#e31b5d', fontStyle: 'italic' }}>beauty</span> excellence
            </h2>

            <p style={{ fontSize: 18, color: 'rgba(45,26,18,0.7)', marginBottom: 36, lineHeight: 1.7, fontWeight: 500, maxWidth: 520 }}>
              At Wholesale Beauty Hub, we're dedicated to helping you achieve and maintain beautiful, healthy skin. Trust us to provide exceptional care tailored to you, using the latest clinical technologies.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
              {points.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, background: '#f8f6f5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e31b5d', flexShrink: 0,
                  }}>
                    <Check size={20} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: 20, fontFamily: 'Georgia,serif', fontWeight: 700, color: '#2d1a12' }}>{item}</span>
                </div>
              ))}
            </div>

            <button style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#e31b5d', color: '#fff', border: 'none',
              borderRadius: 50, padding: '16px 36px', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 12px 32px rgba(227,27,93,0.25)',
              transition: 'transform 0.3s',
            }} className="btn-hover-zoom">
              Read More
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .animate-section { opacity: 0; animation: sectionFadeUp 1s ease forwards; animation-delay: 0.2s; }
        .btn-hover-zoom:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(227,27,93,0.35) !important; }

        @keyframes sectionFadeUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
           .why-choose-us-container { gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
