'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScanLine, Bell, Clock, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import CompleteProfileModal from '@/components/CompleteProfileModal';

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

/* ---- Skeleton for Recent Analysis card ---- */
function RecentAnalysisSkeleton() {
  return (
    <div style={{ padding: '16px 0 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="skel skel-circle" style={{ width: 48, height: 48, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skel skel-text-lg" style={{ width: '65%', marginBottom: 8 }} />
          <div className="skel skel-text" style={{ width: '40%' }} />
        </div>
      </div>
      <div className="skel skel-text" style={{ width: '55%' }} />
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="skel skel-pill" style={{ width: 80 }} />
        <div className="skel skel-pill" style={{ width: 100 }} />
        <div className="skel skel-pill" style={{ width: 70 }} />
      </div>
    </div>
  );
}

/* ---- Skeleton for Areas Detected card ---- */
function AreasDetectedSkeleton() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <div className="skel skel-pill" style={{ width: 90 }} />
      <div className="skel skel-pill" style={{ width: 110 }} />
      <div className="skel skel-pill" style={{ width: 80 }} />
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || '';
  const initials = firstName ? firstName[0].toUpperCase() : 'U';
  const [scanTime, setScanTime] = useState<string>('');
  const [areas, setAreas] = useState<string[]>([]);
  const [hasScan, setHasScan] = useState(false);
  const [skinType, setSkinType] = useState<string>('');
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScan = async () => {
      try {
        // Check sessionStorage cache first
        const cached = sessionStorage.getItem('wbh_scans_cache');
        const cacheTime = sessionStorage.getItem('wbh_scans_cache_ts');
        const now = Date.now();
        let scans = null;

        if (cached && cacheTime && (now - parseInt(cacheTime)) < 60000) {
          // Use cache if less than 60 seconds old
          scans = JSON.parse(cached);
        } else {
          const res = await fetch('/api/scans');
          if (!res.ok) return;
          scans = await res.json();
          // Save to cache
          sessionStorage.setItem('wbh_scans_cache', JSON.stringify(scans));
          sessionStorage.setItem('wbh_scans_cache_ts', String(now));
        }

        if (scans && scans.length > 0) {
          const latest = scans[0];
          setScanTime(formatRelativeTime(latest.created_at));
          setHasScan(true);
          const conditions = latest.analysis?.detected_conditions?.map((c: any) => c.condition) || [];
          setAreas(conditions.slice(0, 3));
          if (latest.analysis?.skin_type_estimate) setSkinType(latest.analysis.skin_type_estimate);
          if (latest.analysis?.confidence_score !== undefined) setScore(latest.analysis.confidence_score);
          else if (latest.score !== undefined) setScore(latest.score);
        } else {
          setScanTime('No scans yet');
        }
      } catch {
        // fetch fail fallback
      } finally {
        setLoading(false);
      }
    };
    loadScan();
  }, []);

  return (
    <div className="dashboard">
      <CompleteProfileModal />
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
          <p>{loading ? 'Loading your insights…' : hasScan ? 'Your latest scan insights are ready.' : 'Complete your first scan.'}</p>
          <Link href="/scan" className="btn btn-white btn-sm">Scan Again</Link>
        </div>
        <div className="score-right">
          <img src="/face.jpg" alt="Facial scan" className="score-face-img" style={{ borderRadius: 16, objectFit: 'cover' }} />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {/* Areas Detected */}
        <div className="card" style={{ background: 'linear-gradient(180deg, #fff 0%, rgba(252,101,209,0.06) 100%)', paddingBottom: 16 }}>
          <div className="card-title" style={{ marginBottom: 12 }}>Areas Detected</div>
          {loading ? (
            <AreasDetectedSkeleton />
          ) : (
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
          )}
        </div>

        {/* Recent Analysis — Text Summary */}
        <div className="card">
          <div className="recent-header">
            <div className="card-title" style={{ marginBottom: 0 }}>Recent Analysis</div>
            {!loading && <span className="recent-time"><Clock size={12} style={{ marginRight: 4, verticalAlign: -2 }} />{scanTime}</span>}
          </div>

          {loading ? (
            <RecentAnalysisSkeleton />
          ) : hasScan ? (
            <div style={{ padding: '16px 0 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Score summary */}
              {score !== null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: score >= 70 ? 'rgba(76,175,80,0.1)' : score >= 50 ? 'rgba(255,152,0,0.1)' : 'rgba(229,57,53,0.1)',
                    color: score >= 70 ? '#4CAF50' : score >= 50 ? '#FF9800' : '#E53935',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', fontWeight: 800, flexShrink: 0,
                  }}>
                    {score}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#222' }}>
                      Skin Health Score
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Attention'}
                    </div>
                  </div>
                </div>
              )}

              {/* Skin type */}
              {skinType && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Skin type: <span style={{ fontWeight: 600, color: '#333', textTransform: 'capitalize' }}>{skinType}</span>
                </div>
              )}

              {/* Detected conditions */}
              {areas.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {areas.map((area, i) => (
                    <span key={i} style={{
                      fontSize: '0.75rem', padding: '4px 10px',
                      background: 'rgba(252,101,209,0.08)', color: 'var(--primary)',
                      borderRadius: 16, fontWeight: 600,
                    }}>{area}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Empty state — inviting CTA instead of plain text */
            <div style={{ padding: '20px 0 12px', textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(252,101,209,0.12), rgba(252,101,209,0.04))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <Sparkles size={24} style={{ color: 'var(--primary)' }} />
              </div>
              <p style={{ fontSize: '0.92rem', fontWeight: 700, color: '#222', margin: '0 0 6px' }}>
                Ready for your first scan?
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.5 }}>
                Get instant AI-powered insights about your skin health in under 30 seconds.
              </p>
              <Link href="/scan" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px' }}>
                <ScanLine size={16} />
                Start Your First Scan
              </Link>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/analysis" className="btn btn-primary" style={{ flex: 1 }}>View Full Report</Link>
            <Link href="/profile/scan-history" className="btn btn-outline" style={{ flex: 1 }}>View History</Link>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div style={{ margin: '12px 0 0', padding: '12px 16px', background: 'rgba(252,101,209,0.04)', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Shield size={14} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
          Your scan images are securely retained for a short period, then automatically removed. Only your diagnostic results are stored long-term.
        </p>
      </div>
      
      {/* Layout Spacer for Bottom Nav */}
      <div style={{ height: 120 }}></div>
    </div>
  );
}
