'use client';

import { useState, useEffect } from 'react';
import { UserCircle, MapPin, Calendar, Check, X } from 'lucide-react';

const AGE_RANGES = ['16-24', '25-34', '35-44', '45-54', '55+'];
const COUNTRIES = [
  'United Kingdom', 'Nigeria', 'Ghana', 'United States', 'Canada', 'South Africa',
  'Kenya', 'India', 'Australia', 'Germany', 'France', 'Brazil', 'Jamaica', 'Trinidad and Tobago',
  'Sierra Leone', 'Cameroon', 'Uganda', 'Tanzania', 'Zimbabwe', 'Ireland', 'Netherlands',
  'Italy', 'Spain', 'Other',
];

interface ProfileData {
  age_range?: string;
  country?: string;
}

export default function CompleteProfileModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1); // 1 = age, 2 = country
  const [ageRange, setAgeRange] = useState('');
  const [country, setCountry] = useState('');
  const [saving, setSaving] = useState(false);
  const [missing, setMissing] = useState<{ age: boolean; country: boolean }>({ age: false, country: false });

  useEffect(() => {
    const dismissed = sessionStorage.getItem('wbh_profile_dismissed');
    if (dismissed) return;

    fetch('/api/profile')
      .then(r => r.json())
      .then((p: ProfileData) => {
        const noAge = !p.age_range;
        const noCountry = !p.country;
        if (noAge || noCountry) {
          setMissing({ age: noAge, country: noCountry });
          setStep(noAge ? 1 : 2);
          // Small delay so page loads first
          setTimeout(() => setShow(true), 1200);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (step === 1 && !ageRange) return;
    if (step === 2 && !country) return;

    if (step === 1 && missing.country) {
      // Save age, then go to country
      setSaving(true);
      await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age_range: ageRange }),
      });
      setSaving(false);
      setStep(2);
      return;
    }

    // Save whatever is left
    setSaving(true);
    const updates: Record<string, string> = {};
    if (ageRange) updates.age_range = ageRange;
    if (country) updates.country = country;

    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    setShow(false);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('wbh_profile_dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cpm-overlay" onClick={handleDismiss}>
      <div className="cpm-card" onClick={(e) => e.stopPropagation()}>
        <button className="cpm-close" onClick={handleDismiss}><X size={18} /></button>

        <div className="cpm-icon">
          <UserCircle size={28} />
        </div>
        <h2 className="cpm-title">Complete Your Profile</h2>
        <p className="cpm-subtitle">
          {step === 1
            ? 'Help us personalise your skin analysis by telling us your age range.'
            : 'One more thing — where are you based? This helps us recommend relevant products.'}
        </p>

        {/* Step Indicator */}
        {missing.age && missing.country && (
          <div className="cpm-steps">
            <div className={`cpm-step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className="cpm-step-line" />
            <div className={`cpm-step ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>
        )}

        {step === 1 && missing.age && (
          <div className="cpm-field">
            <label><Calendar size={14} /> Age Range</label>
            <div className="cpm-options">
              {AGE_RANGES.map((r) => (
                <button
                  key={r}
                  className={`cpm-option ${ageRange === r ? 'selected' : ''}`}
                  onClick={() => setAgeRange(r)}
                >
                  {ageRange === r && <Check size={14} />} {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="cpm-field">
            <label><MapPin size={14} /> Country</label>
            <select
              className="cpm-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="" disabled>Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        <button
          className="cpm-submit"
          onClick={handleSave}
          disabled={saving || (step === 1 && !ageRange) || (step === 2 && !country)}
        >
          {saving ? 'Saving…' : step === 1 && missing.country ? 'Next' : 'Save & Continue'}
        </button>

        <button className="cpm-skip" onClick={handleDismiss}>
          I'll do this later
        </button>
      </div>

      <style>{`
        .cpm-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.55); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: cpmFadeIn 0.3s ease;
        }
        @keyframes cpmFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .cpm-card {
          background: #fff; border-radius: 24px; padding: 40px 32px 32px;
          max-width: 400px; width: 100%; position: relative; text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
          animation: cpmSlideUp 0.35s ease;
        }
        @keyframes cpmSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .cpm-close {
          position: absolute; top: 16px; right: 16px;
          background: #F5F5F5; border: none; border-radius: 50%; width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center; cursor: pointer; color: #666;
        }
        .cpm-close:hover { background: #E8E8E8; }
        .cpm-icon {
          width: 56px; height: 56px; border-radius: 50%; margin: 0 auto 16px;
          background: rgba(232,76,136,0.1); color: #e84c88;
          display: flex; align-items: center; justify-content: center;
        }
        .cpm-title { font-size: 1.25rem; font-weight: 800; color: #1a1a1a; margin-bottom: 6px; }
        .cpm-subtitle { font-size: 0.85rem; color: #888; line-height: 1.5; margin-bottom: 24px; }
        .cpm-steps { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 24px; }
        .cpm-step {
          width: 28px; height: 28px; border-radius: 50%; font-size: 0.75rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          background: #F0F0F0; color: #999; transition: all 0.2s;
        }
        .cpm-step.active { background: #e84c88; color: #fff; }
        .cpm-step-line { width: 40px; height: 2px; background: #E8E8E8; }
        .cpm-field { text-align: left; margin-bottom: 20px; }
        .cpm-field label {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.78rem; font-weight: 700; color: #555; margin-bottom: 10px;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .cpm-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .cpm-option {
          padding: 10px 8px; border-radius: 10px; border: 1.5px solid #E8E8E8;
          background: #fff; font-size: 0.85rem; font-weight: 600; color: #555;
          cursor: pointer; transition: all 0.2s; display: flex; align-items: center;
          justify-content: center; gap: 4px;
        }
        .cpm-option:hover { border-color: rgba(232,76,136,0.3); background: rgba(232,76,136,0.03); }
        .cpm-option.selected { border-color: #e84c88; background: rgba(232,76,136,0.08); color: #e84c88; font-weight: 700; }
        .cpm-select {
          width: 100%; padding: 12px 16px; border: 1.5px solid #E8E8E8; border-radius: 12px;
          font-size: 0.9rem; font-weight: 600; color: #333; background: #fff;
          cursor: pointer; outline: none; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center;
        }
        .cpm-select:focus { border-color: #e84c88; }
        .cpm-submit {
          width: 100%; padding: 14px; border: none; border-radius: 14px;
          background: linear-gradient(135deg, #e84c88, #d63a74); color: #fff;
          font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(232,76,136,0.25);
        }
        .cpm-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(232,76,136,0.35); }
        .cpm-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .cpm-skip {
          background: none; border: none; color: #999; font-size: 0.82rem; font-weight: 600;
          cursor: pointer; margin-top: 14px; padding: 4px 8px;
        }
        .cpm-skip:hover { color: #666; text-decoration: underline; }
        @media (max-width: 480px) {
          .cpm-card { padding: 32px 20px 24px; }
          .cpm-options { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
