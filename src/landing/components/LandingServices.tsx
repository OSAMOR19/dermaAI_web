'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WBH_SITE = 'https://wholesalebeautyhub.co.uk';

const products = [
  { image: '/prodtctspic/advancedclinicalsvitaminc.jpg', badge: 'Best Seller', title: 'Advanced Clinicals Vitamin C', category: 'Serums & Treatment', price: '£18.50', link: `${WBH_SITE}/product-category/skin-care/serums-treatment/` },
  { image: '/prodtctspic/facecerum.webp', badge: 'New In', title: 'Professional Face Serum', category: 'Face Serum', price: '£22.00', link: `${WBH_SITE}/product-category/skin-care/serums-treatment/` },
  { image: '/prodtctspic/darkspotmoistutizer.jpg', badge: 'Popular', title: 'Dark Spot Moisturiser', category: 'Moisturizers & Cream', price: '£24.99', link: `${WBH_SITE}/product-category/skin-care/moisturizers/` },
  { image: '/prodtctspic/acwellcleansingtoner.jpeg', badge: 'Trending', title: 'Acwell Cleansing Toner', category: 'Face Toners', price: '£15.00', link: `${WBH_SITE}/product-category/skin-care/face-toners-mist-essence/` },
  { image: '/prodtctspic/anuaniacianmide.webp', badge: 'Staff Pick', title: 'Anua Niacinamide Serum', category: 'Serums & Treatment', price: '£19.99', link: `${WBH_SITE}/product-category/skin-care/serums-treatment/` },
  { image: '/prodtctspic/25pskyc cleanser.jpeg', badge: 'Sale', title: '25P Skyc Cleanser', category: 'Face Cleansers', price: '£12.50', link: `${WBH_SITE}/product-category/skin-care/face-cleansers-wash/` },
  { image: '/prodtctspic/antiaging.jpg', badge: 'New In', title: 'Anti-Ageing Cream', category: 'Anti-Ageing', price: '£28.00', link: `${WBH_SITE}/product-category/skin-care/` },
  { image: '/prodtctspic/aveenobabycare.jpeg', badge: 'Popular', title: 'Aveeno Baby Care', category: 'Baby Care', price: '£14.50', link: `${WBH_SITE}/product-category/bath-body-care/` },
  { image: '/prodtctspic/glowfacialtoner.jpg', badge: 'Best Seller', title: 'Glow Facial Toner', category: 'Face Toners', price: '£16.99', link: `${WBH_SITE}/product-category/skin-care/face-toners-mist-essence/` },
];

