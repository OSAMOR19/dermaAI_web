'use client';

import { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const consent = localStorage.getItem('wbh_cookie_consent');
    if (!consent) {
      // Delay display slightly for better entry UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('wbh_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('wbh_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="cookie-banner-wrapper">
      <div className="cookie-banner-content">
        <div className="cookie-banner-header">
          <div className="cookie-banner-icon">
            <Shield size={18} />
          </div>
          <h4>Cookie Consent &amp; Privacy Notice</h4>
          <button className="cookie-close-btn" onClick={handleDecline} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <p className="cookie-banner-text">
          Wholesale Beauty Hub (WBH) uses cookies to optimize your platform experience, analyze website traffic, and enable personalized AI skin diagnostic features. By clicking <strong>&ldquo;Accept All&rdquo;</strong>, you consent to our use of cookies, tracking technologies, and the processing of skin scan images for AI-driven recommendations. Read our <a href="https://wholesalebeautyhub.co.uk" target="_blank" rel="noopener noreferrer">Privacy Policy</a> to learn more.
        </p>
        <div className="cookie-banner-actions">
          <button className="cookie-btn-secondary" onClick={handleDecline}>
            Decline
          </button>
          <button className="cookie-btn-primary" onClick={handleAccept}>
            Accept All
          </button>
        </div>
      </div>

      <style>{`
        .cookie-banner-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 10000;
          max-width: 420px;
          width: calc(100% - 48px);
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(252, 101, 209, 0.2);
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1);
          animation: cookieSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          padding: 24px;
        }

        .cookie-banner-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          position: relative;
        }

        .cookie-banner-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(252, 101, 209, 0.1);
          color: var(--primary, #e84c88);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cookie-banner-header h4 {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #111;
          margin: 0;
          flex: 1;
        }

        .cookie-close-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .cookie-close-btn:hover {
          background: rgba(0, 0, 0, 0.05);
          color: #222;
        }

        .cookie-banner-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          line-height: 1.55;
          color: #4a4a4a;
          margin: 0 0 18px;
        }

        .cookie-banner-text a {
          color: var(--primary, #e84c88);
          text-decoration: none;
          font-weight: 600;
        }

        .cookie-banner-text a:hover {
          text-decoration: underline;
        }

        .cookie-banner-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .cookie-banner-actions button {
          padding: 10px 20px;
          border-radius: 30px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .cookie-btn-primary {
          background: var(--primary, #e84c88);
          color: #fff;
          border: none;
          box-shadow: 0 4px 12px rgba(232, 76, 136, 0.2);
        }

        .cookie-btn-primary:hover {
          background: var(--primary-hover, #d63a74);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(232, 76, 136, 0.3);
        }

        .cookie-btn-secondary {
          background: transparent;
          color: #555;
          border: 1px solid var(--border, #ebebeb);
        }

        .cookie-btn-secondary:hover {
          background: rgba(0, 0, 0, 0.03);
          border-color: #ccc;
        }

        @keyframes cookieSlideUp {
          from {
            opacity: 0;
            transform: translateY(32px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          .cookie-banner-wrapper {
            bottom: 16px;
            right: 16px;
            left: 16px;
            width: auto;
            max-width: none;
            padding: 18px;
          }
          .cookie-banner-actions {
            flex-direction: column;
          }
          .cookie-banner-actions button {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
