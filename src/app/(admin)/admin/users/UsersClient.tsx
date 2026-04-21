'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';

interface UserRow {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: string;
  plan: string;
  created_at: string;
  scan_count: number;
}

export default function AdminUsersPage({ adminEmail, adminName }: { adminEmail: string; adminName: string }) {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const LIMIT = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set('search', search);
    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) {
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = () => { setPage(1); setSearch(searchInput); };
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="admin-shell">
      <AdminSidebar adminEmail={adminEmail} adminName={adminName} />
      <div className="admin-main">
        <AdminTopbar title="Users" subtitle={`${total.toLocaleString()} total users`} adminEmail={adminEmail} />
        <div className="admin-page">
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3>All Users</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <div className="admin-search">
                  <Search size={15} color="var(--text-muted)" />
                  <input
                    placeholder="Search by name or email…"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button className="admin-filter-btn" onClick={handleSearch}>Search</button>
                {search && (
                  <button className="admin-filter-reset" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>Clear</button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="admin-loading"><div className="admin-spinner" /><p>Loading users…</p></div>
            ) : users.length === 0 ? (
              <div className="admin-empty"><p>No users found.</p></div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Joined</th>
                      <th>Scans</th>
                      <th>Plan</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} onClick={() => router.push(`/admin/users/${u.id}`)}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-sm">
                              {u.avatar_url
                                ? <img src={u.avatar_url} alt={u.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : (u.first_name?.[0] || u.email?.[0] || '?').toUpperCase()
                              }
                            </div>
                            <div>
                              <div className="user-name">{u.first_name || ''} {u.last_name || ''}</div>
                              <div className="user-email">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ fontWeight: 700 }}>{u.scan_count}</td>
                        <td>
                          <span className={`plan-badge ${u.plan === 'pro' ? 'pro' : 'free'}`}>
                            {u.plan === 'pro' ? '★ Pro' : 'Free'}
                          </span>
                        </td>
                        <td>
                          {u.role === 'admin' ? (
                            <span className="plan-badge admin-role">Admin</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>User</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && total > LIMIT && (
              <div className="admin-pagination">
                <p>Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}</p>
                <div className="admin-pagination-btns">
                  <button className="admin-page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`admin-page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                  ))}
                  <button className="admin-page-btn" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>Next →</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
