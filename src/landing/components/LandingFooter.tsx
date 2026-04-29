'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Twitter } from 'lucide-react';

const WBH_SITE = 'https://wholesalebeautyhub.co.uk';

const footerLinks = {
  shop: [
    { name: 'Skincare', href: `${WBH_SITE}/product-category/skin-care/` },
    { name: 'Makeup', href: `${WBH_SITE}/product-category/makeup/` },
    { name: 'Bath & Body', href: `${WBH_SITE}/product-category/bath-body-care/` },
    { name: 'Beauty Tools', href: `${WBH_SITE}/product-category/beauty-tools/` },
    { name: 'All Brands', href: `${WBH_SITE}/brands/` },
  ],
  platform: [
    { name: 'AI Skin Analysis', href: '/scan', internal: true },
    { name: 'My Account', href: '/login', internal: true },
    { name: 'About WBH', href: `${WBH_SITE}/about/` },
    { name: 'Contact Us', href: `${WBH_SITE}/contact/` },
    { name: 'WBH Community', href: `${WBH_SITE}/wbh-beauty-blog/` },
  ],
  support: [
    { name: 'Shipping Info', href: `${WBH_SITE}` },
    { name: 'Returns Policy', href: `${WBH_SITE}` },
    { name: 'Privacy Policy', href: `${WBH_SITE}` },
    { name: 'Terms of Service', href: `${WBH_SITE}` },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner">
        <div className="landing-footer-grid">
          {/* Brand column */}
          <div className="landing-footer-brand">
            <Link href="/" className="landing-footer-logo">
              <Image src="/wbh-logo.png" alt="Wholesale Beauty Hub" width={120} height={48} style={{ objectFit: 'contain' }} />
            </Link>
            <p className="landing-footer-blurb">
              Premium makeup, skincare &amp; beauty products with AI-powered skin analysis. 
              UK-based with next-day delivery &amp; worldwide shipping.
            </p>
            <div className="landing-footer-socials">
              <a href="https://instagram.com/wholesalebeautyhub" target="_blank" rel="noopener noreferrer" className="landing-social-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com/wbhbeauty" target="_blank" rel="noopener noreferrer" className="landing-social-link" aria-label="Twitter">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Shop column */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">Shop</h4>
            <ul className="landing-footer-list">
              {footerLinks.shop.map(link => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform column */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">Platform</h4>
            <ul className="landing-footer-list">
              {footerLinks.platform.map(link => (
                <li key={link.name}>
                  {'internal' in link && link.internal ? (
                    <Link href={link.href}>{link.name}</Link>
                  ) : (
                    <a href={link.href} target="_blank" rel="noopener noreferrer">{link.name}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">Support</h4>
            <ul className="landing-footer-list">
              {footerLinks.support.map(link => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">{link.name}</a>
                </li>
              ))}
            </ul>
            <div className="landing-footer-contact">
              <p className="landing-footer-email">info@wholesalebeautyhub.co.uk</p>
              <p className="landing-footer-hours">Mon–Sat 9am–6pm GMT</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="landing-footer-bottom">
          <p className="landing-footer-copyright">
            &copy; {new Date().getFullYear()} Wholesale Beauty Hub. All rights reserved.
          </p>
          <p className="landing-footer-tagline">
            Powered by DermaAI · Made in the UK 🇬🇧
          </p>
        </div>
      </div>

      <style>{`
        .landing-footer {
          background: #1a1109; color: rgba(255,255,255,0.6);
          padding: 100px 0 40px;
        }
        .landing-footer-inner { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
        .landing-footer-grid {
          display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 56px;
          margin-bottom: 60px;
        }
        .landing-footer-logo { display: inline-flex; margin-bottom: 20px; }
        .landing-footer-blurb {
          font-size: 13.5px; line-height: 1.7; color: rgba(255,255,255,0.4);
          max-width: 280px; margin-bottom: 24px; font-family: 'DM Sans', sans-serif;
        }
        .landing-footer-socials { display: flex; gap: 12px; }
        .landing-social-link {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.5); transition: all 0.3s;
        }
        .landing-social-link:hover {
          background: rgba(232,76,136,0.15); border-color: rgba(232,76,136,0.3);
          color: #e84c88;
        }

        .landing-footer-heading {
          font-family: 'DM Sans', sans-serif; font-size: 12px; letter-spacing: 0.15em;
          text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 20px;
          font-weight: 600;
        }
        .landing-footer-list { list-style: none; margin: 0; padding: 0; }
        .landing-footer-list li { margin-bottom: 12px; }
        .landing-footer-list a {
          text-decoration: none; font-size: 14px; color: rgba(255,255,255,0.55);
          transition: color 0.25s; font-family: 'DM Sans', sans-serif;
        }
        .landing-footer-list a:hover { color: #e84c88; }

        .landing-footer-contact { margin-top: 24px; }
        .landing-footer-email {
          font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 4px;
          font-family: 'DM Sans', sans-serif;
        }
        .landing-footer-hours {
          font-family: 'DM Mono', monospace; font-size: 11px; color: rgba(255,255,255,0.25);
          letter-spacing: 0.05em;
        }

        .landing-footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding-top: 28px; display: flex; justify-content: space-between;
          align-items: center;
        }
        .landing-footer-copyright {
          font-size: 12px; color: rgba(255,255,255,0.25);
          font-family: 'DM Sans', sans-serif;
        }
        .landing-footer-tagline {
          font-family: 'DM Mono', monospace; font-size: 11px;
          color: rgba(255,255,255,0.2); letter-spacing: 0.06em;
        }

        @media (max-width: 768px) {
          .landing-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 36px !important; }
          .landing-footer { padding: 80px 0 32px !important; }
          .landing-footer-inner { padding: 0 20px; }
          .landing-footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
        }
        @media (max-width: 480px) {
          .landing-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
