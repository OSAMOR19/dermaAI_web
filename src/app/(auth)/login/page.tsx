import Link from 'next/link';
import { Mail, Lock, Eye } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">DERMA<span>AI</span></div>
          <h1>Welcome Back</h1>
          <p>Sign in to continue your skin health journey</p>
        </div>
        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input type="email" className="form-input has-icon" placeholder="Enter your email" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input type="password" className="form-input has-icon" placeholder="Enter your password" />
              <Eye size={18} className="input-icon-right" />
            </div>
          </div>
          <div className="form-row">
            <label className="form-check">
              <input type="checkbox" /> Remember me
            </label>
            <Link href="/forgot-password" className="form-link">Forgot Password?</Link>
          </div>
          <Link href="/dashboard">
            <button className="btn btn-primary btn-block btn-lg">Sign In</button>
          </Link>
          <div className="form-divider">or continue with</div>
          <div className="social-buttons">
            <button className="social-btn">
              <img src="/icons/google.svg" alt="Google" width={20} height={20} /> Google
            </button>
            <button className="social-btn">
              <img src="/icons/apple.svg" alt="Apple" width={20} height={20} /> Apple
            </button>
          </div>
        </div>
        <div className="auth-footer">
          Don&apos;t have an account? <Link href="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
