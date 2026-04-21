'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Star, LogIn } from 'lucide-react';

const REVIEWS = [
  { title: "Clinical Excellence", text: "The AI diagnosis spotted exactly what my skin needed. Absolutely flawless." },
  { title: "Perfect Accuracy", text: "I've never seen such detail. The treatment plan worked in just 2 weeks." },
  { title: "Transformed Skin", text: "Wholesale Beauty Hub gave me back my confidence with expert care." }
];

export default function LandingHero() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIdx(prev => (prev + 1) % REVIEWS.length);
        setFade(true);
      }, 400); // Wait for fade out
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section style={{
      position: 'relative', paddingTop: 160, paddingBottom: 100,
      background: '#faf8f7', overflow: 'hidden', minHeight: '95vh',
      display: 'flex', alignItems: 'center'
    }}>
      {/* Dynamic Background Elements */}
      <div className="hero-orb orb-1" />
      <div className="hero-orb orb-2" />
      
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 5%', position: 'relative', zIndex: 10, width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8%', flexWrap: 'wrap' }}>
          
          {/* Left Text Content */}
          <div style={{ flex: '1 1 500px', textAlign: 'left', position: 'relative' }} className="hero-content">
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#fff', color: '#e31b5d',
              borderRadius: 50, padding: '8px 20px', fontSize: 13, fontWeight: 800,
              letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 28,
              boxShadow: '0 8px 20px rgba(227,27,93,0.1)', border: '1px solid rgba(227,27,93,0.1)',
            }} className="stagger-1">
              <span className="pulse-dot" />
              Next-Gen Medical Beauty
            </div>

            <h1 style={{
              fontSize: 'clamp(42px, 6vw, 84px)', fontFamily: 'Georgia,serif', fontWeight: 700,
              color: '#2d1a12', lineHeight: 1.05, marginBottom: 28, letterSpacing: '-0.02em',
            }} className="stagger-2">
              The pinnacle of <br />
              <span className="gradient-text gradient-glow" style={{ fontStyle: 'italic' }}>clinical skin</span> perfection.
            </h1>

            <p style={{
              fontSize: 'clamp(17px, 2vw, 21px)', color: 'rgba(45,26,18,0.65)',
              maxWidth: 580, marginBottom: 48, lineHeight: 1.7, fontWeight: 500,
            }} className="stagger-3">
              Transform your skin at Wholesale Beauty Hub. Our proprietary AI diagnosis and clinical expertise reveal your natural, flawless brilliance faster than ever before.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 56 }} className="stagger-4">
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: '#e31b5d', color: '#fff', border: 'none',
                  borderRadius: 50, padding: '18px 44px', fontSize: 17, fontWeight: 800,
                  cursor: 'pointer', boxShadow: '0 16px 40px rgba(227,27,93,0.3)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }} className="btn-primary-tech">
                  Start Your Journey
                </button>
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }} className="stagger-5">
              <div style={{ display: 'flex' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    width: 52, height: 52, borderRadius: '50%',
                    border: '3px solid #fff', overflow: 'hidden',
                    position: 'relative', marginLeft: i === 1 ? 0 : -16,
                    background: '#f0ece9', boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}>
                    <Image src={`/avatar-${i}.png`} alt={`Patient ${i}`} fill style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#e31b5d', marginBottom: 6 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#e31b5d" />)}
                  <span style={{ color: '#2d1a12', fontWeight: 800, fontSize: 18, marginLeft: 8 }}>5.0 / 5</span>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(45,26,18,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Loved by 10k+ Patients</p>
              </div>
            </div>
          </div>

          {/* Right Image Composition */}
          <div style={{ flex: '1 1 400px', position: 'relative', marginTop: 'clamp(40px, 8vw, 0px)' }} className="hero-image-wrapper">
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '4/5',
              borderRadius: 48, overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(227,27,93,0.15)',
              border: '2px solid #fff',
            }}>
              <Image src="/pimple-lady.jpg" alt="Expert Skin Treatment" fill style={{ objectFit: 'cover' }} priority className="image-zoom" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(45,26,18,0.4), transparent)' }} />
            </div>

            {/* Glowing Tech Ring Behind */}
            <div className="tech-ring" />

            {/* Floating Review Badge */}
            <div style={{
              position: 'absolute', bottom: -30, left: -40,
              background: 'rgba(255,255,255,0.95)', padding: '24px 32px', borderRadius: 32,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.8)',
              maxWidth: 280, zIndex: 20,
            }} className="float-badge">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }} className="badge-header">
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #e31b5d, #ff4d85)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(227,27,93,0.3)' }} className="badge-icon-wrap">
                  <Star size={24} fill="#fff" color="#fff" className="badge-star-icon" />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#e31b5d', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }} className="badge-subtitle">Verified Result</p>
                  <p style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 18, color: '#2d1a12', transition: 'opacity 0.4s ease', opacity: fade ? 1 : 0 }} className="badge-title">
                    {REVIEWS[quoteIdx].title}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(45,26,18,0.65)', fontStyle: 'italic', lineHeight: 1.6, fontWeight: 500, transition: 'opacity 0.4s ease', opacity: fade ? 1 : 0 }} className="badge-text">
                "{REVIEWS[quoteIdx].text}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Orbs & Backgrounds */
        .hero-orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.5; animation: drift 20s infinite alternate cubic-bezier(0.4, 0, 0.2, 1); z-index: 0; }
        .orb-1 { width: 50vw; height: 50vw; background: rgba(227,27,93,0.15); top: -20vw; right: -10vw; animation-delay: 0s; }
        .orb-2 { width: 40vw; height: 40vw; background: rgba(255,182,193,0.3); bottom: -10vw; left: -10vw; animation-delay: -5s; }
        
        .pulse-dot { width: 8px; height: 8px; background: #e31b5d; border-radius: 50%; display: inline-block; animation: dotPulse 2s infinite ease-in-out; box-shadow: 0 0 10px rgba(227,27,93,0.6); }
        .gradient-text { background: linear-gradient(135deg, #e31b5d 0%, #ff4d85 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .gradient-glow { position: relative; }
        .gradient-glow::after { content: "clinical skin"; position: absolute; left: 0; top: 0; background: linear-gradient(135deg, #e31b5d 0%, #ff4d85 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: blur(16px); opacity: 0.4; z-index: -1; animation: glowPulse 3s infinite alternate; }
        
        .btn-primary-tech:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 24px 48px rgba(227,27,93,0.4) !important; }
        
        /* Entrance Animations */
        .hero-content > * { opacity: 0; animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .stagger-1 { animation-delay: 0.1s; } .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; } .stagger-4 { animation-delay: 0.4s; } .stagger-5 { animation-delay: 0.5s; }
        
        .hero-image-wrapper { opacity: 0; animation: fadeLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; }
        .image-zoom { animation: subtleZoom 20s infinite alternate ease-in-out; transform-origin: center; }
        .float-badge { animation: floating 6s ease-in-out infinite; }
        
        .tech-ring { position: absolute; inset: -30px; border: 1px dashed rgba(227,27,93,0.3); border-radius: 60px; animation: spinReverse 40s linear infinite; z-index: -1; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeLeft { from { opacity: 0; transform: translateX(50px) scale(0.95); } to { opacity: 1; transform: translateX(0) scale(1); } }
        @keyframes floating { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        @keyframes drift { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(-10%, 10%) scale(1.1); } }
        @keyframes dotPulse { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.5); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } }
        @keyframes glowPulse { 0% { opacity: 0.2; } 100% { opacity: 0.6; filter: blur(24px); } }
        @keyframes subtleZoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
        @keyframes spinReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }

        /* Responsive Fixes */
        @media (max-width: 768px) {
           .float-badge { 
             left: 20px !important; right: 20px !important; bottom: -20px !important; 
             padding: 16px 20px !important; border-radius: 20px !important; max-width: none !important;
           }
           .badge-header { gap: 12px !important; margin-bottom: 10px !important; }
           .badge-icon-wrap { width: 36px !important; height: 36px !important; border-radius: 12px !important; }
           .badge-star-icon { width: 18px !important; height: 18px !important; }
           .badge-subtitle { font-size: 10px !important; margin-bottom: 2px !important; }
           .badge-title { font-size: 15px !important; }
           .badge-text { font-size: 12px !important; line-height: 1.4 !important; }
           .tech-ring { display: none; }
        }
      `}</style>
    </section>
  );
}
