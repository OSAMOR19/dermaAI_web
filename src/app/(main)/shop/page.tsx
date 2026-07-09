'use client';

import { useState } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const WBH_STORE_URL = 'https://wholesalebeautyhub.co.uk/';

export default function ShopPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', 
      height: '100dvh', width: '100%',
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
            <h1 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#111' }}>WBH Shop</h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0 }}>wholesalebeautyhub.co.uk</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {
              setLoading(true);
              setError(false);
              const iframe = document.getElementById('wbh-shop-iframe') as HTMLIFrameElement;
              if (iframe) iframe.src = WBH_STORE_URL;
            }}
            className="icon-btn"
            style={{ background: 'rgba(0,0,0,0.04)', width: 38, height: 38 }}
          >
            <RefreshCw size={16} />
          </button>
          <a
            href={WBH_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-btn"
            style={{ background: 'rgba(0,0,0,0.04)', width: 38, height: 38 }}
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </header>

      {/* Iframe Container */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Skeleton Loading Overlay */}
        {loading && !error && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            background: '#fff', padding: 16, overflowY: 'hidden',
          }}>
            {/* Hero banner skeleton */}
            <div className="skel" style={{ width: '100%', height: 160, borderRadius: 14, marginBottom: 20 }} />
            
            {/* Search bar skeleton */}
            <div className="skel" style={{ width: '100%', height: 44, borderRadius: 22, marginBottom: 20 }} />

            {/* Category pills row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflow: 'hidden' }}>
              {[80, 100, 70, 90, 60].map((w, i) => (
                <div key={i} className="skel skel-pill" style={{ width: w, flexShrink: 0 }} />
              ))}
            </div>

            {/* Product grid skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ borderRadius: 14, overflow: 'hidden', background: '#fafafa', padding: 10 }}>
                  <div className="skel" style={{ width: '100%', height: 130, borderRadius: 10, marginBottom: 10 }} />
                  <div className="skel skel-text" style={{ width: '75%', marginBottom: 8 }} />
                  <div className="skel skel-text" style={{ width: '50%', marginBottom: 10 }} />
                  <div className="skel skel-pill" style={{ width: '60%' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Fallback */}
        {error && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 5,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: '#fff', padding: 32, textAlign: 'center',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(252,101,209,0.1)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              <ShoppingBag size={32} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8 }}>Shop Unavailable</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6, maxWidth: 280 }}>
              The shop couldn&apos;t be loaded in-app. Tap below to visit the store directly.
            </p>
            <a
              href={WBH_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <ExternalLink size={16} />
              Open WBH Shop
            </a>
          </div>
        )}

        <iframe
          id="wbh-shop-iframe"
          src={WBH_STORE_URL}
          title="Wholesale Beauty Hub Shop"
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: error ? 'none' : 'block',
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          allow="payment"
        />
      </div>

      {/* Bottom spacer so content isn't hidden behind the nav */}
      <div style={{ height: 80, flexShrink: 0 }} />
    </div>
  );
}
