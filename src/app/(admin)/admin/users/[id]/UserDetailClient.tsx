'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, Calendar, ScanLine, Mail, Shield } from 'lucide-react';
import AdminSidebar from '../../../components/AdminSidebar';
import AdminTopbar from '../../../components/AdminTopbar';

interface Scan {
  id: string;
  created_at: string;
  score: number | null;
  signed_image_urls: string[];
  analysis: {
    detected_conditions?: { condition: string; severity: string; confidence: number }[];
    skin_type_estimate?: string;
  } | null;
}

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: string;
  plan: string;
  created_at: string;
}

export default function UserDetailClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedScan, setExpandedScan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [currentRole, setCurrentRole] = useState('user');

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users/${id}`);
    if (res.ok) {
      const data = await res.json();
      setProfile(data.profile);
      setScans(data.scans || []);
      setCurrentPlan(data.profile?.plan || 'free');
      setCurrentRole(data.profile?.role || 'user');
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const handleUpdate = async () => {
    setSaving(true);
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: currentPlan, role: currentRole }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="User Detail" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page"><div className="admin-loading"><div className="admin-spinner" /><p>Loading user…</p></div></div>
      </div>
    </div>
  );

  const displayName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User';
  const initial = profile?.first_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || '?';

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="User Detail" subtitle={displayName} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page">

          <a href="/admin/users" className="ud-back-btn"><ArrowLeft size={15} /> Back to Users</a>

          {/* ---- Profile Header Card ---- */}
          <div className="ud-profile-card">
            <div className="ud-avatar">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt={displayName} />
                : <span>{initial}</span>
              }
            </div>
            <div className="ud-profile-info">
              <h2 className="ud-name">{displayName}</h2>
              <div className="ud-email"><Mail size={13} /> {profile?.email || 'No email'}</div>
              <div className="ud-meta-row">
                <span className={`plan-badge ${currentPlan === 'pro' ? 'pro' : 'free'}`}>
                  {currentPlan === 'pro' ? '★ Pro' : 'Free'}
                </span>
                {currentRole === 'admin' && <span className="plan-badge admin-role">Admin</span>}
                <span className="ud-meta-item">
                  <Calendar size={12} />
                  Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </span>
                <span className="ud-meta-item">
                  <ScanLine size={12} />
                  {scans.length} scan{scans.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* ---- Access Control ---- */}
          <div className="ud-section-card">
            <div className="ud-section-header"><Shield size={16} /> Access Control</div>
            <div className="ud-access-row">
              <div className="ud-access-field">
                <label>Plan</label>
                <select value={currentPlan} onChange={e => setCurrentPlan(e.target.value)}>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <div className="ud-access-field">
                <label>Role</label>
                <select value={currentRole} onChange={e => setCurrentRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="ud-save-btn" onClick={handleUpdate} disabled={saving}>
                {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* ---- Scan History ---- */}
          <div className="ud-section-card">
            <div className="ud-section-header">
              <span><ScanLine size={16} /> Scan History</span>
              <span className="ud-scan-count">{scans.length} scan{scans.length !== 1 ? 's' : ''}</span>
            </div>
            {scans.length === 0 ? (
              <div className="admin-empty"><p>This user has no scans yet.</p></div>
            ) : (
              <div className="ud-scan-list">
                {scans.map(scan => (
                  <div key={scan.id} className={`ud-scan-item ${expandedScan === scan.id ? 'expanded' : ''}`}>
                    <div className="ud-scan-row" onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}>
                      <div className="ud-scan-thumb">
                        {scan.signed_image_urls[0] ? (
                          <img src={scan.signed_image_urls[0]} alt="Scan" />
                        ) : (
                          <span>🩺</span>
                        )}
                      </div>
                      <div className="ud-scan-info">
                        <div className="ud-scan-date">
                          {new Date(scan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="ud-scan-pills">
                          {(scan.analysis?.detected_conditions || []).slice(0, 3).map((c, i) => (
                            <span key={i} className="condition-pill">{c.condition}</span>
                          ))}
                          {(scan.analysis?.detected_conditions?.length || 0) > 3 && (
                            <span className="condition-pill" style={{ background: '#f5f5f5', color: '#999', border: '1px solid #e0e0e0' }}>
                              +{(scan.analysis?.detected_conditions?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      {scan.score !== null && (
                        <div className="ud-scan-score">
                          <div style={{ color: scan.score >= 70 ? '#388E3C' : scan.score >= 50 ? '#E65100' : '#C62828' }}>{scan.score}</div>
                          <span>Score</span>
                        </div>
                      )}
                      {expandedScan === scan.id ? <ChevronUp size={16} color="#999" /> : <ChevronDown size={16} color="#999" />}
                    </div>

                    {expandedScan === scan.id && (
                      <div className="ud-scan-detail">
                        {scan.signed_image_urls.length > 0 && (
                          <div className="ud-scan-images">
                            {scan.signed_image_urls.map((url, i) => (
                              <div key={i} className="ud-scan-img-card">
                                <img src={url} alt={`Image ${i + 1}`} />
                              </div>
                            ))}
                          </div>
                        )}
                        {(scan.analysis?.detected_conditions || []).map((c, i) => (
                          <div key={i} className="ud-condition-row">
                            <span className="ud-condition-name">{c.condition}</span>
                            <span className={`sev-badge ${c.severity?.toLowerCase()}`}>{c.severity}</span>
                            <span className="ud-condition-conf">{c.confidence}%</span>
                          </div>
                        ))}
                        {scan.analysis?.skin_type_estimate && (
                          <p style={{ fontSize: '0.82rem', color: '#999', marginTop: 8 }}>
                            Skin type: <strong>{scan.analysis.skin_type_estimate}</strong>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .ud-back-btn {
          display: inline-flex; align-items: center; gap: 6px; color: var(--text-muted);
          text-decoration: none; font-size: 0.85rem; font-weight: 600; margin-bottom: 20px;
          padding: 8px 16px; background: #fff; border: 1px solid #E8E8E8; border-radius: 10px;
          transition: all 0.2s;
        }
        .ud-back-btn:hover { background: #F5F5F5; color: var(--text); }

        /* Profile Card */
        .ud-profile-card {
          display: flex; align-items: center; gap: 24px; padding: 28px;
          background: #fff; border: 1px solid #E8E8E8; border-radius: 16px; margin-bottom: 20px;
        }
        .ud-avatar {
          width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0; overflow: hidden;
          background: rgba(232,76,136,0.12); display: flex; align-items: center; justify-content: center;
        }
        .ud-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ud-avatar span { font-size: 1.6rem; font-weight: 800; color: var(--primary); }
        .ud-profile-info { flex: 1; min-width: 0; }
        .ud-name { font-size: 1.3rem; font-weight: 800; color: var(--text); margin-bottom: 4px; }
        .ud-email { font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
        .ud-meta-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .ud-meta-item { display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: var(--text-muted); }

        /* Section Cards */
        .ud-section-card {
          background: #fff; border: 1px solid #E8E8E8; border-radius: 16px; margin-bottom: 20px; overflow: hidden;
        }
        .ud-section-header {
          padding: 16px 20px; border-bottom: 1px solid #F0F0F0;
          font-size: 0.9rem; font-weight: 700; color: var(--text);
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
        }
        .ud-section-header > span { display: flex; align-items: center; gap: 8px; }
        .ud-scan-count { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; }

        /* Access Control */
        .ud-access-row { display: flex; align-items: flex-end; gap: 20px; padding: 20px; flex-wrap: wrap; }
        .ud-access-field label {
          display: block; font-size: 0.72rem; font-weight: 700; color: var(--text-muted);
          text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 6px;
        }
        .ud-access-field select {
          border: 1px solid #E8E8E8; border-radius: 10px; padding: 9px 14px;
          font-size: 0.85rem; font-weight: 600; color: var(--text); background: #fff;
          cursor: pointer; outline: none; min-width: 120px;
        }
        .ud-access-field select:focus { border-color: var(--primary); }
        .ud-save-btn {
          background: var(--primary); color: #fff; border: none; border-radius: 10px;
          padding: 10px 28px; font-size: 0.85rem; font-weight: 700; cursor: pointer;
          transition: all 0.2s;
        }
        .ud-save-btn:hover { opacity: 0.85; }
        .ud-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Scan List */
        .ud-scan-list { }
        .ud-scan-item { border-bottom: 1px solid #F0F0F0; }
        .ud-scan-item:last-child { border-bottom: none; }
        .ud-scan-item.expanded { background: #FAFAFA; }
        .ud-scan-row { display: flex; align-items: center; gap: 14px; padding: 14px 20px; cursor: pointer; transition: background 0.15s; }
        .ud-scan-row:hover { background: #FAFAFA; }
        .ud-scan-thumb {
          width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0; overflow: hidden;
          background: #f5f5f5; display: flex; align-items: center; justify-content: center;
          border: 1px solid #e8e8e8;
        }
        .ud-scan-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ud-scan-thumb span { font-size: 1.2rem; }
        .ud-scan-info { flex: 1; min-width: 0; }
        .ud-scan-date { font-weight: 700; font-size: 0.85rem; color: var(--text); margin-bottom: 4px; }
        .ud-scan-pills { display: flex; gap: 4px; flex-wrap: wrap; }
        .ud-scan-score { text-align: center; flex-shrink: 0; margin-right: 4px; }
        .ud-scan-score > div { font-size: 1.2rem; font-weight: 800; }
        .ud-scan-score > span { font-size: 0.68rem; color: var(--text-muted); font-weight: 600; }

        /* Scan Detail Expanded */
        .ud-scan-detail { padding: 0 20px 16px; }
        .ud-scan-images { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; margin-bottom: 12px; }
        .ud-scan-img-card { aspect-ratio: 1; border-radius: 10px; overflow: hidden; background: #f5f5f5; border: 1px solid #e8e8e8; }
        .ud-scan-img-card img { width: 100%; height: 100%; object-fit: cover; }
        .ud-condition-row {
          display: flex; align-items: center; gap: 10px; padding: 10px 14px;
          background: #fff; border: 1px solid #E8E8E8; border-radius: 10px; margin-bottom: 6px;
        }
        .ud-condition-name { flex: 1; font-size: 0.85rem; font-weight: 700; color: var(--text); text-transform: capitalize; }
        .ud-condition-conf { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; }

        @media (max-width: 768px) {
          .ud-profile-card { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px; }
          .ud-avatar { width: 56px; height: 56px; }
          .ud-avatar span { font-size: 1.2rem; }
          .ud-name { font-size: 1.1rem; }
          .ud-access-row { gap: 12px; }
          .ud-scan-row { flex-wrap: wrap; gap: 10px; padding: 12px 16px; }
          .ud-scan-detail { padding: 0 16px 12px; }
        }
      `}</style>
    </div>
  );
}
