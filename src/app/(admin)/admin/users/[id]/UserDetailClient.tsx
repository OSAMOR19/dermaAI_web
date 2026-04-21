'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
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

export default function UserDetailClient({ adminEmail, adminName }: { adminEmail: string; adminName: string }) {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
  };

  if (loading) return (
    <div className="admin-shell">
      <AdminSidebar adminEmail={adminEmail} adminName={adminName} />
      <div className="admin-main">
        <AdminTopbar title="User Detail" adminEmail={adminEmail} />
        <div className="admin-page"><div className="admin-loading"><div className="admin-spinner" /><p>Loading user…</p></div></div>
      </div>
    </div>
  );

  const displayName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User';
  const initial = displayName[0]?.toUpperCase() || '?';

  return (
    <div className="admin-shell">
      <AdminSidebar adminEmail={adminEmail} adminName={adminName} />
      <div className="admin-main">
        <AdminTopbar title="User Detail" subtitle={displayName} adminEmail={adminEmail} />
        <div className="admin-page">

          <a href="/admin/users" className="admin-back-btn"><ArrowLeft size={15} /> Back to Users</a>

          {/* Profile Header */}
          <div className="admin-user-detail-header">
            <div className="admin-detail-avatar">
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initial}
            </div>
            <div style={{ flex: 1 }}>
              <div className="admin-detail-name">{displayName}</div>
              <div className="admin-detail-email">{profile?.email}</div>
              <div className="admin-detail-meta">
                <span className={`plan-badge ${currentPlan === 'pro' ? 'pro' : 'free'}`}>{currentPlan === 'pro' ? '★ Pro' : 'Free'}</span>
                {currentRole === 'admin' && <span className="plan-badge admin-role">Admin</span>}
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{scans.length} scan{scans.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div className="admin-table-card" style={{ marginBottom: 24 }}>
            <div className="admin-table-header"><h3>Access Control</h3></div>
            <div style={{ padding: '20px 24px', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Plan</p>
                <select className="plan-select" value={currentPlan} onChange={e => setCurrentPlan(e.target.value)}>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
              <div>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Role</p>
                <select className="plan-select" value={currentRole} onChange={e => setCurrentRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                onClick={handleUpdate}
                disabled={saving}
                style={{
                  background: 'var(--primary)', color: '#fff', border: 'none',
                  borderRadius: 10, padding: '9px 24px', fontWeight: 700,
                  fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s',
                }}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Scan History */}
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3>Scan History</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{scans.length} scans</span>
            </div>
            {scans.length === 0 ? (
              <div className="admin-empty"><p>This user has no scans yet.</p></div>
            ) : (
              <div>
                {scans.map(scan => (
                  <div key={scan.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px',
                        cursor: 'pointer',
                      }}
                      onClick={() => setExpandedScan(expandedScan === scan.id ? null : scan.id)}
                    >
                      {/* Thumbnail */}
                      {scan.signed_image_urls[0] ? (
                        <img
                          src={scan.signed_image_urls[0]}
                          alt="Scan"
                          style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: '1px solid #E8E8E8' }}
                        />
                      ) : (
                        <div style={{ width: 52, height: 52, borderRadius: 10, background: '#F5F5F5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🩺</div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 3 }}>
                          {new Date(scan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {(scan.analysis?.detected_conditions || []).slice(0, 3).map((c, i) => (
                            <span key={i} className="condition-pill">{c.condition}</span>
                          ))}
                          {(scan.analysis?.detected_conditions?.length || 0) > 3 && (
                            <span className="condition-pill">+{(scan.analysis?.detected_conditions?.length || 0) - 3} more</span>
                          )}
                        </div>
                      </div>
                      {scan.score !== null && (
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: scan.score >= 70 ? '#388E3C' : scan.score >= 50 ? '#E65100' : '#C62828' }}>{scan.score}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Score</div>
                        </div>
                      )}
                      {expandedScan === scan.id ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                    </div>

                    {expandedScan === scan.id && (
                      <div style={{ padding: '0 24px 20px', background: '#FAFAFA' }}>
                        {/* All images */}
                        {scan.signed_image_urls.length > 0 && (
                          <div className="admin-scan-grid" style={{ marginBottom: 16 }}>
                            {scan.signed_image_urls.map((url, i) => (
                              <div key={i} className="admin-scan-thumb">
                                <img src={url} alt={`Image ${i + 1}`} />
                                <div className="admin-scan-thumb-label">Image {i + 1}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Conditions detail */}
                        {(scan.analysis?.detected_conditions || []).map((c, i) => (
                          <div key={i} style={{ background: '#fff', border: '1px solid #E8E8E8', borderRadius: 10, padding: '12px 16px', marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'capitalize' }}>{c.condition}</span>
                              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span className={`sev-badge ${c.severity?.toLowerCase()}`}>{c.severity}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{c.confidence}% confidence</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {scan.analysis?.skin_type_estimate && (
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 8 }}>
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
    </div>
  );
}
