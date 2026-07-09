'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Shield } from 'lucide-react';

const WBH_SITE = 'https://wholesalebeautyhub.co.uk';

export default function LandingHero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-bg" />

      {/* Left Text Content */}
      <div className="landing-hero-left">
        {/* <div className="landing-hero-badge stagger-1">
          <span className="landing-badge-dot" />
          <span className="landing-badge-text">AI Skin Analysis — Now Live</span>
        </div> */}

        <h1 className="landing-hero-headline stagger-2">
          Your skin,<br />
          <em>decoded</em> by<br />
          <strong>Aesthetic AI.</strong>
        </h1>

        <p className="landing-hero-sub stagger-3">
          Scan your face in 60 seconds. Get a  diagnosis of 14+ skin concerns. 
          Shop professional-grade products matched precisely to your skin — with 
          next-day UK delivery &amp; worldwide shipping.
        </p>

        <div className="landing-hero-actions stagger-4">
          <Link href="/scan" className="landing-btn-primary">
            Start Free Skin Scan
          </Link>
          <a href={WBH_SITE} target="_blank" rel="noopener noreferrer" className="landing-btn-secondary">
            Shop Products
          </a>
        </div>

        <div className="landing-hero-trust stagger-5">
          <div className="landing-trust-avatars">
            {[1,2,3,4].map(i => (
              <div key={i} className="landing-trust-avatar" style={{ marginLeft: i === 1 ? 0 : -10, zIndex: 5 - i }}>
                <Image src={`/avatar-${i}.png`} alt={`Client ${i}`} fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <div className="landing-trust-info">
            <span className="landing-trust-stars">★★★★★</span>
            <strong>10,000+ clients</strong>
            <span className="landing-trust-sub">trust WBH Skin</span>
          </div>
        </div>
      </div>

      {/* Right — AI Scanner Widget */}
      <div className="landing-hero-right">
        <div className="landing-scanner-card">
          <div className="landing-scanner-label">AI Scanner Active</div>

          <div className="landing-scanner-face">
            <div className="landing-face-circle" />
            <div className="landing-scan-corner tl" />
            <div className="landing-scan-corner tr" />
            <div className="landing-scan-corner bl" />
            <div className="landing-scan-corner br" />
            <div className="landing-face-portrait">
              <Image src="/face.jpg" alt="Skin scan" fill style={{ objectFit: 'cover', opacity: 0.85 }} />
              <div className="landing-scan-line" />
            </div>

            <div className="landing-metric-tag hydration">
              <span className="landing-metric-dot" />
              Hydration 72%
            </div>
            <div className="landing-metric-tag pores">
              <span className="landing-metric-dot" />
              Pores: Mild
            </div>
            <div className="landing-metric-tag texture">
              <span className="landing-metric-dot" />
              Texture: Even
            </div>
          </div>

          <h2 className="landing-scanner-title">Instant Skin Analysis</h2>
          <p className="landing-scanner-sub">14+ skin concerns analysed in seconds. Privacy-first. Professional accuracy.</p>

          <div className="landing-scanner-concerns">
            {['Hydration', 'Pores', 'Fine Lines', 'Pigmentation', 'Elasticity', 'Texture', '+8 more'].map(c => (
              <span key={c} className="landing-concern-chip">{c}</span>
            ))}
          </div>

          <div className="landing-scanner-cta">
            <Link href="/scan" className="landing-btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: 11, padding: '14px 20px', borderRadius: 50 }}>
              Start Scan — Free
            </Link>
          </div>

          <p className="landing-scanner-privacy">
            <Shield size={13} />
            Facial data is encoded and never stored
          </p>
        </div>
      </div>

      <style>{`
        .landing-hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding-top: 88px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(165deg, #fefcfa 0%, #fdf6f0 40%, #faf0ea 100%);
        }
        .landing-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 70% 50%, rgba(232,76,136,0.05) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 20% 80%, rgba(120,60,80,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .landing-hero-left {
          display: flex; flex-direction: column; justify-content: center;
          padding: 80px 48px 80px 72px;
          position: relative; z-index: 2;
        }
        .landing-hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 32px;
          animation: landingFadeUp 0.6s ease both;
        }
        .landing-badge-dot {
          width: 7px; height: 7px; background: #e84c88; border-radius: 50%;
          animation: landingPulse 2s ease infinite;
        }
        .landing-badge-text {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.18em; color: #e84c88; text-transform: uppercase; font-weight: 400;
        }
        .landing-hero-headline {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: clamp(42px, 5.5vw, 78px); font-weight: 300;
          line-height: 1.08; letter-spacing: -0.01em; color: #1a1109;
          margin-bottom: 28px;
          animation: landingFadeUp 0.7s 0.1s ease both;
        }
        .landing-hero-headline em { font-style: italic; color: #e84c88; }
        .landing-hero-headline strong { font-weight: 600; display: block; }
        .landing-hero-sub {
          font-size: 16px; line-height: 1.75; color: #6a5a4a; max-width: 420px;
          margin-bottom: 40px;
          animation: landingFadeUp 0.7s 0.2s ease both;
          font-family: 'DM Sans', sans-serif;
        }
        .landing-hero-actions {
          display: flex; gap: 14px; align-items: center; margin-bottom: 56px;
          animation: landingFadeUp 0.7s 0.3s ease both;
        }
        .landing-btn-primary {
          background: linear-gradient(135deg, #e84c88 0%, #d63a74 100%);
          color: #fff; padding: 16px 36px;
          font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase;
          text-decoration: none; font-weight: 600; border-radius: 50px;
          transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Sans', sans-serif; border: none; cursor: pointer;
          box-shadow: 0 6px 24px rgba(232,76,136,0.25);
        }
        .landing-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(232,76,136,0.35);
        }
        .landing-btn-secondary {
          background: transparent; color: #1a1109; padding: 15px 32px;
          font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
          text-decoration: none; font-weight: 500; border: 1.5px solid rgba(26,17,9,0.18);
          border-radius: 50px; transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
        }
        .landing-btn-secondary:hover { border-color: #e84c88; color: #e84c88; }

        .landing-hero-trust {
          display: flex; align-items: center; gap: 20px;
          animation: landingFadeUp 0.7s 0.4s ease both;
        }
        .landing-trust-avatars { display: flex; }
        .landing-trust-avatar {
          width: 36px; height: 36px; border-radius: 50%; border: 2.5px solid #fefcfa;
          overflow: hidden; position: relative; background: #f0ddd4;
        }
        .landing-trust-info strong { display: block; font-size: 15px; font-weight: 700; color: #1a1109; }
        .landing-trust-sub { font-size: 12px; color: #9a8a7a; }
        .landing-trust-stars { color: #e84c88; font-size: 13px; letter-spacing: 2px; display: block; }

        /* ─── HERO RIGHT — SCANNER ─── */
        .landing-hero-right {
          display: flex; flex-direction: column; justify-content: center; align-items: center;
          padding: 80px 72px 80px 40px;
          position: relative; z-index: 2;
        }
        .landing-scanner-card {
          background: #fff; border-radius: 24px; padding: 36px 32px;
          width: 100%; max-width: 380px;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08);
          position: relative;
          animation: landingFadeUp 0.9s 0.2s ease both;
        }
        .landing-scanner-label {
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.25em;
          color: #e84c88; text-transform: uppercase; margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .landing-scanner-label::before {
          content: ''; width: 16px; height: 2px; background: #e84c88; display: inline-block; border-radius: 1px;
        }
        .landing-scanner-face {
          width: 100%; aspect-ratio: 1; max-width: 220px; margin: 0 auto 24px;
          position: relative; display: flex; align-items: center; justify-content: center;
        }
        .landing-face-circle {
          width: 170px; height: 200px; border: 1.5px dashed rgba(232,76,136,0.3);
          border-radius: 50%; position: absolute;
          animation: landingRotate 14s linear infinite;
        }
        .landing-face-portrait {
          width: 130px; height: 156px; border-radius: 50% 50% 45% 45%;
          position: relative; overflow: hidden;
        }
        .landing-scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #e84c88, transparent);
          box-shadow: 0 0 10px rgba(232,76,136,0.5); top: 0; z-index: 5;
          animation: landingScanMove 2.8s ease-in-out infinite;
        }
        .landing-scan-corner {
          position: absolute; width: 18px; height: 18px;
          border-color: #e84c88; border-style: solid; border-width: 0;
        }
        .landing-scan-corner.tl { top: 12px; left: 12px; border-top-width: 2px; border-left-width: 2px; }
        .landing-scan-corner.tr { top: 12px; right: 12px; border-top-width: 2px; border-right-width: 2px; }
        .landing-scan-corner.bl { bottom: 12px; left: 12px; border-bottom-width: 2px; border-left-width: 2px; }
        .landing-scan-corner.br { bottom: 12px; right: 12px; border-bottom-width: 2px; border-right-width: 2px; }

        .landing-metric-tag {
          position: absolute; background: rgba(30,20,14,0.88); color: #fff;
          padding: 6px 12px; border-radius: 8px; font-family: 'DM Mono', monospace;
          font-size: 10px; white-space: nowrap; display: flex; align-items: center; gap: 6px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2); backdrop-filter: blur(8px);
          animation: landingFloatTag 3s ease-in-out infinite;
        }
        .landing-metric-tag.hydration { top: 16px; right: -50px; animation-delay: 0s; }
        .landing-metric-tag.pores { bottom: 36px; right: -60px; animation-delay: 0.8s; }
        .landing-metric-tag.texture { top: 50%; left: -70px; transform: translateY(-50%); animation-delay: 1.6s; animation-name: landingFloatTagCenter; }
        .landing-metric-dot { width: 6px; height: 6px; border-radius: 50%; background: #e84c88; }

        .landing-scanner-title {
          font-family: 'Cormorant Garamond', Georgia, serif; font-size: 21px;
          font-weight: 400; color: #1a1109; margin-bottom: 6px; text-align: center;
        }
        .landing-scanner-sub { font-size: 13px; color: #9a8a7a; text-align: center; margin-bottom: 24px; font-family: 'DM Sans', sans-serif; }
        .landing-scanner-concerns {
          display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 24px; justify-content: center;
        }
        .landing-concern-chip {
          font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; color: #7a5a6a;
          background: rgba(232,76,136,0.06); padding: 5px 11px; border-radius: 20px; font-weight: 500;
        }
        .landing-scanner-cta { display: flex; }
        .landing-scanner-privacy {
          margin-top: 14px; display: flex; align-items: center; justify-content: center;
          gap: 5px; font-size: 11px; color: #b0a090;
        }
        .landing-scanner-privacy svg { color: #9a8a7a; }

        @keyframes landingFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes landingPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.6); } }
        @keyframes landingRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes landingScanMove { 0% { top: 10%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 90%; opacity: 0; } }
        @keyframes landingFloatTag { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes landingFloatTagCenter { 0%, 100% { transform: translateY(-50%) translateX(0); } 50% { transform: translateY(-50%) translateX(-4px); } }

        .stagger-1 { animation-delay: 0.1s; } .stagger-2 { animation-delay: 0.15s; }
        .stagger-3 { animation-delay: 0.2s; } .stagger-4 { animation-delay: 0.3s; } .stagger-5 { animation-delay: 0.4s; }

        @media (max-width: 960px) {
          .landing-hero {
            grid-template-columns: 1fr !important; min-height: auto !important;
            padding-top: 80px !important;
          }
          .landing-hero-left {
            padding: 32px 24px 24px !important; text-align: center;
            align-items: center;
          }
          .landing-hero-headline { font-size: 38px !important; }
          .landing-hero-sub {
            max-width: 100% !important; font-size: 15px !important;
            margin-bottom: 28px !important;
          }
          .landing-hero-actions {
            flex-direction: row; flex-wrap: wrap; justify-content: center;
            margin-bottom: 32px !important;
          }
          .landing-hero-trust { justify-content: center; }
          .landing-hero-right {
            padding: 0 24px 48px !important;
          }
          .landing-scanner-card {
            max-width: 360px; margin: 0 auto;
            padding: 28px 24px !important;
          }
          .landing-scanner-face { max-width: 180px !important; }
          .landing-metric-tag.hydration { right: -10px !important; }
          .landing-metric-tag.pores { right: -14px !important; }
          .landing-metric-tag.texture { left: -14px !important; }
        }

        @media (max-width: 560px) {
          .landing-hero { padding-top: 72px !important; }
          .landing-hero-left { padding: 24px 20px 16px !important; }
          .landing-hero-headline { font-size: 32px !important; line-height: 1.1 !important; }
          .landing-hero-sub { font-size: 14px !important; margin-bottom: 24px !important; }
          .landing-hero-actions {
            flex-direction: column; gap: 10px !important; width: 100%;
          }
          .landing-btn-primary, .landing-btn-secondary {
            width: 100% !important; text-align: center !important;
            justify-content: center !important;
            padding: 15px 24px !important; font-size: 12px !important;
          }
          .landing-hero-right { padding: 0 16px 40px !important; }
          .landing-scanner-card { max-width: 100% !important; }
          .landing-metric-tag { display: none !important; }
          .landing-scanner-face { max-width: 160px !important; }
          .landing-face-circle { width: 140px !important; height: 170px !important; }
          .landing-face-portrait { width: 110px !important; height: 132px !important; }
          .landing-scanner-title { font-size: 18px !important; }
          .landing-scanner-sub { font-size: 12px !important; }
          .landing-concern-chip { font-size: 9px !important; padding: 4px 9px !important; }
        }
      `}</style>
    </section>
  );
}
