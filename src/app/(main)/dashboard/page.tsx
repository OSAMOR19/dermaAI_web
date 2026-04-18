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
  '/images/HomeImage2.svg',
  '/images/carousel1.png',
  '/images/carousel2.png',
  '/images/carousel3.png',
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
      <div className="dash-header">
        <div className="dash-header-left">
          <div className="dash-avatar">
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{initials}</span>
          </div>
          <div>
            <div className="dash-greeting">Hi{firstName ? `, ${firstName}` : ''} 👋</div>
            <div className="dash-subgreeting">Here&apos;s your skin update for today.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/profile/notifications" className="icon-btn"><Bell size={20} /></Link>
          <Link href="/scan" className="icon-btn"><ScanLine size={20} /></Link>
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
          <img src="/images/HomeImage.svg" alt="Facial scan" className="score-face-img" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {/* Areas Detected */}
        <div className="card" style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(252,101,209,0.06) 100%)' }}>
          <div className="card-title">Areas Detected</div>
          <div className="areas-row" style={{ flexWrap: 'wrap' }}>
            {areas.length > 0 ? areas.map((area, i) => (
              <div key={i} className="area-item">
                <div className={`area-dot ${i === 0 ? 'red' : i === 1 ? 'orange' : 'blue'}`} />
                <span className="area-label">{area}</span>
              </div>
            )) : (
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

      {/* Dermatologist Consultation */}
      <div className="card">
        <div className="card-title">Dermatologist Consultation</div>
        <div className="doctor-row">
          <div className="doctor-avatar">SJ</div>
          <div style={{ flex: 1 }}>
            <div className="doctor-name">Dr. Sarah Johnson</div>
            <div className="doctor-title">Dermatology Specialist</div>
            <div className="rating-row">
              <Star size={14} fill="#FFD700" color="#FFD700" />
              <span className="rating-text">4.9 (127 Reviews)</span>
            </div>
            <div className="online-badge">
              <div className="online-dot" />
              <span className="online-text">online</span>
            </div>
          </div>
        </div>
        <Link href="/booking/carter" className="btn btn-primary btn-block">View Doctor Profile</Link>
      </div>
    </div>
  );
}
