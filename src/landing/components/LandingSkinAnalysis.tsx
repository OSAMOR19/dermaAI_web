'use client';

import Link from 'next/link';
import { Droplets, Sun, Sparkles, Zap, Scissors, HeartPulse } from 'lucide-react';

const WBH_SITE = 'https://wholesalebeautyhub.co.uk';

const services = [
  {
    icon: <Droplets size={22} />,
    title: 'Hydration Therapy',
    desc: 'Deep moisture infusion treatments using clinical-grade serums for dry, dehydrated skin.',
    link: `${WBH_SITE}/product-category/skin-care/moisturizers/`,
  },
  {
    icon: <Sun size={22} />,
    title: 'Pigmentation Treatment',
    desc: 'Advanced dark spot correction and even skin tone restoration using professional peels and serums.',
    link: `${WBH_SITE}/product-category/skin-care/serums-treatment/`,
  },
  {
    icon: <Sparkles size={22} />,
    title: 'Anti-Ageing Solutions',
    desc: 'Clinically proven treatments targeting fine lines, wrinkles and loss of elasticity.',
    link: `${WBH_SITE}/product-category/skin-care/`,
  },
  {
    icon: <Zap size={22} />,
    title: 'Acne & Blemish Control',
    desc: 'Targeted acne protocols combining deep cleansing, exfoliation and medicated treatments.',
    link: `${WBH_SITE}/product-category/skin-care/face-cleansers-wash/`,
  },
  {
    icon: <Scissors size={22} />,
    title: 'Skin Resurfacing',
    desc: 'Professional exfoliators, peels and scrubs for smoother, brighter skin texture.',
    link: `${WBH_SITE}/product-category/skin-care/exfoliators-peels-scrubs/`,
  },
  {
    icon: <HeartPulse size={22} />,
    title: 'Complete Skin Analysis',
    desc: 'AI-powered scan + expert review to create your personalised skincare protocol.',
    link: '/scan',
    internal: true,
  },
];

export default function LandingSkinAnalysis() {
  return (
    <section className="landing-services-section">
      <div className="landing-services-inner">
        <div className="landing-services-header">
          <span className="landing-section-mono">Clinical Services</span>
          <h2 className="landing-section-title">
            Expert treatments,<br /><em>powered by AI</em>
          </h2>
          <p className="landing-services-subtitle">
            Our specialists use AI-guided diagnosis to recommend the perfect professional treatment for your skin.
          </p>
        </div>

        <div className="landing-services-grid">
          {services.map((s, i) => (
            <a
              key={i}
              href={s.internal ? undefined : s.link}
              {...(!s.internal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="landing-service-card"
            >
              {s.internal ? (
                <Link href={s.link} className="landing-service-card-link">
                  <div className="landing-service-icon">{s.icon}</div>
                  <h3 className="landing-service-title">{s.title}</h3>
                  <p className="landing-service-desc">{s.desc}</p>
                  <span className="landing-service-cta">Learn more →</span>
                </Link>
              ) : (
                <>
                  <div className="landing-service-icon">{s.icon}</div>
                  <h3 className="landing-service-title">{s.title}</h3>
                  <p className="landing-service-desc">{s.desc}</p>
                  <span className="landing-service-cta">Shop products →</span>
                </>
              )}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .landing-services-section {
          padding: 100px 0;
          background: linear-gradient(180deg, #1a1109 0%, #251a11 100%);
          color: #fff; position: relative;
        }
        .landing-services-inner { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
        .landing-services-header { text-align: center; margin-bottom: 64px; }
        .landing-services-section .landing-section-mono {
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.25em;
          color: #e84c88; text-transform: uppercase; margin-bottom: 14px; display: block;
        }
        .landing-services-section .landing-section-title {
          font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(32px, 4vw, 52px);
          font-weight: 300; line-height: 1.15; color: #fff;
        }
        .landing-services-section .landing-section-title em { font-style: italic; color: #e84c88; }
        .landing-services-subtitle {
          font-size: 15px; color: rgba(255,255,255,0.5); max-width: 500px; margin: 16px auto 0;
          font-family: 'DM Sans', sans-serif; line-height: 1.6;
        }

        .landing-services-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
        }
        .landing-service-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 40px 32px;
          transition: all 0.4s ease; cursor: pointer; text-decoration: none; color: inherit;
          display: flex; flex-direction: column;
        }
        .landing-service-card-link {
          text-decoration: none; color: inherit; display: flex; flex-direction: column; flex: 1;
        }
        .landing-service-card:hover {
          background: rgba(232,76,136,0.06);
          border-color: rgba(232,76,136,0.15);
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.3);
        }
        .landing-service-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(232,76,136,0.1); color: #e84c88;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px; transition: background 0.3s;
        }
        .landing-service-card:hover .landing-service-icon { background: rgba(232,76,136,0.2); }
        .landing-service-title {
          font-family: 'DM Sans', sans-serif; font-size: 17px; font-weight: 700;
          color: #fff; margin-bottom: 10px;
        }
        .landing-service-desc {
          font-size: 13.5px; line-height: 1.65; color: rgba(255,255,255,0.45);
          font-family: 'DM Sans', sans-serif; margin-bottom: 20px; flex: 1;
        }
        .landing-service-cta {
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.1em;
          color: #e84c88; text-transform: uppercase; margin-top: auto;
          transition: color 0.25s;
        }
        .landing-service-card:hover .landing-service-cta { color: #ff6da8; }

        @media (max-width: 768px) {
          .landing-services-grid { grid-template-columns: 1fr !important; }
          .landing-services-section { padding: 60px 0 !important; }
          .landing-services-inner { padding: 0 20px; }
        }
      `}</style>
    </section>
  );
}
