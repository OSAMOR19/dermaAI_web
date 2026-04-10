'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-header">
            <img src="/images/wbhlogo.svg" alt="WBH" className="auth-logo-img" />
            <CheckCircle2 size={48} style={{ color: 'var(--green)', marginBottom: 8 }} />
            <h1>Email Sent</h1>
            <p>We&apos;ve sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.</p>
          </div>
          <div className="auth-form" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Didn&apos;t receive it? Check your spam folder or try again.
            </p>
            <button className="btn btn-outline btn-block" onClick={() => { setSuccess(false); setEmail(''); }}>
              Send Again
            </button>
          </div>
          <div className="auth-footer">
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 600 }}>
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
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
          <h1>Forgot Password</h1>
          <p>Enter your email and we&apos;ll send you a reset link</p>
        </div>
        <form className="auth-form" onSubmit={handleReset}>
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input has-icon"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <><Loader2 size={18} className="spin" /> Sending…</> : 'Send Reset Link'}
          </button>
        </form>
        <div className="auth-footer">
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
