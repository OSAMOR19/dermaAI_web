'use client';

import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

const WBH_SITE = 'https://wholesalebeautyhub.co.uk';

const testimonials = [
  { name: 'Sophie M.', role: 'Beauty Professional, London', quote: 'The AI scan told me things about my skin that three dermatologists missed. Absolutely incredible technology.', stars: 5, avatar: '/avatar-1.png' },
  { name: 'Amara O.', role: 'Skincare Enthusiast, Manchester', quote: "I was sceptical at first but the product recommendations matched my skin perfectly. My glow-up is real!", stars: 5, avatar: '/avatar-2.png' },
  { name: 'Claire R.', role: 'Wholesale Partner, Birmingham', quote: 'As a salon owner, the wholesale platform is a game-changer. Premium products, incredible prices, next-day delivery.', stars: 5, avatar: '/avatar-3.png' },
  { name: 'Jessica T.', role: 'Content Creator, Leeds', quote: "I've recommended WBH to my entire audience. The quality is outstanding and their AI scan is seriously next level.", stars: 5, avatar: '/avatar-4.png' },
  { name: 'Fatima A.', role: 'Dermatology Student, Edinburgh', quote: "From a clinical perspective, the accuracy of their skin analysis is impressive. It identified texture issues I hadn't noticed.", stars: 5, avatar: '/avatar-1.png' },
  { name: 'Priya K.', role: 'Makeup Artist, Bristol', quote: "Their foundation range is the best I've found at wholesale prices. My clients love the quality and I love the margins.", stars: 5, avatar: '/avatar-2.png' },
  { name: 'Grace W.', role: 'Spa Owner, Liverpool', quote: 'We switched our entire spa product line to WBH. The transition was seamless and our customers noticed the upgrade immediately.', stars: 5, avatar: '/avatar-3.png' },
  { name: 'Hannah L.', role: 'Beauty Blogger, Glasgow', quote: 'The serums are absolutely divine. Hospital-grade ingredients at high-street prices — honestly can\'t believe it.', stars: 5, avatar: '/avatar-4.png' },
  { name: 'Olivia D.', role: 'Esthetician, Cardiff', quote: 'I use the AI scan results to create bespoke treatment plans. It saves me so much consultation time and my clients love it.', stars: 5, avatar: '/avatar-1.png' },
  { name: 'Chidera N.', role: 'Pharmacist, Nottingham', quote: 'Finally a brand that takes skincare science seriously. Their formulations are backed by real research and it shows in the results.', stars: 5, avatar: '/avatar-2.png' },
];

