'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

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

  const linkProps = (external: boolean) =>
    external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};

  return (
    <>
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <Link href="/" className="landing-nav-logo">
          <Image src="/wbh-logo.png" alt="Wholesale Beauty Hub" width={140} height={56} style={{ objectFit: 'contain' }} priority />
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

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="landing-hamburger"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={26} color="#e84c88" /> : <Menu size={26} color="#1a1109" />}
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
              style={{ transitionDelay: `${i * 0.05 + 0.1}s` }}
            >
              {link.name}
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
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .landing-nav.scrolled {
          padding: 10px 48px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.06);
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
        .landing-hamburger {
          display: none; background: transparent; border: none; cursor: pointer;
          padding: 8px; border-radius: 50%;
        }

        .landing-mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: #fff; z-index: 800; display: flex; flex-direction: column;
          padding: 100px 24px 40px;
          opacity: 0; pointer-events: none; transform: translateY(-20px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .landing-mobile-menu.open { opacity: 1; pointer-events: auto; transform: translateY(0); }
        .landing-mobile-links { flex: 1; padding: 0 16px; display: flex; flex-direction: column; gap: 20px; }
        .landing-mobile-link {
          text-decoration: none; font-size: 24px; font-weight: 600; color: #1a1109;
          font-family: 'DM Sans', sans-serif;
          border-bottom: 1px solid #f0ece8; padding-bottom: 16px;
          transition: color 0.2s;
        }
        .landing-mobile-link:hover { color: #e84c88; }
        .landing-mobile-actions { padding: 0 16px; margin-top: auto; }
        .landing-mobile-label {
          font-size: 11px; font-weight: 700; color: rgba(26,17,9,0.4);
          text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 16px;
        }
        .landing-mobile-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .landing-mobile-btn-outline {
          text-decoration: none; text-align: center; background: rgba(232,76,136,0.08);
          color: #e84c88; border: 1px solid rgba(232,76,136,0.2); border-radius: 50px;
          padding: 14px 0; font-size: 15px; font-weight: 600;
        }
        .landing-mobile-btn-fill {
          text-decoration: none; text-align: center;
          background: linear-gradient(135deg, #e84c88, #d63a74); color: #fff;
          border-radius: 50px; padding: 14px 0; font-size: 15px; font-weight: 600;
          box-shadow: 0 6px 20px rgba(232,76,136,0.3);
        }

        @media (max-width: 1023px) {
          .landing-nav-links { display: none !important; }
          .landing-hamburger { display: flex !important; }
          .landing-nav { padding: 12px 20px !important; }
        }
      `}</style>
    </>
  );
}
