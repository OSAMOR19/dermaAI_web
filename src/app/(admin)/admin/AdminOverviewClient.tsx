'use client';

import { useState, useEffect } from 'react';
import { Users, ScanLine, TrendingUp, Activity } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const PIE_COLORS = ['#FC65D1', '#00B4FA', '#4CAF50', '#FF9800', '#7C3AED', '#E53935'];

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
  activity: { id: string; email: string; name: string; created_at: string; condition: string }[];
}

export default function AdminOverviewClient({ adminEmail, adminName }: { adminEmail: string; adminName: string }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="admin-shell">
      <AdminSidebar adminEmail={adminEmail} adminName={adminName} />
      <div className="admin-main">
        <AdminTopbar title="Dashboard Overview" subtitle="Welcome back — here's what's happening." adminEmail={adminEmail} />
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
                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ background: 'rgba(252,101,209,0.1)' }}>
                    <Users size={22} color="#FC65D1" />
                  </div>
                  <div className="admin-stat-value">{stats.totalUsers.toLocaleString()}</div>
                  <div className="admin-stat-label">Total Users</div>
                  <div className="admin-stat-delta up">↑ {stats.newUsers} this week</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ background: 'rgba(0,180,250,0.1)' }}>
                    <ScanLine size={22} color="#00B4FA" />
                  </div>
                  <div className="admin-stat-value">{stats.totalScans.toLocaleString()}</div>
                  <div className="admin-stat-label">Total Scans</div>
                  <div className="admin-stat-delta neutral">All time</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ background: 'rgba(76,175,80,0.1)' }}>
                    <TrendingUp size={22} color="#4CAF50" />
                  </div>
                  <div className="admin-stat-value">{stats.newUsers}</div>
                  <div className="admin-stat-label">New Users (7d)</div>
                  <div className="admin-stat-delta up">Last 7 days</div>
                </div>
                <div className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ background: 'rgba(255,152,0,0.1)' }}>
                    <Activity size={22} color="#FF9800" />
                  </div>
                  <div className="admin-stat-value" style={{ fontSize: '1.1rem', paddingTop: 8 }}>
                    {stats.topCondition}
                  </div>
                  <div className="admin-stat-label">Top Condition</div>
                  <div className="admin-stat-delta neutral">Most common</div>
                </div>
              </div>

              {/* Charts */}
              <div className="admin-charts-grid">
                <div className="admin-chart-card">
                  <div className="admin-chart-title">Scans Per Day — Last 7 Days</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.scansPerDay} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                      <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 10, border: '1px solid #E8E8E8', fontSize: 12 }}
                        labelFormatter={d => `Date: ${d}`}
                      />
                      <Bar dataKey="count" name="Scans" fill="#FC65D1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="admin-chart-card">
                  <div className="admin-chart-title">Top Skin Conditions</div>
                  {stats.topConditions.length === 0 ? (
                    <div className="admin-empty"><p>No condition data yet.</p></div>
                  ) : (
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={stats.topConditions}
                          dataKey="count"
                          nameKey="name"
                          cx="50%" cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {stats.topConditions.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend
                          formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="admin-table-card">
                <div className="admin-table-header">
                  <h3>Recent Activity</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest 8 scans across all users</span>
                </div>
                {stats.activity.length === 0 ? (
                  <div className="admin-empty"><p>No activity yet.</p></div>
                ) : (
                  <div className="admin-activity-list">
                    {stats.activity.map((item) => (
                      <div key={item.id} className="admin-activity-item">
                        <div className="activity-dot" />
                        <div className="activity-info">
                          <div className="activity-name">{item.name || 'User'}</div>
                          <div className="activity-email">{item.email}</div>
                        </div>
                        <span className="activity-condition">{item.condition}</span>
                        <span className="activity-time">{formatRelative(item.created_at)}</span>
                      </div>
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
