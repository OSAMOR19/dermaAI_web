'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const WHATSAPP_NUMBER = '447000000000'; // Update with actual WBH WhatsApp number
const WHATSAPP_MESSAGE = encodeURIComponent("Hi! I'd like to learn more about your products.");

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <div className="wa-float-wrap">
        {showTooltip && (
          <div className="wa-tooltip">
            <button className="wa-tooltip-close" onClick={() => setShowTooltip(false)} aria-label="Close">
              <X size={14} />
            </button>
            <p className="wa-tooltip-text">
              <strong>Need help?</strong><br />
              Chat with us on WhatsApp
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-tooltip-btn"
            >
              Start Chat →
            </a>
          </div>
        )}

        <button
          className="wa-float-btn"
          onClick={() => {
            if (showTooltip) {
              window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`, '_blank');
            } else {
              setShowTooltip(true);
            }
          }}
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff">
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.332 22.616c-.39 1.1-1.932 2.012-3.178 2.278-.852.18-1.964.324-5.71-1.228-4.8-1.986-7.886-6.856-8.126-7.174-.23-.318-1.934-2.576-1.934-4.914s1.224-3.486 1.66-3.964c.436-.478.952-.598 1.27-.598.316 0 .632.004.908.016.292.014.684-.11 1.07.816.39.938 1.326 3.238 1.442 3.472.116.234.194.508.04.816-.156.312-.234.506-.468.78-.234.274-.492.612-.702.822-.234.234-.478.488-.204.958s1.218 2.012 2.614 3.26c1.794 1.604 3.306 2.1 3.776 2.334.468.234.742.196 1.016-.118.274-.312 1.178-1.374 1.492-1.846.312-.468.63-.39 1.06-.234.432.158 2.742 1.292 3.21 1.528.468.234.78.352.898.546.116.194.116 1.126-.274 2.23z" />
          </svg>
          <span className="wa-pulse-ring" />
        </button>
      </div>

      <style>{`
        .wa-float-wrap {
          position: fixed; bottom: 28px; right: 28px; z-index: 999;
          display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
        }
        .wa-tooltip {
          background: #fff; border-radius: 16px; padding: 20px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.06);
          max-width: 240px; position: relative;
          animation: waFadeIn 0.3s ease;
        }
        .wa-tooltip::after {
          content: ''; position: absolute; bottom: -8px; right: 24px;
          width: 16px; height: 16px; background: #fff;
          transform: rotate(45deg); box-shadow: 4px 4px 8px rgba(0,0,0,0.04);
        }
        .wa-tooltip-close {
          position: absolute; top: 8px; right: 8px; width: 24px; height: 24px;
          border-radius: 50%; background: rgba(0,0,0,0.05); border: none;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: #999; transition: all 0.2s;
        }
        .wa-tooltip-close:hover { background: rgba(0,0,0,0.1); }
        .wa-tooltip-text {
          font-family: 'DM Sans', sans-serif; font-size: 14px; color: #333;
          line-height: 1.5; margin-bottom: 14px;
        }
        .wa-tooltip-text strong { color: #1a1109; }
        .wa-tooltip-btn {
          display: block; text-align: center; padding: 10px 20px;
          background: #25D366; color: #fff; border-radius: 50px;
          text-decoration: none; font-size: 13px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
        }
        .wa-tooltip-btn:hover { background: #1fb855; transform: translateY(-1px); }

        .wa-float-btn {
          width: 60px; height: 60px; border-radius: 50%;
          background: #25D366; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(37,211,102,0.4);
          transition: all 0.3s ease; position: relative;
        }
        .wa-float-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 28px rgba(37,211,102,0.5);
        }
        .wa-pulse-ring {
          position: absolute; inset: -4px; border-radius: 50%;
          border: 2px solid rgba(37,211,102,0.4);
          animation: waPulse 2s ease-out infinite;
        }

        @keyframes waFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes waPulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }

        @media (max-width: 768px) {
          .wa-float-wrap { bottom: 20px; right: 16px; }
          .wa-float-btn { width: 54px; height: 54px; }
          .wa-tooltip { max-width: 200px; }
        }
      `}</style>
    </>
  );
}
