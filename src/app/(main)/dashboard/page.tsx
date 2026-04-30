'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScanLine, Star, Bell, Clock } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

function formatRelativeTime(isoStr: string | null): string {
  if (!isoStr) return 'No scans yet';
  const d = new Date(isoStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays} days ago`;
}

const CAROUSEL_IMAGES = [
  'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=600',
];

function RecentCarousel() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % CAROUSEL_IMAGES.length), 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="carousel-wrap">
      {CAROUSEL_IMAGES.map((src, i) => (
        <img key={i} src={src} alt={`Skin analysis ${i + 1}`} className={`carousel-img ${i === idx ? 'active' : ''}`} />
      ))}
      <div className="carousel-dots">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button key={i} className={`carousel-dot ${i === idx ? 'active' : ''}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || '';
  const initials = firstName ? firstName[0].toUpperCase() : 'U';
  const [scanTime, setScanTime] = useState<string>('');
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [areas, setAreas] = useState<string[]>([]);

  useEffect(() => {
    const loadScan = async () => {
      try {
        const res = await fetch('/api/scans');
        if (!res.ok) return;
        const scans = await res.json();
        if (scans && scans.length > 0) {
          const latest = scans[0];
          setScanTime(formatRelativeTime(latest.created_at));
          if (latest.image_urls?.length) setScanImage(latest.image_urls[0]);
          const conditions = latest.analysis?.detected_conditions?.map((c: any) => c.condition) || [];
          setAreas(conditions.slice(0, 3));
        } else {
          setScanTime('No scans yet');
        }
      } catch {
        // fetch fail fallback
      }
    };
    loadScan();
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header" style={{ alignItems: 'center', paddingBottom: 12 }}>
        <div className="dash-header-left" style={{ alignItems: 'center', gap: 12 }}>
          <div className="dash-avatar" style={{ width: 44, height: 44, overflow: 'hidden' }}>
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>{initials}</span>
            )}
          </div>
          <div className="dash-greeting" style={{ fontSize: '1.25rem', marginBottom: 0, fontWeight: 800 }}>
            Hi{firstName ? `, ${firstName}` : ''} <span style={{display:'inline-block'}}>👋</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/profile/notifications" className="icon-btn" style={{ width: 44, height: 44, background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}><Bell size={20} color="#555" /></Link>
          <Link href="/scan" className="icon-btn" style={{ width: 44, height: 44, background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}><ScanLine size={20} color="#555" /></Link>
        </div>
      </div>

      {/* Skin Health Status Card */}
      <div className="score-card">
        <div className="score-left">
          <h3>Your Skin Analysis</h3>
          <p>{scanImage ? 'Your latest scan insights are ready.' : 'Complete your first scan.'}</p>
          <Link href="/scan" className="btn btn-white btn-sm">Scan Again</Link>
        </div>
        <div className="score-right">
          <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400" alt="Facial scan" className="score-face-img" style={{ borderRadius: 16, objectFit: 'cover' }} />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {/* Areas Detected */}
        <div className="card" style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(252,101,209,0.06) 100%)', paddingBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Areas Detected</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {areas.length > 0 ? areas.map((area, i) => {
              const hue = i === 0 ? 'var(--primary)' : i === 1 ? '#FF9800' : '#2196F3';
              const hueBg = i === 0 ? 'rgba(252,101,209,0.1)' : i === 1 ? 'rgba(255,152,0,0.1)' : 'rgba(33,150,243,0.1)';
              
              return (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center', background: hueBg, padding: '6px 12px', borderRadius: 20, gap: 6, border: `1px solid rgba(0,0,0,0.02)` }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: hue }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#333' }}>{area}</span>
              </div>
            )}) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No concerns detected yet.</p>
            )}
          </div>
        </div>

        {/* Recent Analysis */}
        <div className="card">
          <div className="recent-header">
            <div className="card-title" style={{ marginBottom: 0 }}>Recent Analysis</div>
            <span className="recent-time"><Clock size={12} style={{ marginRight: 4, verticalAlign: -2 }} />{scanTime}</span>
          </div>
          <div className="recent-image">
            <RecentCarousel />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/analysis" className="btn btn-primary" style={{ flex: 1 }}>View Full Report</Link>
            <Link href="/profile/scan-history" className="btn btn-outline" style={{ flex: 1 }}>View History</Link>
          </div>
        </div>
      </div>
      
      {/* Layout Spacer for Bottom Nav */}
      <div style={{ height: 120 }}></div>
    </div>
  );
}