export default function LandingServices() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('.lp-product-card')?.clientWidth || 280;
    el.scrollBy({ left: dir === 'right' ? cardWidth + 20 : -(cardWidth + 20), behavior: 'smooth' });
  };

  return (
    <section className="lp-products-section">
      <div className="lp-products-header">
        <div className="lp-products-header-left">
          <span className="landing-section-mono">Shop The Range</span>
          <h2 className="landing-section-title">
            Curated for <em>your skin type</em>
          </h2>
          <p className="lp-products-subtitle">
            Premium beauty products matched to your AI skin analysis. Swipe to explore our professional-grade collection.
          </p>
        </div>
        <div className="lp-scroll-arrows">
          <button className={`lp-arrow-btn ${!canScrollLeft ? 'disabled' : ''}`} onClick={() => scroll('left')} aria-label="Scroll left">
            <ChevronLeft size={20} />
          </button>
          <button className={`lp-arrow-btn ${!canScrollRight ? 'disabled' : ''}`} onClick={() => scroll('right')} aria-label="Scroll right">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="lp-carousel-wrapper">
        {canScrollLeft && <div className="lp-fade lp-fade-left" />}
        {canScrollRight && <div className="lp-fade lp-fade-right" />}

        <div className="lp-carousel" ref={scrollRef}>
          {products.map((p, i) => (
            <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className="lp-product-card">
              <div className="lp-product-image">
                <Image src={p.image} alt={p.title} fill style={{ objectFit: 'cover' }} />
                <span className="lp-product-badge">{p.badge}</span>
                <div className="lp-product-overlay">
                  <span>View Product →</span>
                </div>
              </div>
              <div className="lp-product-info">
                <span className="lp-product-cat">{p.category}</span>
                <h3 className="lp-product-title">{p.title}</h3>
                <span className="lp-product-price">{p.price}</span>
              </div>
            </a>
          ))}

          {/* End CTA card */}
          <a href={WBH_SITE} target="_blank" rel="noopener noreferrer" className="lp-product-end-card">
            <div className="lp-end-inner">
              <span className="lp-end-count">200+</span>
              <span className="lp-end-text">More Products</span>
              <span className="lp-end-cta">View Full Catalogue →</span>
            </div>
          </a>
        </div>
      </div>

      <style>{`
        .lp-products-section {
          padding: 100px 0 80px;
          background: linear-gradient(180deg, #fefcfa 0%, #f8f3ee 100%);
          overflow: hidden;
        }
        .lp-products-header {
          max-width: 1200px; margin: 0 auto; padding: 0 40px;
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 48px;
        }
        .lp-products-header-left { max-width: 500px; }
        .lp-products-subtitle {
          font-size: 15px; color: #7a6a5a; margin-top: 14px;
          font-family: 'DM Sans', sans-serif; line-height: 1.6;
        }
        .lp-scroll-arrows { display: flex; gap: 8px; }
        .lp-arrow-btn {
          width: 48px; height: 48px; border-radius: 50%; border: 1.5px solid rgba(0,0,0,0.12);
          background: #fff; cursor: pointer; display: flex; align-items: center;
          justify-content: center; color: #1a1109; transition: all 0.25s;
        }
        .lp-arrow-btn:hover { border-color: #e84c88; color: #e84c88; background: rgba(232,76,136,0.04); }
        .lp-arrow-btn.disabled { opacity: 0.3; pointer-events: none; }

        .lp-carousel-wrapper { position: relative; }
        .lp-fade {
          position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; pointer-events: none;
        }
        .lp-fade-left { left: 0; background: linear-gradient(90deg, #faf5ef, transparent); }
        .lp-fade-right { right: 0; background: linear-gradient(270deg, #f8f3ee, transparent); }

        .lp-carousel {
          display: flex; gap: 20px; overflow-x: auto; scroll-snap-type: x mandatory;
          padding: 0 40px 20px; scrollbar-width: none; -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch; cursor: grab;
        }
        .lp-carousel::-webkit-scrollbar { display: none; }
        .lp-carousel:active { cursor: grabbing; }

        .lp-product-card {
          flex-shrink: 0; width: 260px; text-decoration: none; color: inherit;
          border-radius: 18px; overflow: hidden; background: #fff;
          border: 1px solid rgba(0,0,0,0.05); transition: all 0.4s ease;
          scroll-snap-align: start;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .lp-product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.1);
        }
        .lp-product-image {
          position: relative; aspect-ratio: 4/5; overflow: hidden;
        }
        .lp-product-image img { transition: transform 0.6s ease; }
        .lp-product-card:hover .lp-product-image img { transform: scale(1.08); }
        .lp-product-badge {
          position: absolute; top: 12px; left: 12px; z-index: 2;
          background: rgba(232,76,136,0.92); color: #fff; font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 13px;
          border-radius: 20px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          backdrop-filter: blur(6px);
        }
        .lp-product-overlay {
          position: absolute; inset: 0; background: rgba(26,17,9,0.35);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.35s; z-index: 1;
        }
        .lp-product-overlay span {
          color: #fff; font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 0.15em; text-transform: uppercase; padding: 10px 24px;
          border: 1px solid rgba(255,255,255,0.5); border-radius: 50px;
          backdrop-filter: blur(4px);
        }
        .lp-product-card:hover .lp-product-overlay { opacity: 1; }
        .lp-product-info { padding: 18px 18px 20px; }
        .lp-product-cat {
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase; color: #b0a090; display: block; margin-bottom: 6px;
        }
        .lp-product-title {
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          color: #1a1109; margin-bottom: 10px; line-height: 1.3;
        }
        .lp-product-price {
          font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px;
          font-weight: 600; color: #e84c88;
        }

        /* End CTA card */
        .lp-product-end-card {
          flex-shrink: 0; width: 260px; border-radius: 18px; overflow: hidden;
          background: linear-gradient(135deg, #1a1109 0%, #2a1a12 100%);
          text-decoration: none; display: flex; align-items: center; justify-content: center;
          scroll-snap-align: start; transition: transform 0.3s;
          min-height: 380px;
        }
        .lp-product-end-card:hover { transform: translateY(-6px); }
        .lp-end-inner { text-align: center; padding: 40px 24px; }
        .lp-end-count {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 56px; font-weight: 300; color: #e84c88; display: block;
          line-height: 1; margin-bottom: 8px;
        }
        .lp-end-text {
          font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 600;
          color: rgba(255,255,255,0.7); display: block; margin-bottom: 28px;
        }
        .lp-end-cta {
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.12em;
          color: #e84c88; text-transform: uppercase; padding: 12px 24px;
          border: 1px solid rgba(232,76,136,0.3); border-radius: 50px;
          transition: all 0.3s;
        }
        .lp-product-end-card:hover .lp-end-cta {
          background: rgba(232,76,136,0.12); border-color: rgba(232,76,136,0.5);
        }

        @media (max-width: 768px) {
          .lp-products-section { padding: 60px 0 48px !important; }
          .lp-products-header { flex-direction: column; align-items: flex-start; gap: 20px; padding: 0 20px; }
          .lp-carousel { padding: 0 20px 16px; gap: 14px; }
          .lp-product-card { width: 220px; }
          .lp-product-end-card { width: 220px; min-height: 320px; }
          .lp-fade { width: 40px; }
          .lp-scroll-arrows { display: none; }
        }
      `}</style>
    </section>
  );
}
