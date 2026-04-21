'use client';

import { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';

export default function SettingsClient({ adminEmail, adminName }: { adminEmail: string; adminName: string }) {
  const [allowFreeScans, setAllowFreeScans] = useState(true);
  const [productRecs, setProductRecs] = useState(true);
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="admin-toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="admin-toggle-slider" />
    </label>
  );

  return (
    <div className="admin-shell">
      <AdminSidebar adminEmail={adminEmail} adminName={adminName} />
      <div className="admin-main">
        <AdminTopbar title="Settings" subtitle="Platform configuration and feature management" adminEmail={adminEmail} />
        <div className="admin-page">

          {/* Feature Flags */}
          <div className="admin-settings-section">
            <div className="admin-settings-section-title">Feature Flags</div>
            <div className="admin-settings-row">
              <div>
                <div className="admin-settings-label">Allow Free Tier Scans</div>
                <div className="admin-settings-desc">Free users can submit scans for AI analysis</div>
              </div>
              <Toggle checked={allowFreeScans} onChange={setAllowFreeScans} />
            </div>
            <div className="admin-settings-row">
              <div>
                <div className="admin-settings-label">Product Recommendations</div>
                <div className="admin-settings-desc">Show AI-powered product recommendations after scan</div>
              </div>
              <Toggle checked={productRecs} onChange={setProductRecs} />
            </div>
            <div className="admin-settings-row">
              <div>
                <div className="admin-settings-label">Booking System</div>
                <div className="admin-settings-desc">Enable the consultation booking feature for all users</div>
              </div>
              <Toggle checked={bookingEnabled} onChange={setBookingEnabled} />
            </div>
          </div>

          {/* Danger Zone */}
          <div className="admin-settings-section">
            <div className="admin-settings-section-title" style={{ color: '#C62828' }}>⚠ Danger Zone</div>
            <div className="admin-settings-row">
              <div>
                <div className="admin-settings-label" style={{ color: '#C62828' }}>Maintenance Mode</div>
                <div className="admin-settings-desc">Temporarily take the app offline for all users</div>
              </div>
              <Toggle checked={maintenanceMode} onChange={setMaintenanceMode} />
            </div>
          </div>

          {/* Platform Info */}
          <div className="admin-settings-section">
            <div className="admin-settings-section-title">Platform Information</div>
            <div className="admin-settings-row">
              <div>
                <div className="admin-settings-label">Application</div>
                <div className="admin-settings-desc">WBH Derma AI — Wholesale Beauty Hub</div>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>v1.0</span>
            </div>
            <div className="admin-settings-row">
              <div>
                <div className="admin-settings-label">AI Model</div>
                <div className="admin-settings-desc">Analysis + product recommendations engine</div>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Gemini 2.5 Flash</span>
            </div>
            <div className="admin-settings-row">
              <div>
                <div className="admin-settings-label">Database</div>
                <div className="admin-settings-desc">Storage and authentication provider</div>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Supabase (PostgreSQL)</span>
            </div>
            <div className="admin-settings-row">
              <div>
                <div className="admin-settings-label">Admin Portal Access</div>
                <div className="admin-settings-desc">Route: /admin — Role-based (admin only)</div>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>Active</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              onClick={handleSave}
              style={{
                background: 'var(--primary)', color: '#fff', border: 'none',
                borderRadius: 12, padding: '12px 32px', fontWeight: 700,
                fontSize: '0.9rem', cursor: 'pointer', transition: 'opacity 0.2s',
              }}
            >
              {saved ? '✓ Saved!' : 'Save Settings'}
            </button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
              Note: Feature flags currently require redeployment to take full effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
