'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const WBH_SITE = 'https://wholesalebeautyhub.co.uk';

const navLinks = [
  { name: 'Shop', href: WBH_SITE, external: true },
  { name: 'Skin Analysis', href: '/scan', external: false },
  { name: 'About', href: `${WBH_SITE}/about/`, external: true },
  { name: 'Contact', href: `${WBH_SITE}/contact/`, external: true },
];

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const linkProps = (external: boolean) =>
    external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};

  return (
    <>
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="landing-nav-logo">
          <Image src="/wbh-logo.png" alt="Wholesale Beauty Hub" width={110} height={40} style={{ objectFit: 'contain' }} priority />
        </Link>

        <ul className="landing-nav-links">
          {navLinks.map(link => (
            <li key={link.name}>
              <Link href={link.href} {...linkProps(link.external)}>{link.name}</Link>
            </li>
          ))}
          <li>
            <Link href="/scan" className="landing-nav-cta">
              Start AI Scan
            </Link>
          </li>
        </ul>

        {/* Animated hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`landing-hamburger ${mobileOpen ? 'is-open' : ''}`}
          aria-label="Toggle menu"
        >
          <span className="hb-line hb-line-1" />
          <span className="hb-line hb-line-2" />
          <span className="hb-line hb-line-3" />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`landing-mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="landing-mobile-links">
          {navLinks.map((link, i) => (
            <Link
              key={link.name}
              href={link.href}
              {...linkProps(link.external)}
              onClick={() => setMobileOpen(false)}
              className="landing-mobile-link"
              style={{ animationDelay: mobileOpen ? `${i * 0.07 + 0.15}s` : '0s' }}
            >
              <span className="lm-link-text">{link.name}</span>
              <span className="lm-link-arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="landing-mobile-actions">
          <p className="landing-mobile-label">Get Started</p>
          <div className="landing-mobile-btns">
            <Link href="/login" className="landing-mobile-btn-outline" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link href="/scan" className="landing-mobile-btn-fill" onClick={() => setMobileOpen(false)}>Start Scan</Link>
          </div>
        </div>
      </div>

      <style>{`
        .landing-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 900;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 48px;
          background: rgba(254,252,250,0.85);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          border-radius: 0; margin: 0; max-width: 100%;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .landing-nav.scrolled {
          top: 14px; left: 50%; right: auto;
          transform: translateX(-50%);
          max-width: 880px; width: calc(100% - 48px);
          padding: 10px 32px; border-radius: 60px;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04);
        }
        .landing-nav-logo { display: flex; align-items: center; text-decoration: none; }
        .landing-nav-links {
          display: flex; align-items: center; gap: 32px; list-style: none; margin: 0; padding: 0;
        }
        .landing-nav-links a {
          font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
          color: #333; text-decoration: none; font-weight: 500; transition: color 0.25s;
          font-family: 'DM Sans', sans-serif; position: relative;
        }
        .landing-nav-links a::after {
          content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
          height: 2px; background: #e84c88; transform: scaleX(0);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: right;
        }
        .landing-nav-links a:hover { color: #e84c88; }
        .landing-nav-links a:hover::after { transform: scaleX(1); transform-origin: left; }
        .landing-nav-cta {
          background: linear-gradient(135deg, #e84c88 0%, #d63a74 100%) !important;
          color: #fff !important; padding: 12px 28px !important; border-radius: 50px !important;
          font-size: 12px !important; letter-spacing: 0.15em !important;
          transition: all 0.3s !important; box-shadow: 0 4px 16px rgba(232,76,136,0.25);
        }
        .landing-nav-cta::after { display: none !important; }
        .landing-nav-cta:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 24px rgba(232,76,136,0.35) !important;
        }

        /* ─── ANIMATED HAMBURGER ─── */
        .landing-hamburger {
          display: none; background: transparent; border: none; cursor: pointer;
          padding: 10px; border-radius: 12px; width: 44px; height: 44px;
          position: relative; z-index: 910;
          flex-direction: column; align-items: center; justify-content: center; gap: 5px;
          transition: background 0.3s;
        }
        .landing-hamburger:hover { background: rgba(0,0,0,0.04); }
        .hb-line {
          display: block; width: 22px; height: 2px; background: #1a1109;
          border-radius: 2px; transition: all 0.35s cubic-bezier(0.77, 0, 0.18, 1);
          transform-origin: center;
        }
        .landing-hamburger.is-open .hb-line { background: #e84c88; }
        .landing-hamburger.is-open .hb-line-1 { transform: translateY(7px) rotate(45deg); }
        .landing-hamburger.is-open .hb-line-2 { opacity: 0; transform: scaleX(0); }
        .landing-hamburger.is-open .hb-line-3 { transform: translateY(-7px) rotate(-45deg); }

        /* ─── MOBILE MENU ─── */
        .landing-mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(254,252,250,0.98); z-index: 800;
          display: flex; flex-direction: column;
          padding: 100px 28px 40px;
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          opacity: 0; pointer-events: none; visibility: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .landing-mobile-menu.open {
          opacity: 1; pointer-events: auto; visibility: visible;
        }
        .landing-mobile-links { flex: 1; padding: 0 8px; display: flex; flex-direction: column; gap: 0; }
        .landing-mobile-link {
          text-decoration: none; font-size: 20px; font-weight: 600; color: #1a1109;
          font-family: 'DM Sans', sans-serif;
          border-bottom: 1px solid rgba(0,0,0,0.06); padding: 20px 4px;
          display: flex; justify-content: space-between; align-items: center;
          opacity: 0; transform: translateX(-16px);
          animation: none;
        }
        .landing-mobile-menu.open .landing-mobile-link {
          animation: mMenuSlideIn 0.4s ease forwards;
        }
        @keyframes mMenuSlideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .lm-link-text { transition: color 0.2s; }
        .lm-link-arrow {
          font-size: 16px; color: rgba(0,0,0,0.15); transition: all 0.25s;
          transform: translateX(0);
        }
        .landing-mobile-link:hover .lm-link-text,
        .landing-mobile-link:active .lm-link-text { color: #e84c88; }
        .landing-mobile-link:hover .lm-link-arrow,
        .landing-mobile-link:active .lm-link-arrow {
          color: #e84c88; transform: translateX(4px);
        }

        .landing-mobile-actions {
          padding: 0 8px; margin-top: auto;
          opacity: 0; transform: translateY(12px);
          transition: all 0.4s 0.35s ease;
        }
        .landing-mobile-menu.open .landing-mobile-actions {
          opacity: 1; transform: translateY(0);
        }
        .landing-mobile-label {
          font-size: 11px; font-weight: 700; color: rgba(26,17,9,0.35);
          text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 14px;
        }
        .landing-mobile-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .landing-mobile-btn-outline {
          text-decoration: none; text-align: center; background: rgba(232,76,136,0.06);
          color: #e84c88; border: 1.5px solid rgba(232,76,136,0.2); border-radius: 50px;
          padding: 14px 0; font-size: 15px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; transition: all 0.25s;
        }
        .landing-mobile-btn-outline:active { background: rgba(232,76,136,0.12); }
        .landing-mobile-btn-fill {
          text-decoration: none; text-align: center;
          background: linear-gradient(135deg, #e84c88, #d63a74); color: #fff;
          border-radius: 50px; padding: 14px 0; font-size: 15px; font-weight: 600;
          box-shadow: 0 6px 20px rgba(232,76,136,0.3);
          font-family: 'DM Sans', sans-serif; transition: all 0.25s;
        }
        .landing-mobile-btn-fill:active { transform: scale(0.97); }

        @media (max-width: 1023px) {
          .landing-nav-links { display: none !important; }
          .landing-hamburger { display: flex !important; }
          .landing-nav { padding: 12px 20px !important; }
          .landing-nav.scrolled {
            max-width: calc(100% - 24px) !important; padding: 8px 20px !important;
            top: 10px !important; border-radius: 50px !important;
          }
        }
      `}</style>
    </>
  );
}
