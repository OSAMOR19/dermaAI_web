'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ScanLine, Calendar, ChevronRight } from 'lucide-react';
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

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const getDisplayName = (u: UserRow) => {
    const name = `${u.first_name || ''} ${u.last_name || ''}`.trim();
    return name || u.email?.split('@')[0] || 'Unknown';
  };

  const getInitial = (u: UserRow) => {
    if (u.first_name) return u.first_name[0].toUpperCase();
    if (u.email) return u.email[0].toUpperCase();
    return '?';
  };

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="Users" subtitle={`${total.toLocaleString()} registered users`} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page">

          {/* Search Bar */}
          <div className="au-search-bar">
            <div className="admin-search" style={{ flex: 1 }}>
              <Search size={15} color="#999" />
              <input
                placeholder="Search by name or email…"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="au-search-btn" onClick={handleSearch}>Search</button>
            {search && (
              <button className="au-clear-btn" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }}>Clear</button>
            )}
          </div>

          {loading ? (
            <div className="admin-loading"><div className="admin-spinner" /><p>Loading users…</p></div>
          ) : users.length === 0 ? (
            <div className="admin-empty"><p>No users found.</p></div>
          ) : (
            <div className="au-user-list">
              {users.map(u => (
                <div key={u.id} className="au-user-card" onClick={() => router.push(`/admin/users/${u.id}`)}>
                  <div className="au-user-avatar">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={getDisplayName(u)} />
                    ) : (
                      <span>{getInitial(u)}</span>
                    )}
                  </div>
                  <div className="au-user-info">
                    <div className="au-user-name">{getDisplayName(u)}</div>
                    <div className="au-user-email">{u.email || 'No email'}</div>
                  </div>
                  <div className="au-user-meta">
                    <div className="au-meta-item">
                      <Calendar size={12} />
                      {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="au-meta-item">
                      <ScanLine size={12} />
                      <strong>{u.scan_count}</strong> scan{u.scan_count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="au-user-badges">
                    <span className={`plan-badge ${u.plan === 'pro' ? 'pro' : 'free'}`}>
                      {u.plan === 'pro' ? '★ Pro' : 'Free'}
                    </span>
                    {u.role === 'admin' && <span className="plan-badge admin-role">Admin</span>}
                  </div>
                  <ChevronRight size={16} className="au-user-chevron" />
                </div>
              ))}
            </div>
          )}

          {!loading && total > LIMIT && (
            <div className="au-pagination">
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

      <style>{`
        .au-search-bar { display: flex; gap: 8px; margin-bottom: 20px; align-items: center; }
        .au-search-btn { background: var(--primary); color: #fff; border: none; padding: 10px 20px; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .au-search-btn:hover { opacity: 0.85; }
        .au-clear-btn { background: #F5F5F5; border: 1px solid #E8E8E8; color: var(--text-muted); padding: 10px 16px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; white-space: nowrap; }

        .au-user-list { display: flex; flex-direction: column; gap: 8px; }

        .au-user-card {
          display: flex; align-items: center; gap: 16px;
          background: #fff; border: 1px solid #E8E8E8; border-radius: 14px;
          padding: 16px 20px; cursor: pointer; transition: all 0.2s;
        }
        .au-user-card:hover { border-color: rgba(232,76,136,0.2); box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-1px); }

        .au-user-avatar {
          width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0; overflow: hidden;
          background: rgba(232,76,136,0.1); display: flex; align-items: center; justify-content: center;
        }
        .au-user-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .au-user-avatar span { font-size: 1rem; font-weight: 800; color: var(--primary); }

        .au-user-info { flex: 1; min-width: 0; }
        .au-user-name { font-size: 0.9rem; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .au-user-email { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .au-user-meta { display: flex; gap: 16px; flex-shrink: 0; }
        .au-meta-item { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: var(--text-muted); white-space: nowrap; }
        .au-meta-item strong { color: var(--text); font-weight: 800; }

        .au-user-badges { display: flex; gap: 6px; flex-shrink: 0; }
        .au-user-chevron { color: #ccc; flex-shrink: 0; }

        .au-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 20px; padding: 12px 0; }
        .au-pagination p { font-size: 0.82rem; color: var(--text-muted); }

        @media (max-width: 768px) {
          .au-search-bar { flex-wrap: wrap; }
          .au-user-card { flex-wrap: wrap; gap: 10px; padding: 14px 16px; }
          .au-user-meta { width: 100%; gap: 12px; }
          .au-user-badges { width: auto; }
          .au-user-chevron { display: none; }
          .au-pagination { flex-direction: column; gap: 12px; }
        }
        @media (max-width: 480px) {
          .au-user-avatar { width: 38px; height: 38px; }
          .au-user-name { font-size: 0.85rem; }
        }
      `}</style>
    </div>
  );
}
