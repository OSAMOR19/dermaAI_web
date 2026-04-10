'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (tokenHash && type === 'recovery') {
      // Exchange the token hash for a valid session
      supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' }).then(({ error }) => {
        if (error) {
          setError('This reset link is invalid or has expired. Please request a new one.');
        }
        setVerifying(false);
      });
    } else {
      // No token provided — user may have arrived here directly
      // Check if they already have an active recovery session
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          setError('No reset token found. Please use the link from your email.');
        }
        setVerifying(false);
      });
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push('/dashboard'), 2500);
  };

  if (verifying) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <img src="/images/wbhlogo.svg" alt="WBH" className="auth-logo-img" />
            <Loader2 size={40} className="spin" style={{ color: 'var(--primary)', marginBottom: 8 }} />
            <h1>Verifying Link…</h1>
            <p>Please wait while we verify your reset link.</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <img src="/images/wbhlogo.svg" alt="WBH" className="auth-logo-img" />
            <CheckCircle2 size={48} style={{ color: 'var(--green)', marginBottom: 8 }} />
            <h1>Password Updated</h1>
            <p>Your password has been successfully reset. Redirecting you to the dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !password) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <img src="/images/wbhlogo.svg" alt="WBH" className="auth-logo-img" />
            <AlertCircle size={48} style={{ color: 'var(--error, #ef4444)', marginBottom: 8 }} />
            <h1>Link Expired</h1>
            <p>{error}</p>
          </div>
          <div className="auth-form" style={{ textAlign: 'center' }}>
            <button className="btn btn-primary btn-block" onClick={() => router.push('/forgot-password')}>
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <img src="/images/wbhlogo.svg" alt="WBH" className="auth-logo-img" />
          <h1>Set New Password</h1>
          <p>Choose a strong password for your account</p>
        </div>
        <form className="auth-form" onSubmit={handleUpdate}>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input has-icon has-right-icon"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <button type="button" className="input-icon-right-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showConfirm ? 'text' : 'password'}
                className="form-input has-icon has-right-icon"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" className="input-icon-right-btn" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <><Loader2 size={18} className="spin" /> Updating…</> : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
