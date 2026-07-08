'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, Search, Download, Loader2 } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';

interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  age_range: string | null;
  location: string | null;
  skin_concerns: string[];
  other_concern: string | null;
  created_at: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/event-registration')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setRegistrations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = registrations.filter(r => {
    const q = search.toLowerCase();
    return (
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone && r.phone.toLowerCase().includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q))
    );
  });

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Age Range', 'Location', 'Skin Concerns', 'Other Concern', 'Registered At'];
    const rows = filtered.map(r => [
      r.full_name,
      r.email,
      r.phone || '',
      r.age_range || '',
      r.location || '',
      (r.skin_concerns || []).join('; '),
      r.other_concern || '',
      formatDate(r.created_at),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wbh-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar
          title="Event Registrations"
          subtitle="Client registration sign-ups"
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="admin-page">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <p>Loading registrations…</p>
            </div>
          ) : (
            <>
              {/* Controls */}
              <div className="admin-reg-controls">
                <div className="admin-reg-search-wrap">
                  <Search size={15} className="admin-reg-search-icon" />
                  <input
                    type="text"
                    className="admin-reg-search"
                    placeholder="Search by name, email, phone, location…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="admin-reg-count">
                  {filtered.length} registration{filtered.length !== 1 ? 's' : ''}
                </div>
                <button
                  onClick={handleExportCSV}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 10,
                    background: 'rgba(232,76,136,0.1)', border: '1px solid rgba(232,76,136,0.2)',
                    color: '#e84c88', fontSize: '0.82rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}
                >
                  <Download size={14} />
                  Export CSV
                </button>
              </div>

              {/* Table */}
              {filtered.length === 0 ? (
                <div className="admin-reg-empty">
                  <ClipboardList size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p>{search ? 'No registrations match your search.' : 'No registrations yet.'}</p>
                </div>
              ) : (
                <div className="admin-reg-table-wrap">
                  <table className="admin-reg-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Age</th>
                        <th>Location</th>
                        <th>Skin Concerns</th>
                        <th>Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(reg => (
                        <tr key={reg.id}>
                          <td>{reg.full_name}</td>
                          <td>{reg.email}</td>
                          <td>{reg.phone || '—'}</td>
                          <td>{reg.age_range || '—'}</td>
                          <td>{reg.location || '—'}</td>
                          <td>
                            <div className="admin-reg-concerns">
                              {(reg.skin_concerns || []).map((c, i) => (
                                <span key={i} className="admin-reg-concern-tag">{c}</span>
                              ))}
                              {reg.other_concern && (
                                <span className="admin-reg-concern-tag" style={{ background: 'rgba(0,180,250,0.12)', color: '#00B4FA' }}>
                                  {reg.other_concern}
                                </span>
                              )}
                              {(!reg.skin_concerns || reg.skin_concerns.length === 0) && !reg.other_concern && '—'}
                            </div>
                          </td>
                          <td style={{ whiteSpace: 'nowrap', fontSize: '0.78rem' }}>{formatDate(reg.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
