'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Show auth error from OAuth callback
  const authError = searchParams.get('error');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <img src="/images/wbhlogo.svg" alt="WBH" className="auth-logo-img" />
          <h1>Welcome Back</h1>
          <p>Sign in to continue your skin health journey</p>
        </div>
        <form className="auth-form" onSubmit={handleLogin}>
          {(error || authError) && (
            <div className="auth-error">
              {error || 'Authentication failed. Please try again.'}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email</label>
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
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input has-icon has-right-icon"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-icon-right-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="form-row">
            <label className="form-check">
              <input type="checkbox" /> Remember me
            </label>
            <Link href="/forgot-password" className="form-link">Forgot Password?</Link>
          </div>
          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
            {loading ? <><Loader2 size={18} className="spin" /> Signing in…</> : 'Sign In'}
          </button>
          <div className="form-divider">or continue with</div>
          <div className="social-buttons">
            <button type="button" className="social-btn" onClick={() => handleOAuth('google')}>
              <img src="/icons/google.svg" alt="Google" width={20} height={20} /> Google
            </button>
            <button type="button" className="social-btn" onClick={() => handleOAuth('apple')}>
              <img src="/icons/apple.svg" alt="Apple" width={20} height={20} /> Apple
            </button>
          </div>
        </form>
        <div className="auth-footer">
          Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
