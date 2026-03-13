import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">DERMA<span>AI</span></div>
          <h1>Forgot Password</h1>
          <p>Enter your email and we&apos;ll send you a reset link</p>
        </div>
        <div className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input type="email" className="form-input has-icon" placeholder="Enter your email" />
            </div>
          </div>
          <button className="btn btn-primary btn-block btn-lg">Send Reset Link</button>
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
