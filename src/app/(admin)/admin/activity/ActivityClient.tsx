'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';

interface ScanEntry {
  id: string;
  user_id: string;
  email: string;
  name: string;
  created_at: string;
  score: number | null;
  thumbnail: string | null;
  conditions: { condition: string; severity: string }[];
}

export default function ActivityClient({ adminEmail, adminName }: { adminEmail: string; adminName: string }) {
  const router = useRouter();
  const [scans, setScans] = useState<ScanEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [filterUser, setFilterUser] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const LIMIT = 20;

  const fetchScans = useCallback(async (pg: number = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(pg), limit: String(LIMIT) });
    if (filterUser) params.set('user_id', filterUser);
    if (filterCondition) params.set('condition', filterCondition);
    if (filterDateFrom) params.set('date_from', filterDateFrom);
    if (filterDateTo) params.set('date_to', filterDateTo);

    const res = await fetch(`/api/admin/scans?${params}`);
    if (res.ok) {
      const data = await res.json();
      setScans(data.scans || []);
      setTotal(data.total || 0);
      setPage(pg);
    }
    setLoading(false);
    setHasLoaded(true);
  }, [filterUser, filterCondition, filterDateFrom, filterDateTo]);

  const handleApply = () => fetchScans(1);
  const handleReset = () => {
    setFilterUser(''); setFilterCondition(''); setFilterDateFrom(''); setFilterDateTo('');
    setScans([]); setTotal(0); setHasLoaded(false);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="admin-shell">
      <AdminSidebar adminEmail={adminEmail} adminName={adminName} />
      <div className="admin-main">
        <AdminTopbar title="Activity Monitor" subtitle="All AI scan submissions across the platform" adminEmail={adminEmail} />
        <div className="admin-page">

          {/* Filters */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E8E8', padding: '20px 24px', marginBottom: 20 }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Filters</p>
            <div className="admin-filters">
              <input
                className="admin-filter-input"
                placeholder="Filter by condition (e.g. Acne)"
                value={filterCondition}
                onChange={e => setFilterCondition(e.target.value)}
              />
              <input
                className="admin-filter-input"
                type="date"
                value={filterDateFrom}
                onChange={e => setFilterDateFrom(e.target.value)}
                title="From date"
              />
              <input
                className="admin-filter-input"
                type="date"
                value={filterDateTo}
                onChange={e => setFilterDateTo(e.target.value)}
                title="To date"
              />
              <button className="admin-filter-btn" onClick={handleApply}>Apply Filters</button>
              <button className="admin-filter-reset" onClick={handleReset}>Reset</button>
            </div>
          </div>

          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3>Scan Records</h3>
              {hasLoaded && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{total.toLocaleString()} results</span>}
            </div>

            {!hasLoaded && !loading ? (
              <div className="admin-empty">
                <p>Apply filters and click <strong>Apply Filters</strong> to load scan data.</p>
              </div>
            ) : loading ? (
              <div className="admin-loading"><div className="admin-spinner" /><p>Loading scans…</p></div>
            ) : scans.length === 0 ? (
              <div className="admin-empty"><p>No scans match the current filters.</p></div>
            ) : (
              <>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Preview</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Conditions</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scans.map(scan => (
                        <tr key={scan.id} onClick={() => router.push(`/admin/users/${scan.user_id}`)}>
                          <td>
                            {scan.thumbnail ? (
                              <img
                                src={scan.thumbnail}
                                alt="Scan"
                                style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', display: 'block', border: '1px solid #E8E8E8' }}
                              />
                            ) : (
                              <div style={{ width: 44, height: 44, borderRadius: 8, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🩺</div>
                            )}
                          </td>
                          <td>
                            <div className="user-name">{scan.name || 'User'}</div>
                            <div className="user-email">{scan.email}</div>
                          </td>
                          <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {new Date(scan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            <br />
                            <span style={{ fontSize: '0.75rem' }}>{new Date(scan.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 260 }}>
                              {scan.conditions.slice(0, 3).map((c, i) => (
                                <span key={i} className="condition-pill">{c.condition}</span>
                              ))}
                              {scan.conditions.length > 3 && (
                                <span className="condition-pill">+{scan.conditions.length - 3}</span>
                              )}
                              {scan.conditions.length === 0 && (
                                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>None detected</span>
                              )}
                            </div>
                          </td>
                          <td>
                            {scan.score !== null ? (
                              <span style={{
                                fontWeight: 800, fontSize: '1rem',
                                color: scan.score >= 70 ? '#388E3C' : scan.score >= 50 ? '#E65100' : '#C62828',
                              }}>{scan.score}</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {total > LIMIT && (
                  <div className="admin-pagination">
                    <p>Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}</p>
                    <div className="admin-pagination-btns">
                      <button className="admin-page-btn" onClick={() => fetchScans(page - 1)} disabled={page === 1}>← Prev</button>
                      <button className="admin-page-btn" onClick={() => fetchScans(page + 1)} disabled={page >= totalPages}>Next →</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
