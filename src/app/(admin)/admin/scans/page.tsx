'use client';

import { useState, useEffect } from 'react';
import { Search, ScanLine, AlertTriangle, Calendar, User, ChevronDown, ChevronUp, Image as ImageIcon, Menu } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';

interface ScanItem {
  id: string;
  user_name: string;
  user_email: string;
  image_urls: string[];
  score: number;
  conditions: { condition: string; confidence: number; severity: string }[];
  created_at: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function AdminScansPage() {
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    // Check PIN
    const auth = sessionStorage.getItem('wbh_admin_auth');
    if (auth !== 'true') { window.location.href = '/admin'; return; }

    fetch('/api/admin/scans')
      .then(r => r.json())
      .then(data => { setScans(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = scans.filter(s => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      s.user_name?.toLowerCase().includes(q) ||
      s.user_email?.toLowerCase().includes(q) ||
      s.conditions?.some(c => c.condition.toLowerCase().includes(q))
    );
  });

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="Scan Viewer" subtitle="Monitor all user scans, images & detected conditions." onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page">
          {/* Search */}
          <div className="admin-search" style={{ marginBottom: 20, maxWidth: 400 }}>
            <Search size={16} color="#999" />
            <input
              placeholder="Search by user, email, or condition…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <p>Loading scans…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <ScanLine size={40} color="#ccc" />
              <p style={{ marginTop: 12 }}>No scans found.</p>
            </div>
          ) : (
            <div className="admin-scans-list">
              {filtered.map(scan => {
                const isExpanded = expandedId === scan.id;
                return (
                  <div key={scan.id} className={`admin-scan-card ${isExpanded ? 'expanded' : ''}`}>
                    {/* Header Row */}
                    <div className="admin-scan-header" onClick={() => setExpandedId(isExpanded ? null : scan.id)}>
                      <div className="admin-scan-preview">
                        {scan.image_urls?.[0] ? (
                          <img src={scan.image_urls[0]} alt="Scan preview" />
                        ) : (
                          <div className="admin-scan-no-img"><ImageIcon size={18} color="#ccc" /></div>
                        )}
                      </div>
                      <div className="admin-scan-meta">
                        <div className="admin-scan-user">
                          <User size={13} /> {scan.user_name || 'Unknown User'}
                        </div>
                        <div className="admin-scan-email">{scan.user_email}</div>
                        <div className="admin-scan-time">
                          <Calendar size={11} /> {formatDate(scan.created_at)}
                        </div>
                      </div>
                      <div className="admin-scan-conditions-mini">
                        {(scan.conditions || []).slice(0, 2).map((c, i) => (
                          <span key={i} className="condition-pill">{c.condition}</span>
                        ))}
                        {(scan.conditions || []).length > 2 && (
                          <span className="condition-pill" style={{ background: '#f5f5f5', color: '#999', border: '1px solid #e0e0e0' }}>
                            +{scan.conditions.length - 2}
                          </span>
                        )}
                      </div>
                      <button className="admin-scan-expand">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="admin-scan-detail">
                        {/* Images */}
                        {scan.image_urls && scan.image_urls.length > 0 && (
                          <div className="admin-scan-images">
                            <h4><ImageIcon size={14} /> Scan Images</h4>
                            <div className="admin-scan-image-grid">
                              {scan.image_urls.map((url, i) => (
                                <div key={i} className="admin-scan-img-thumb" onClick={() => setLightboxImg(url)}>
                                  <img src={url} alt={`Scan ${i + 1}`} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Conditions */}
                        <div className="admin-scan-conditions-full">
                          <h4><AlertTriangle size={14} /> Detected Conditions ({scan.conditions?.length || 0})</h4>
                          {(scan.conditions || []).length === 0 ? (
                            <p style={{ color: '#999', fontSize: '0.85rem' }}>No conditions detected</p>
                          ) : (
                            <div className="admin-conditions-grid">
                              {scan.conditions.map((c, i) => (
                                <div key={i} className="admin-condition-row">
                                  <span className="admin-condition-name">{c.condition}</span>
                                  <span className={`sev-badge ${c.severity?.toLowerCase()}`}>{c.severity}</span>
                                  <div className="admin-confidence-bar">
                                    <div style={{ width: `${c.confidence}%` }} />
                                  </div>
                                  <span className="admin-confidence-val">{c.confidence}%</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Score */}
                        <div className="admin-scan-score">
                          Skin Score: <strong>{scan.score}/100</strong>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Lightbox */}
          {lightboxImg && (
            <div className="admin-lightbox" onClick={() => setLightboxImg(null)}>
              <img src={lightboxImg} alt="Full scan" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
