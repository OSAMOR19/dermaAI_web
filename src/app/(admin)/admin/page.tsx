'use client';

import { useState, useEffect } from 'react';
import AdminOverviewClient from './AdminOverviewClient';
import { Shield, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if already authenticated
  useEffect(() => {
    const stored = sessionStorage.getItem('wbh_admin_auth');
    if (stored === 'true') setAuthed(true);
    setChecking(false);
  }, []);

  const handleVerify = async () => {
    if (!pin.trim()) { setError('Please enter the admin PIN'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        sessionStorage.setItem('wbh_admin_auth', 'true');
        setAuthed(true);
      } else {
        setError('Incorrect PIN. Access denied.');
        setPin('');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0D1117' }}>
        <div className="admin-spinner" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-pin-page">
        <div className="admin-pin-card">
          <div className="admin-pin-icon">
            <Shield size={32} />
          </div>
          <h1>Admin Access</h1>
          <p>Enter the secret PIN to access the WBH admin dashboard. Unauthorised access is prohibited.</p>
          
          {error && (
            <div className="admin-pin-error">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div className="admin-pin-input-wrap">
            <Lock size={16} className="admin-pin-lock-icon" />
            <input
              type={showPin ? 'text' : 'password'}
              placeholder="Enter Admin PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              autoFocus
              className="admin-pin-input"
            />
            <button className="admin-pin-eye" onClick={() => setShowPin(!showPin)}>
              {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button className="admin-pin-btn" onClick={handleVerify} disabled={loading}>
            {loading ? 'Verifying…' : 'Access Dashboard'}
          </button>

          <p className="admin-pin-footer">
            <Lock size={11} /> Protected by WBH Security
          </p>
        </div>
      </div>
    );
  }

  return <AdminOverviewClient />;
}
