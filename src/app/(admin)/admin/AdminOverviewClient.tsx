'use client';

import { useState, useEffect } from 'react';
import { Users, ScanLine, TrendingUp, Activity, Image, Eye } from 'lucide-react';
import Link from 'next/link';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const PIE_COLORS = ['#e84c88', '#00B4FA', '#4CAF50', '#FF9800', '#7C3AED', '#E53935'];

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface StatsData {
  totalUsers: number;
  newUsers: number;
  totalScans: number;
  topCondition: string;
  scansPerDay: { date: string; count: number }[];
  topConditions: { name: string; count: number }[];
  activity: { id: string; user_id: string; email: string; name: string; created_at: string; condition: string; image_url?: string }[];
}

export default function AdminOverviewClient() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar
          title="Dashboard"
          subtitle="Welcome back — here's what's happening."
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="admin-page">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <p>Loading dashboard data…</p>
            </div>
          ) : !stats ? (
            <div className="admin-empty"><p>Failed to load stats. Check your database setup.</p></div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="admin-stats-grid">
                <Link href="/admin/users" className="admin-stat-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon" style={{ background: 'rgba(232,76,136,0.1)' }}>
                      <Users size={20} color="#e84c88" />
                    </div>
                    <div className="admin-stat-delta up">+{stats.newUsers}</div>
                  </div>
                  <div className="admin-stat-value">{stats.totalUsers.toLocaleString()}</div>
                  <div className="admin-stat-label">Total Users</div>
                </Link>
                <Link href="/admin/scans" className="admin-stat-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon" style={{ background: 'rgba(0,180,250,0.1)' }}>
                      <ScanLine size={20} color="#00B4FA" />
                    </div>
                    <div className="admin-stat-delta neutral">All time</div>
                  </div>
                  <div className="admin-stat-value">{stats.totalScans.toLocaleString()}</div>
                  <div className="admin-stat-label">Total Scans</div>
                </Link>
                <Link href="/admin/users" className="admin-stat-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon" style={{ background: 'rgba(76,175,80,0.1)' }}>
                      <TrendingUp size={20} color="#4CAF50" />
                    </div>
                    <div className="admin-stat-delta up">7 days</div>
                  </div>
                  <div className="admin-stat-value">{stats.newUsers}</div>
                  <div className="admin-stat-label">New Users (7d)</div>
                </Link>
                <Link href="/admin/scans" className="admin-stat-card" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="admin-stat-top">
                    <div className="admin-stat-icon" style={{ background: 'rgba(255,152,0,0.1)' }}>
                      <Activity size={20} color="#FF9800" />
                    </div>
                    <div className="admin-stat-delta neutral">Top</div>
                  </div>
                  <div className="admin-stat-value admin-stat-value-sm">{stats.topCondition || '—'}</div>
                  <div className="admin-stat-label">Top Condition</div>
                </Link>
              </div>

              {/* Charts */}
              <div className="admin-charts-grid">
                <div className="admin-chart-card">
                  <div className="admin-chart-title">
                    <ScanLine size={16} /> Scans — Last 7 Days
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={stats.scansPerDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 10, border: '1px solid #E8E8E8', fontSize: 12 }}
                        labelFormatter={d => `Date: ${d}`}
                      />
                      <Bar dataKey="count" name="Scans" fill="#e84c88" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="admin-chart-card">
                  <div className="admin-chart-title">
                    <Eye size={16} /> Top Skin Conditions
                  </div>
                  {stats.topConditions.length === 0 ? (
                    <div className="admin-empty" style={{ padding: '24px 16px' }}><p>No condition data yet.</p></div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie
                            data={stats.topConditions}
                            dataKey="count"
                            nameKey="name"
                            cx="50%" cy="50%"
                            outerRadius={65}
                            innerRadius={30}
                            label={false}
                          >
                            {stats.topConditions.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="admin-legend">
                        {stats.topConditions.map((c, i) => (
                          <div key={i} className="admin-legend-item">
                            <span className="admin-legend-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                            <span className="admin-legend-name">{c.name}</span>
                            <span className="admin-legend-count">{c.count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="admin-table-card">
                <div className="admin-table-header">
                  <h3>Recent Scans</h3>
                  <span style={{ fontSize: '0.75rem', color: '#999' }}>Latest across all users</span>
                </div>
                {stats.activity.length === 0 ? (
                  <div className="admin-empty"><p>No scans yet.</p></div>
                ) : (
                  <div className="admin-activity-list">
                    {stats.activity.map((item) => (
                      <Link key={item.id} href={`/admin/users/${item.user_id}`} className="admin-activity-item" style={{ textDecoration: 'none' }}>
                        {item.image_url ? (
                          <div className="activity-thumb">
                            <img src={item.image_url} alt="Scan" />
                          </div>
                        ) : (
                          <div className="activity-dot" />
                        )}
                        <div className="activity-info">
                          <div className="activity-name">{item.name || 'User'}</div>
                          <div className="activity-email">{item.email}</div>
                        </div>
                        <span className="activity-condition">{item.condition}</span>
                        <span className="activity-time">{formatRelative(item.created_at)}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
