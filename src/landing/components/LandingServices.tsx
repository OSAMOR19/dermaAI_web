import { ArrowUpRight, Zap, Target, Droplets } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    title: 'Scar Revision',
    icon: <Zap size={32} strokeWidth={1.5} />,
    desc: 'Advanced laser treatments and clinical procedures to minimize scar appearance and restore skin texture smooth for all skin types.',
  },
  {
    title: 'Wrinkle Reduction',
    icon: <Target size={32} strokeWidth={1.5} />,
    desc: 'Personalized anti-aging solutions using state-of-the-art diagnostic tools to ensure the most effective rejuvenated results.',
  },
  {
    title: 'Chemical Peels',
    icon: <Droplets size={32} strokeWidth={1.5} />,
    desc: 'Medical-grade exfoliation treatments designed to resurface skin and target deep pigmentation or uneven texture.',
  },
];

export default function LandingServices() {
  return (
    <section id="services" style={{ padding: '80px 0', background: '#fff', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', textAlign: 'center' }}>
        <div style={{ marginBottom: 60 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(227,27,93,0.08)', color: '#e31b5d',
            borderRadius: 50, padding: '6px 16px', fontSize: 11, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20,
          }}>Our Expertise</div>

          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 60px)', fontFamily: 'Georgia,serif',
            fontWeight: 700, color: '#2d1a12', lineHeight: 1.2, marginBottom: 20,
          }}>
            Comprehensive dermatology services{' '}
            <span style={{ color: '#e31b5d', fontStyle: 'italic' }}>for every skin need</span>
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(45,26,18,0.6)', maxWidth: 720, margin: '0 auto', lineHeight: 1.7, fontWeight: 500 }}>
            From medical diagnostics to aesthetic enhancement, our specialized treatments are designed to empower your skin's natural brilliance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28, textAlign: 'left' }}>
          {services.map((s, i) => (
            <Link href="https://wholesalebeautyhub.co.uk/contact/" key={i} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', padding: '44px 40px', borderRadius: 40,
                boxShadow: '0 20px 60px rgba(45,26,18,0.06)',
                border: '1px solid rgba(227,27,93,0.06)',
                display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer', height: '100%',
              }} className="service-card-hover">
                <div style={{
                  fontSize: 32, marginBottom: 28, width: 64, height: 64,
                  background: '#f8f6f5', borderRadius: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{s.icon}</div>
                <h3 style={{ fontSize: 26, fontFamily: 'Georgia,serif', fontWeight: 700, color: '#2d1a12', marginBottom: 14 }}>{s.title}</h3>
                <p style={{ fontSize: 16, color: 'rgba(45,26,18,0.6)', lineHeight: 1.7, marginBottom: 32, flex: 1 }}>{s.desc}</p>
                <div style={{ borderTop: '1px solid rgba(227,27,93,0.08)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(227,27,93,0.4)' }}>Learn More</span>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(227,27,93,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e31b5d',
                  }}>
                    <ArrowUpRight size={18} />
                  </div>
                </div>
                <div style={{ position: 'absolute', top: -32, right: -32, width: 100, height: 100, background: 'rgba(227,27,93,0.04)', borderRadius: '50%' }} />
              </div>
            </Link>
          ))}
        </div>

        <style>{`
          .service-card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 30px 80px rgba(227,27,93,0.15) !important;
          }
        `}</style>
      </div>
    </section>
  );
}
