'use client';

import { useState } from 'react';
import { Settings, Zap, Shield, AlertTriangle, Info, Server, Database, Cpu, Globe, Lock, Check, Save } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import AdminTopbar from '../../components/AdminTopbar';

export default function SettingsClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allowFreeScans, setAllowFreeScans] = useState(true);
  const [productRecs, setProductRecs] = useState(true);
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Toggle = ({ checked, onChange, danger }: { checked: boolean; onChange: (v: boolean) => void; danger?: boolean }) => (
    <label className={`stg-toggle ${checked ? 'on' : ''} ${danger ? 'danger' : ''}`}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: 'none' }} />
      <span className="stg-toggle-track">
        <span className="stg-toggle-thumb" />
      </span>
    </label>
  );

  return (
    <div className="admin-shell">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        <AdminTopbar title="Settings" subtitle="Platform configuration and feature management" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="admin-page">

          {/* Feature Flags Section */}
          <div className="stg-section">
            <div className="stg-section-header">
              <div className="stg-section-icon" style={{ background: 'rgba(232,76,136,0.1)', color: '#e84c88' }}>
                <Zap size={18} />
              </div>
              <div>
                <h3 className="stg-section-title">Feature Flags</h3>
                <p className="stg-section-desc">Control platform features and user access</p>
              </div>
            </div>

            <div className="stg-card">
              <div className="stg-row">
                <div className="stg-row-left">
                  <div className="stg-row-icon" style={{ background: 'rgba(76,175,80,0.1)', color: '#4CAF50' }}>
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="stg-row-label">Allow Free Tier Scans</div>
                    <div className="stg-row-desc">Free users can submit scans for AI analysis</div>
                  </div>
                </div>
                <Toggle checked={allowFreeScans} onChange={setAllowFreeScans} />
              </div>

              <div className="stg-divider" />

              <div className="stg-row">
                <div className="stg-row-left">
                  <div className="stg-row-icon" style={{ background: 'rgba(0,180,250,0.1)', color: '#00B4FA' }}>
                    <Cpu size={16} />
                  </div>
                  <div>
                    <div className="stg-row-label">Product Recommendations</div>
                    <div className="stg-row-desc">Show AI-powered product recommendations after scan</div>
                  </div>
                </div>
                <Toggle checked={productRecs} onChange={setProductRecs} />
              </div>

              <div className="stg-divider" />

              <div className="stg-row">
                <div className="stg-row-left">
                  <div className="stg-row-icon" style={{ background: 'rgba(255,152,0,0.1)', color: '#FF9800' }}>
                    <Globe size={16} />
                  </div>
                  <div>
                    <div className="stg-row-label">Booking System</div>
                    <div className="stg-row-desc">Enable the consultation booking feature for all users</div>
                  </div>
                </div>
                <Toggle checked={bookingEnabled} onChange={setBookingEnabled} />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="stg-section">
            <div className="stg-section-header">
              <div className="stg-section-icon" style={{ background: 'rgba(229,57,53,0.1)', color: '#E53935' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="stg-section-title" style={{ color: '#E53935' }}>Danger Zone</h3>
                <p className="stg-section-desc">Critical settings that affect all users</p>
              </div>
            </div>

            <div className="stg-card stg-card-danger">
              <div className="stg-row">
                <div className="stg-row-left">
                  <div className="stg-row-icon" style={{ background: 'rgba(229,57,53,0.1)', color: '#E53935' }}>
                    <Shield size={16} />
                  </div>
                  <div>
                    <div className="stg-row-label" style={{ color: '#E53935' }}>Maintenance Mode</div>
                    <div className="stg-row-desc">Temporarily take the app offline for all users</div>
                  </div>
                </div>
                <Toggle checked={maintenanceMode} onChange={setMaintenanceMode} danger />
              </div>
            </div>
          </div>

          {/* Platform Information */}
          <div className="stg-section">
            <div className="stg-section-header">
              <div className="stg-section-icon" style={{ background: 'rgba(0,180,250,0.1)', color: '#00B4FA' }}>
                <Info size={18} />
              </div>
              <div>
                <h3 className="stg-section-title">Platform Information</h3>
                <p className="stg-section-desc">System details and version info</p>
              </div>
            </div>

            <div className="stg-card">
              <div className="stg-info-row">
                <div className="stg-info-left">
                  <Server size={15} className="stg-info-icon" />
                  <span className="stg-info-label">Application</span>
                </div>
                <span className="stg-info-value">WBH Derma AI — Wholesale Beauty Hub</span>
                <span className="stg-info-badge">v1.0</span>
              </div>

              <div className="stg-divider" />

              <div className="stg-info-row">
                <div className="stg-info-left">
                  <Cpu size={15} className="stg-info-icon" />
                  <span className="stg-info-label">AI Model</span>
                </div>
                <span className="stg-info-value">Gemini 2.5 Flash</span>
                <span className="stg-info-badge stg-info-badge-blue">Active</span>
              </div>

              <div className="stg-divider" />

              <div className="stg-info-row">
                <div className="stg-info-left">
                  <Database size={15} className="stg-info-icon" />
                  <span className="stg-info-label">Database</span>
                </div>
                <span className="stg-info-value">Supabase (PostgreSQL)</span>
                <span className="stg-info-badge stg-info-badge-green">Connected</span>
              </div>

              <div className="stg-divider" />

              <div className="stg-info-row">
                <div className="stg-info-left">
                  <Lock size={15} className="stg-info-icon" />
                  <span className="stg-info-label">Admin Portal</span>
                </div>
                <span className="stg-info-value">Route: /admin — PIN protected</span>
                <span className="stg-info-badge stg-info-badge-pink">Secure</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="stg-save-bar">
            <button className={`stg-save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
              {saved ? (
                <><Check size={18} /> Saved Successfully</>
              ) : (
                <><Save size={18} /> Save Settings</>
              )}
            </button>
            <p className="stg-save-note">
              Note: Feature flags currently require redeployment to take full effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
