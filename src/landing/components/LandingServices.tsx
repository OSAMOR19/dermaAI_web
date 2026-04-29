'use client';

import Image from 'next/image';

const WBH_SITE = 'https://wholesalebeautyhub.co.uk';

const products = [
  {
    image: '/skincare-routine.png',
    badge: 'Best Seller',
    title: 'Hydrating Serum Collection',
    category: 'Serums & Treatment',
    price: '£18.50',
    link: `${WBH_SITE}/product-category/skin-care/serums-treatment/`,
  },
  {
    image: '/beauty-products.png',
    badge: 'New In',
    title: 'Professional Makeup Kit',
    category: 'Makeup',
    price: '£32.00',
    link: `${WBH_SITE}/product-category/makeup/`,
  },
  {
    image: '/professional-treatment.png',
    badge: 'Popular',
    title: 'Clinical Moisturiser Set',
    category: 'Moisturizers & Cream',
    price: '£24.99',
    link: `${WBH_SITE}/product-category/skin-care/moisturizers/`,
  },
  {
    image: '/hero-image.png',
    badge: 'Trending',
    title: 'Bath & Body Essentials',
    category: 'Bath & Body Care',
    price: '£15.00',
    link: `${WBH_SITE}/product-category/bath-body-care/`,
  },
];

export default function LandingServices() {
  return (
    <section className="landing-products-section">
      <div className="landing-products-inner">
        <div className="landing-products-header">
          <span className="landing-section-mono">Shop The Range</span>
          <h2 className="landing-section-title">
            Curated for<br /><em>your skin type</em>
          </h2>
          <p className="landing-products-subtitle">
            Premium beauty products matched to your AI skin analysis. Professional-grade formulas from trusted brands.
          </p>
        </div>

        <div className="landing-products-grid">
          {products.map((p, i) => (
            <a
              key={i}
              href={p.link}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-product-card"
            >
              <div className="landing-product-image">
                <Image src={p.image} alt={p.title} fill style={{ objectFit: 'cover' }} />
                <span className="landing-product-badge">{p.badge}</span>
              </div>
              <div className="landing-product-info">
                <span className="landing-product-cat">{p.category}</span>
                <h3 className="landing-product-title">{p.title}</h3>
                <div className="landing-product-footer">
                  <span className="landing-product-price">{p.price}</span>
                  <span className="landing-product-view">View →</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="landing-products-cta-row">
          <a href={WBH_SITE} target="_blank" rel="noopener noreferrer" className="landing-btn-outline-dark">
            View All Products
          </a>
        </div>
      </div>

      <style>{`
        .landing-products-section { padding: 100px 0; background: #fefcfa; }
        .landing-products-inner { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
        .landing-products-header { text-align: center; margin-bottom: 56px; }
        .landing-products-subtitle {
          font-size: 15px; color: #7a6a5a; max-width: 460px; margin: 16px auto 0;
          font-family: 'DM Sans', sans-serif; line-height: 1.6;
        }

        .landing-products-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
        }
        .landing-product-card {
          text-decoration: none; color: inherit; border-radius: 16px;
          overflow: hidden; background: #fff;
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.4s ease; cursor: pointer;
        }
        .landing-product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 44px rgba(0,0,0,0.1);
        }
        .landing-product-image {
          position: relative; aspect-ratio: 3/3.5; overflow: hidden;
        }
        .landing-product-image img { transition: transform 0.5s ease; }
        .landing-product-card:hover .landing-product-image img { transform: scale(1.05); }
        .landing-product-badge {
          position: absolute; top: 12px; left: 12px;
          background: rgba(232,76,136,0.9); color: #fff; font-size: 10px;
          letter-spacing: 0.12em; text-transform: uppercase; padding: 5px 12px;
          border-radius: 20px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          backdrop-filter: blur(6px);
        }
        .landing-product-info { padding: 20px 20px 22px; }
        .landing-product-cat {
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.12em;
          text-transform: uppercase; color: #b0a090; display: block; margin-bottom: 6px;
        }
        .landing-product-title {
          font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
          color: #1a1109; margin-bottom: 14px;
        }
        .landing-product-footer { display: flex; justify-content: space-between; align-items: center; }
        .landing-product-price {
          font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px;
          font-weight: 600; color: #e84c88;
        }
        .landing-product-view {
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.08em;
          color: #b0a090; text-transform: uppercase; transition: color 0.25s;
        }
        .landing-product-card:hover .landing-product-view { color: #e84c88; }

        .landing-products-cta-row { text-align: center; margin-top: 48px; }
        .landing-btn-outline-dark {
          display: inline-block; padding: 15px 40px;
          border: 1.5px solid #1a1109; border-radius: 50px; color: #1a1109;
          text-decoration: none; font-size: 12px; letter-spacing: 0.15em;
          text-transform: uppercase; font-weight: 600; font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease;
        }
        .landing-btn-outline-dark:hover {
          background: #1a1109; color: #fff; transform: translateY(-2px);
        }

        @media (max-width: 960px) {
          .landing-products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .landing-products-grid { grid-template-columns: 1fr !important; }
          .landing-products-section { padding: 60px 0 !important; }
          .landing-products-inner { padding: 0 20px; }
        }
      `}</style>
    </section>
  );
}
