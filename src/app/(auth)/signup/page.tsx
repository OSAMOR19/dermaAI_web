import Link from 'next/link';
import { Mail, Lock, Eye, User } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">DERMA<span>AI</span></div>
          <h1>Create Account</h1>
          <p>Start your AI-powered skin analysis journey</p>
        </div>
        <div className="auth-form">
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">First Name</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input type="text" className="form-input has-icon" placeholder="First name" />
              </div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Last Name</label>
              <input type="text" className="form-input" placeholder="Last name" />
            </div>
          </div>
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
              <input type="password" className="form-input has-icon" placeholder="Create a password" />
              <Eye size={18} className="input-icon-right" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input type="password" className="form-input has-icon" placeholder="Confirm your password" />
            </div>
          </div>
          <label className="form-check" style={{ marginBottom: 20 }}>
            <input type="checkbox" /> I agree to the Terms of Service and Privacy Policy
          </label>
          <Link href="/dashboard">
            <button className="btn btn-primary btn-block btn-lg">Create Account</button>
          </Link>
          <div className="form-divider">or sign up with</div>
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
          Already have an account? <Link href="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
