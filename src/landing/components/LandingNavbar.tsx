'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, LogIn, ArrowRight } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '#about' },
  { name: 'Services', href: '#services' },
  { name: 'Analysis', href: '#analysis' },
  { name: 'Contact', href: '#contact' },
];

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: isScrolled ? 20 : 0,
        left: isScrolled ? '5%' : 0,
        right: isScrolled ? '5%' : 0,
        width: isScrolled ? '90%' : '100%',
        margin: '0 auto',
        maxWidth: 1400,
        zIndex: 50,
        padding: isScrolled ? '14px 28px' : '24px 5%',
        background: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        border: isScrolled ? '1px solid rgba(227,27,93,0.1)' : '1px solid transparent',
        borderRadius: isScrolled ? 50 : 0,
        boxShadow: isScrolled ? '0 10px 40px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: 140, height: 40, transition: 'transform 0.3s ease' }} className="nav-logo">
              <Image src="/wbh-logo.png" alt="Wholesale Beauty Hub" fill style={{ objectFit: 'contain' }} priority />
            </div>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }} className="landing-desktop-nav">
            {navLinks.map((link, i) => (
              <Link key={link.name} href={link.href} style={{
                textDecoration: 'none', fontSize: 15, fontWeight: 700,
                color: '#2d1a12', opacity: 0.75, transition: 'all 0.3s ease',
                position: 'relative', animationDelay: `${i * 0.1}s`,
              }} className="nav-link">
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div className="landing-desktop-nav" style={{ display: 'flex', gap: 12 }}>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'rgba(227,27,93,0.1)', color: '#e31b5d', border: '1px solid rgba(227,27,93,0.2)',
                  borderRadius: 50, padding: '10px 24px', fontSize: 14, fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.3s ease',
                }} className="btn-glow-hover">
                  Login
                </button>
              </Link>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#e31b5d', color: '#fff', border: 'none',
                  borderRadius: 50, padding: '10px 28px', fontSize: 14, fontWeight: 800,
                  cursor: 'pointer', boxShadow: '0 8px 24px rgba(227,27,93,0.3)',
                  transition: 'all 0.3s ease',
                }} className="btn-float-hover">
                  Sign Up
                </button>
              </Link>
            </div>
            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{
              background: mobileOpen ? 'rgba(227,27,93,0.1)' : 'transparent', 
              border: 'none', cursor: 'pointer', 
              padding: 10, borderRadius: '50%',
              display: 'none', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease'
            }} className="landing-hamburger">
              {mobileOpen ? <X size={26} color="#e31b5d" /> : <Menu size={26} color="#2d1a12" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#fff', zIndex: 40,
        opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none',
        transform: mobileOpen ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column',
        paddingTop: 100, paddingBottom: 40, paddingLeft: 24, paddingRight: 24,
      }}>
        <div style={{ flex: 1, padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {navLinks.map((link, i) => (
            <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)} style={{
              textDecoration: 'none', fontSize: 28, fontWeight: 800, color: '#2d1a12',
              fontFamily: 'Georgia, serif', borderBottom: '1px solid #f0ece9', paddingBottom: 16,
              transform: mobileOpen ? 'translateX(0)' : 'translateX(-20px)',
              opacity: mobileOpen ? 1 : 0,
              transition: `all 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05 + 0.1}s`,
            }}>{link.name}</Link>
          ))}
        </div>
        
        <div style={{ padding: '0 32px', display: 'flex', flexDirection: 'column', gap: 16, marginTop: 'auto' }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: 'rgba(45,26,18,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Get Started</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
             <Link href="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', background: 'rgba(227,27,93,0.1)', color: '#e31b5d', border: '1px solid rgba(227,27,93,0.2)',
                borderRadius: 16, padding: '16px 0', fontSize: 16, fontWeight: 800, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>Login</button>
            </Link>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <button style={{
                width: '100%', background: '#e31b5d', color: '#fff', border: 'none',
                borderRadius: 16, padding: '16px 0', fontSize: 16, fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(227,27,93,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>Sign Up</button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) { .landing-desktop-nav { display: none !important; } }
        @media (max-width: 1023px) { .landing-hamburger { display: flex !important; } }
        .nav-link:hover { color: #e31b5d !important; opacity: 1 !important; transform: translateY(-1px); }
        .btn-glow-hover:hover { background: rgba(227,27,93,0.2) !important; transform: scale(1.05); }
        .btn-float-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(227,27,93,0.4) !important; }
        .nav-logo:hover { transform: scale(1.05); }
      `}</style>
    </>
  );
}
