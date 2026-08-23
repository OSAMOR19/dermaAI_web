'use client';

import { useEffect } from 'react';
import { ArrowLeft, ExternalLink, ShoppingBag, Sparkles } from 'lucide-react';
import Link from 'next/link';

const WBH_STORE_URL = 'https://wholesalebeautyhub.co.uk/';

export default function ShopPage() {
  useEffect(() => {
    // Automatically attempt to open the store in a new tab on mount if allowed
    const timer = setTimeout(() => {
      window.open(WBH_STORE_URL, '_blank', 'noopener,noreferrer');
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', 
      minHeight: '100dvh', width: '100%',
      maxWidth: 560, margin: '0 auto',
      background: '#fff',
    }}>
      {/* Header Bar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        zIndex: 10,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dashboard" className="icon-btn" style={{ background: 'rgba(0,0,0,0.04)', width: 38, height: 38 }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#111' }}>WBH Marketplace</h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>wholesalebeautyhub.co.uk</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(252,101,209,0.15) 0%, rgba(232,76,136,0.15) 100%)',
          color: 'var(--primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 8px 24px rgba(252,101,209,0.2)',
        }}>
          <ShoppingBag size={38} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', marginBottom: 10 }}>
          Opening WBH Marketplace
        </h2>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 340, marginBottom: 28 }}>
          You are being redirected to Wholesale Beauty Hub to shop dermatological products and skincare routines.
        </p>

        <a
          href={WBH_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg btn-block"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            maxWidth: 320,
            textDecoration: 'none',
            fontSize: '1rem',
            padding: '16px 24px',
            borderRadius: 16,
            fontWeight: 700,
          }}
        >
          <span>Launch Marketplace Store</span>
          <ExternalLink size={18} />
        </a>

        <div style={{
          marginTop: 32,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          background: 'rgba(0,0,0,0.03)',
          borderRadius: 20,
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}>
          <Sparkles size={14} style={{ color: 'var(--primary)' }} />
          <span>Opens safely in a new browser tab</span>
        </div>
      </div>
    </div>
  );
}

