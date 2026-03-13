'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScanLine, Star, Bell, Clock } from 'lucide-react';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

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

export default function DashboardPage() {
  const greeting = getGreeting();
  const [scanTime, setScanTime] = useState<string>('');
  const [scanImage, setScanImage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const time = sessionStorage.getItem('dermaai_scan_time');
      const img = sessionStorage.getItem('dermaai_scan_image');
      setScanTime(formatRelativeTime(time));
      if (img) setScanImage(img);
    } catch { setScanTime('2 days ago'); }
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dash-header">
        <div className="dash-header-left">
          <div className="dash-avatar">
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>U</span>
          </div>
          <div>
            <div className="dash-greeting">{greeting} 👋</div>
            <div className="dash-subgreeting">Here&apos;s your skin update for today.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/profile/notifications" className="icon-btn"><Bell size={20} /></Link>
          <Link href="/scan" className="icon-btn"><ScanLine size={20} /></Link>
        </div>
      </div>

      {/* Skin Health Score Card */}
      <div className="score-card">
        <div className="score-left">
          <h3>Skin Health Score: 78/100</h3>
          <p>Healthy, but some areas need attention.</p>
          <Link href="/scan" className="btn btn-white btn-sm">Scan Again</Link>
        </div>
        <div className="score-right">
          <img src="/images/HomeImage.svg" alt="Facial scan" className="score-face-img" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {/* Areas Detected */}
        <div className="card" style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(0,180,250,0.06) 100%)' }}>
          <div className="card-title">Areas Detected</div>
          <div className="areas-row">
            <div className="area-item">
              <div className="area-dot red" />
              <span className="area-label">Acne Zones</span>
            </div>
            <div className="area-item">
              <div className="area-dot orange" />
              <span className="area-label">Dark Spots</span>
            </div>
            <div className="area-item">
              <div className="area-dot blue" />
              <span className="area-label">Dryness Areas</span>
            </div>
          </div>
        </div>

        {/* Recent Analysis */}
        <div className="card">
          <div className="recent-header">
            <div className="card-title" style={{ marginBottom: 0 }}>Recent Analysis</div>
            <span className="recent-time"><Clock size={12} style={{ marginRight: 4, verticalAlign: -1 }} />{scanTime || '—'}</span>
          </div>
          <div className="recent-image recent-scan-visual">
            {scanImage ? (
              <img src={scanImage} alt="Your last scan" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', borderRadius: 'var(--radius-md)' }} />
            ) : (
              <>
                <div className="recent-scan-graphic">
                  <div className="rsg-ring" />
                  <div className="rsg-score">78</div>
                  <div className="rsg-dots">
                    <span className="rsg-dot d1" />
                    <span className="rsg-dot d2" />
                    <span className="rsg-dot d3" />
                    <span className="rsg-dot d4" />
                  </div>
                </div>
                <div className="recent-scan-labels">
                  <span className="rsl-tag pink">Acne</span>
                  <span className="rsl-tag blue">Dark Spots</span>
                  <span className="rsl-tag orange">Dryness</span>
                </div>
              </>
            )}
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
