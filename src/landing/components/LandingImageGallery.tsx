'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

const WBH_SITE = 'https://wholesalebeautyhub.co.uk';

const testimonials = [
  {
    name: 'Sophie M.',
    role: 'Beauty Professional, London',
    quote: 'The AI scan told me things about my skin that three dermatologists missed. Absolutely incredible technology.',
    stars: 5,
    avatar: '/avatar-1.png',
  },
  {
    name: 'Amara O.',
    role: 'Skincare Enthusiast, Manchester',
    quote: "I was sceptical at first but the product recommendations matched my skin perfectly. My glow-up is real!",
    stars: 5,
    avatar: '/avatar-2.png',
  },
  {
    name: 'Claire R.',
    role: 'Wholesale Partner, Birmingham',
    quote: 'As a salon owner, the wholesale platform is a game-changer. Premium products, incredible prices, next-day delivery.',
    stars: 5,
    avatar: '/avatar-3.png',
  },
];

export default function LandingImageGallery() {
  return (
    <section className="landing-testimonials-section">
      <div className="landing-testimonials-inner">
        {/* Testimonials */}
        <div className="landing-testimonials-header">
          <span className="landing-section-mono">Trusted Nationwide</span>
          <h2 className="landing-section-title">
            What our <em>clients</em> say
          </h2>
        </div>

        <div className="landing-testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="landing-testimonial-card">
              <div className="landing-testimonial-stars">
                {Array(t.stars).fill(0).map((_, j) => (
                  <Star key={j} size={14} fill="#e84c88" color="#e84c88" />
                ))}
              </div>
              <p className="landing-testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <div className="landing-testimonial-author">
                <div className="landing-testimonial-avatar">
                  <Image src={t.avatar} alt={t.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <strong className="landing-testimonial-name">{t.name}</strong>
                  <span className="landing-testimonial-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wholesale CTA */}
        <div className="landing-wholesale-cta">
          <div className="landing-wholesale-bg" />
          <div className="landing-wholesale-content">
            <span className="landing-wholesale-mono">For Beauty Professionals</span>
            <h2 className="landing-wholesale-title">
              Join the WBH<br /><em>Wholesale Programme</em>
            </h2>
            <p className="landing-wholesale-desc">
              Access exclusive wholesale pricing, priority stock, and dedicated account management. 
              Trusted by salons and beauty professionals across the UK &amp; worldwide.
            </p>
            <div className="landing-wholesale-actions">
              <a href={`${WBH_SITE}/contact/`} target="_blank" rel="noopener noreferrer" className="landing-btn-primary">
                Apply for Wholesale
              </a>
              <a href={WBH_SITE} target="_blank" rel="noopener noreferrer" className="landing-btn-glass">
                Browse Full Catalogue
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .landing-testimonials-section {
          padding: 100px 0 0; background: #f8f4f0;
        }
        .landing-testimonials-inner { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
        .landing-testimonials-header { text-align: center; margin-bottom: 56px; }

        .landing-testimonials-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
          margin-bottom: 100px;
        }
        .landing-testimonial-card {
          background: #fff; border: 1px solid rgba(0,0,0,0.04);
          border-radius: 20px; padding: 36px 32px;
          transition: all 0.35s ease;
        }
        .landing-testimonial-card:hover {
          transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.06);
        }
        .landing-testimonial-stars { display: flex; gap: 3px; margin-bottom: 16px; }
        .landing-testimonial-quote {
          font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18px;
          font-style: italic; line-height: 1.6; color: #3a2a1a; margin-bottom: 24px;
        }
        .landing-testimonial-author { display: flex; align-items: center; gap: 14px; }
        .landing-testimonial-avatar {
          width: 44px; height: 44px; border-radius: 50%; overflow: hidden;
          position: relative; background: #f0ddd4; flex-shrink: 0;
        }
        .landing-testimonial-name {
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          color: #1a1109; display: block;
        }
        .landing-testimonial-role {
          font-family: 'DM Mono', monospace; font-size: 11px; color: #b0a090;
          letter-spacing: 0.06em;
        }

        /* ── Wholesale CTA ── */
        .landing-wholesale-cta {
          background: linear-gradient(135deg, #1a1109 0%, #2a1a12 100%);
          border-radius: 28px; padding: 80px 60px; position: relative; overflow: hidden;
          margin-bottom: -60px;
        }
        .landing-wholesale-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 50% 60% at 80% 30%, rgba(232,76,136,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 50% at 10% 70%, rgba(232,76,136,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .landing-wholesale-content { position: relative; z-index: 2; max-width: 540px; }
        .landing-wholesale-mono {
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.25em;
          color: #e84c88; text-transform: uppercase; margin-bottom: 14px; display: block;
        }
        .landing-wholesale-title {
          font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 300; line-height: 1.15; color: #fff; margin-bottom: 20px;
        }
        .landing-wholesale-title em { font-style: italic; color: #e84c88; }
        .landing-wholesale-desc {
          font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif; margin-bottom: 36px;
        }
        .landing-wholesale-actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .landing-btn-glass {
          display: inline-block; padding: 15px 32px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50px; color: rgba(255,255,255,0.8); text-decoration: none;
          font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
          font-weight: 500; font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease; backdrop-filter: blur(6px);
        }
        .landing-btn-glass:hover {
          background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.22);
        }

        @media (max-width: 768px) {
          .landing-testimonials-grid { grid-template-columns: 1fr !important; }
          .landing-wholesale-cta { padding: 48px 28px !important; border-radius: 20px !important; }
          .landing-testimonials-inner { padding: 0 20px; }
          .landing-testimonials-section { padding: 60px 0 0 !important; }
        }
      `}</style>
    </section>
  );
}