export default function LandingImageGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const checkActive = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 340;
    const idx = Math.round(el.scrollLeft / (cardWidth + 20));
    setActiveIdx(Math.min(idx, testimonials.length - 1));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkActive, { passive: true });
    return () => el.removeEventListener('scroll', checkActive);
  }, []);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 20;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 360, behavior: 'smooth' });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const scrollTo = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 360 : -360, behavior: 'smooth' });
  };

  return (
    <section className="lp-testimonials-section">
      <div className="lp-testimonials-inner">
        <div className="lp-testimonials-top">
          <div>
            <span className="landing-section-mono">Trusted Nationwide</span>
            <h2 className="landing-section-title">What our <em>clients</em> say</h2>
          </div>
          <div className="lp-test-arrows">
            <button className="lp-arrow-btn" onClick={() => scrollTo('left')} aria-label="Previous"><ChevronLeft size={20} /></button>
            <button className="lp-arrow-btn" onClick={() => scrollTo('right')} aria-label="Next"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="lp-test-carousel-wrap" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setTimeout(() => setIsPaused(false), 5000)}>
          <div className="lp-test-carousel" ref={scrollRef}>
            {testimonials.map((t, i) => (
              <div key={i} className="lp-test-card">
                <div className="lp-test-stars">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} size={14} fill="#e84c88" color="#e84c88" />
                  ))}
                </div>
                <p className="lp-test-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="lp-test-author">
                  <div className="lp-test-avatar">
                    <Image src={t.avatar} alt={t.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div>
                    <strong className="lp-test-name">{t.name}</strong>
                    <span className="lp-test-role">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="lp-test-dots">
          {testimonials.map((_, i) => (
            <span key={i} className={`lp-test-dot ${i === activeIdx ? 'active' : ''}`} />
          ))}
        </div>

        {/* Wholesale CTA */}
        <div className="lp-wholesale-cta">
          <div className="lp-wholesale-bg" />
          <div className="lp-wholesale-content">
            <span className="lp-wholesale-mono">For Beauty Professionals</span>
            <h2 className="lp-wholesale-title">
              Join the WBH<br /><em>Wholesale Programme</em>
            </h2>
            <p className="lp-wholesale-desc">
              Access exclusive wholesale pricing, priority stock, and dedicated account management.
              Trusted by salons and beauty professionals across the UK &amp; worldwide.
            </p>
            <div className="lp-wholesale-actions">
              <a href={`${WBH_SITE}/contact/`} target="_blank" rel="noopener noreferrer" className="landing-btn-primary">
                Apply for Wholesale
              </a>
              <a href={WBH_SITE} target="_blank" rel="noopener noreferrer" className="lp-btn-glass">
                Browse Full Catalogue
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .lp-testimonials-section { padding: 100px 0 0; background: #f8f4f0; overflow: hidden; }
        .lp-testimonials-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
        .lp-testimonials-top {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 48px;
        }
        .lp-test-arrows { display: flex; gap: 8px; }
        .lp-test-arrows .lp-arrow-btn {
          width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid rgba(0,0,0,0.12);
          background: #fff; cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: #1a1109; transition: all 0.25s;
        }
        .lp-test-arrows .lp-arrow-btn:hover { border-color: #e84c88; color: #e84c88; }

        .lp-test-carousel-wrap { position: relative; margin: 0 -40px; }
        .lp-test-carousel {
          display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory;
          padding: 0 40px 20px; scrollbar-width: none; -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        .lp-test-carousel::-webkit-scrollbar { display: none; }

        .lp-test-card {
          flex-shrink: 0; width: 340px; scroll-snap-align: start;
          background: #fff; border: 1px solid rgba(0,0,0,0.04);
          border-radius: 20px; padding: 32px 28px;
          transition: all 0.35s ease;
        }
        .lp-test-card:hover {
          transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,0.06);
        }
        .lp-test-stars { display: flex; gap: 3px; margin-bottom: 16px; }
        .lp-test-quote {
          font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px;
          font-style: italic; line-height: 1.6; color: #3a2a1a; margin-bottom: 24px;
          min-height: 80px;
        }
        .lp-test-author { display: flex; align-items: center; gap: 14px; }
        .lp-test-avatar {
          width: 44px; height: 44px; border-radius: 50%; overflow: hidden;
          position: relative; background: #f0ddd4; flex-shrink: 0;
        }
        .lp-test-name {
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700;
          color: #1a1109; display: block;
        }
        .lp-test-role {
          font-family: 'DM Mono', monospace; font-size: 11px; color: #b0a090;
          letter-spacing: 0.06em;
        }

        .lp-test-dots {
          display: flex; justify-content: center; gap: 6px; margin: 28px 0 80px;
        }
        .lp-test-dot {
          width: 6px; height: 6px; border-radius: 50%; background: rgba(0,0,0,0.12);
          transition: all 0.3s;
        }
        .lp-test-dot.active { width: 24px; border-radius: 3px; background: #e84c88; }

        /* ── Wholesale CTA ── */
        .lp-wholesale-cta {
          background: linear-gradient(135deg, #1a1109 0%, #2a1a12 100%);
          border-radius: 28px; padding: 80px 60px; position: relative; overflow: hidden;
          margin-bottom: -60px;
        }
        .lp-wholesale-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 50% 60% at 80% 30%, rgba(232,76,136,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 50% at 10% 70%, rgba(232,76,136,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .lp-wholesale-content { position: relative; z-index: 2; max-width: 540px; }
        .lp-wholesale-mono {
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.25em;
          color: #e84c88; text-transform: uppercase; margin-bottom: 14px; display: block;
        }
        .lp-wholesale-title {
          font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 300; line-height: 1.15; color: #fff; margin-bottom: 20px;
        }
        .lp-wholesale-title em { font-style: italic; color: #e84c88; }
        .lp-wholesale-desc {
          font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif; margin-bottom: 36px;
        }
        .lp-wholesale-actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .lp-btn-glass {
          display: inline-block; padding: 15px 32px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50px; color: rgba(255,255,255,0.8); text-decoration: none;
          font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase;
          font-weight: 500; font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease; backdrop-filter: blur(6px);
        }
        .lp-btn-glass:hover {
          background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.22);
        }

        @media (max-width: 768px) {
          .lp-testimonials-section { padding: 60px 0 0 !important; }
          .lp-testimonials-inner { padding: 0 20px; }
          .lp-testimonials-top { flex-direction: column; align-items: flex-start; gap: 16px; }
          .lp-test-arrows { display: none; }
          .lp-test-carousel-wrap { margin: 0 -20px; }
          .lp-test-carousel { padding: 0 20px 16px; gap: 14px; }
          .lp-test-card { width: 280px; }
          .lp-wholesale-cta { padding: 40px 24px !important; border-radius: 20px !important; }
          .lp-wholesale-actions { flex-direction: column; }
          .lp-wholesale-actions a { text-align: center; }
        }
      `}</style>
    </section>
  );
}
