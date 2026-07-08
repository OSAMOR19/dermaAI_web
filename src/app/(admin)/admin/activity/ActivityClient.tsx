'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Search, Calendar, Activity, ChevronLeft, ChevronRight, ScanLine, Loader2 } from 'lucide-react';
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

export default function ActivityClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const getSeverityClass = (sev: string) => {
    const s = sev?.toLowerCase();
    if (s === 'severe' || s === 'high') return 'severe';
    if (s === 'moderate' || s === 'medium') return 'moderate';
    return 'mild';
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#4CAF50';
    if (score >= 50) return '#FF9800';
    return '#E53935';
  };

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="Activity Monitor" subtitle="All AI scan submissions across the platform" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page">

          {/* Filters Card */}
          <div className="act-filter-card">
            <div className="act-filter-header">
              <div className="act-filter-title">
                <Filter size={15} />
                <span>Filters</span>
              </div>
              <div className="act-filter-actions">
                <button className="act-btn-reset" onClick={handleReset}>Reset</button>
                <button className="act-btn-apply" onClick={handleApply}>
                  <Search size={14} />
                  Apply Filters
                </button>
              </div>
            </div>
            <div className="act-filter-grid">
              <div className="act-filter-group">
                <label className="act-filter-label">Condition</label>
                <div className="act-filter-input-wrap">
                  <ScanLine size={14} className="act-filter-icon" />
                  <input
                    className="act-filter-input"
                    placeholder="e.g. Acne, Eczema"
                    value={filterCondition}
                    onChange={e => setFilterCondition(e.target.value)}
                  />
                </div>
              </div>
              <div className="act-filter-group">
                <label className="act-filter-label">From Date</label>
                <div className="act-filter-input-wrap">
                  <Calendar size={14} className="act-filter-icon" />
                  <input
                    className="act-filter-input"
                    type="date"
                    value={filterDateFrom}
                    onChange={e => setFilterDateFrom(e.target.value)}
                  />
                </div>
              </div>
              <div className="act-filter-group">
                <label className="act-filter-label">To Date</label>
                <div className="act-filter-input-wrap">
                  <Calendar size={14} className="act-filter-icon" />
                  <input
                    className="act-filter-input"
                    type="date"
                    value={filterDateTo}
                    onChange={e => setFilterDateTo(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="act-table-card">
            <div className="act-table-header">
              <div className="act-table-title">
                <Activity size={16} />
                <h3>Scan Records</h3>
              </div>
              {hasLoaded && (
                <span className="act-result-count">
                  {total.toLocaleString()} result{total !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {!hasLoaded && !loading ? (
              <div className="act-empty-state">
                <div className="act-empty-icon">
                  <Search size={28} />
                </div>
                <h4>Ready to Search</h4>
                <p>Configure your filters above and click <strong>Apply Filters</strong> to load scan activity data.</p>
              </div>
            ) : loading ? (
              <div className="act-loading">
                <Loader2 size={28} className="spin" style={{ color: '#e84c88' }} />
                <p>Loading scans…</p>
              </div>
            ) : scans.length === 0 ? (
              <div className="act-empty-state">
                <div className="act-empty-icon">
                  <ScanLine size={28} />
                </div>
                <h4>No Results</h4>
                <p>No scans match the current filters. Try adjusting your search criteria.</p>
              </div>
            ) : (
              <>
                <div className="act-table-wrap">
                  <table className="act-table">
                    <thead>
                      <tr>
                        <th style={{ width: 60 }}>Preview</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Conditions</th>
                        <th style={{ width: 70, textAlign: 'center' }}>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scans.map(scan => (
                        <tr key={scan.id} onClick={() => router.push(`/admin/users/${scan.user_id}`)} style={{ cursor: 'pointer' }}>
                          <td>
                            {scan.thumbnail ? (
                              <img
                                src={scan.thumbnail}
                                alt="Scan"
                                className="act-thumb"
                              />
                            ) : (
                              <div className="act-thumb-placeholder">
                                <ScanLine size={16} />
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="act-user-name">{scan.name || 'User'}</div>
                            <div className="act-user-email">{scan.email}</div>
                          </td>
                          <td>
                            <div className="act-date">
                              {new Date(scan.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="act-time">
                              {new Date(scan.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td>
                            <div className="act-conditions">
                              {scan.conditions.slice(0, 3).map((c, i) => (
                                <span key={i} className={`act-condition-badge ${getSeverityClass(c.severity)}`}>
                                  {c.condition}
                                </span>
                              ))}
                              {scan.conditions.length > 3 && (
                                <span className="act-condition-more">+{scan.conditions.length - 3}</span>
                              )}
                              {scan.conditions.length === 0 && (
                                <span className="act-no-conditions">None detected</span>
                              )}
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {scan.score !== null ? (
                              <div className="act-score" style={{ color: getScoreColor(scan.score) }}>
                                {scan.score}
                              </div>
                            ) : (
                              <span className="act-no-score">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {total > LIMIT && (
                  <div className="act-pagination">
                    <span className="act-page-info">
                      Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
                    </span>
                    <div className="act-page-btns">
                      <button className="act-page-btn" onClick={() => fetchScans(page - 1)} disabled={page === 1}>
                        <ChevronLeft size={16} />
                        Prev
                      </button>
                      <span className="act-page-current">{page} / {totalPages}</span>
                      <button className="act-page-btn" onClick={() => fetchScans(page + 1)} disabled={page >= totalPages}>
                        Next
                        <ChevronRight size={16} />
                      </button>
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
