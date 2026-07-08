'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Hash, Home, Sparkles, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

const AGE_RANGES = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65+'];

const SKIN_CONCERNS = [
  { id: 'hyperpigmentation', label: 'Hyperpigmentation' },
  { id: 'acne', label: 'Acne' },
  { id: 'black_spots', label: 'Black Spots' },
  { id: 'dark_circles', label: 'Dark Circles' },
  { id: 'wrinkles', label: 'Wrinkles & Fine Lines' },
  { id: 'dry_skin', label: 'Dry Skin' },
  { id: 'oily_skin', label: 'Oily Skin' },
  { id: 'eczema', label: 'Eczema' },
];

export default function EventRegistrationPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age_range: '',
    location: '',
    skin_concerns: [] as string[],
    other_concern: '',
  });
  const [hasOther, setHasOther] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleConcern = (id: string) => {
    setFormData(prev => ({
      ...prev,
      skin_concerns: prev.skin_concerns.includes(id)
        ? prev.skin_concerns.filter(c => c !== id)
        : [...prev.skin_concerns, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name.trim()) { setError('Please enter your full name'); return; }
    if (!formData.email.trim()) { setError('Please enter your email address'); return; }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        skin_concerns: formData.skin_concerns.map(id => {
          const concern = SKIN_CONCERNS.find(c => c.id === id);
          return concern ? concern.label : id;
        }),
        other_concern: hasOther ? formData.other_concern : '',
      };

      const res = await fetch('/api/event-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="event-success-card">
            <div className="event-success-icon">
              <CheckCircle size={56} />
            </div>
            <h1>You&apos;re Registered!</h1>
            <p>
              Thank you, <strong>{formData.full_name}</strong>! Your registration with WBH Skin has been confirmed.
            </p>
            <p className="event-success-sub">
              A confirmation email has been sent to <strong>{formData.email}</strong>. Our team will be in touch with further event details.
            </p>
            <div className="event-success-badge">
              <Sparkles size={16} />
              <span>See you at the event!</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <div className="auth-container" style={{ maxWidth: 500 }}>
        <div className="auth-header">
  <img src="/images/wbhlogo.svg" alt="WBH" className="auth-logo-img" />
  <h1 style={{ fontSize: '1.5rem' }}>Consultation Registration</h1>
  <p>Complete your registration to schedule a one-on-one consultation with our skincare specialists.</p>
</div>

        <form className="auth-form" onSubmit={handleSubmit} style={{ padding: '28px 24px' }}>
          {error && (
            <div className="auth-error" style={{ display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name <span style={{ color: 'var(--primary)' }}>*</span></label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className="form-input has-icon"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={(e) => updateField('full_name', e.target.value)}
                required
                id="reg-name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address <span style={{ color: 'var(--primary)' }}>*</span></label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input has-icon"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
                id="reg-email"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                className="form-input has-icon"
                placeholder="e.g. +44 7700 900000"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                id="reg-phone"
              />
            </div>
          </div>

          {/* Age Range */}
          <div className="form-group">
            <label className="form-label">Age Range</label>
            <select
              className="form-input"
              value={formData.age_range}
              onChange={(e) => updateField('age_range', e.target.value)}
              id="reg-age"
              style={{ cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23888\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
            >
              <option value="">Select your age range</option>
              {AGE_RANGES.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label">Location (Major City)</label>
            <div className="input-wrapper">
              <MapPin size={18} className="input-icon" />
              <input
                type="text"
                className="form-input has-icon"
                placeholder="e.g. London"
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
                id="reg-location"
              />
            </div>
          </div>

          {/* Skin Concerns */}
          <div className="form-group">
            <label className="form-label" style={{ marginBottom: 12 }}>
              <Sparkles size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4, color: 'var(--primary)' }} />
              Skin Concerns
            </label>
            <div className="concern-grid">
              {SKIN_CONCERNS.map(concern => (
                <button
                  key={concern.id}
                  type="button"
                  className={`concern-chip ${formData.skin_concerns.includes(concern.id) ? 'active' : ''}`}
                  onClick={() => toggleConcern(concern.id)}
                  id={`concern-${concern.id}`}
                >
                  <span className="concern-check">
                    {formData.skin_concerns.includes(concern.id) ? '✓' : ''}
                  </span>
                  {concern.label}
                </button>
              ))}
              <button
                type="button"
                className={`concern-chip ${hasOther ? 'active' : ''}`}
                onClick={() => setHasOther(!hasOther)}
                id="concern-other"
              >
                <span className="concern-check">
                  {hasOther ? '✓' : ''}
                </span>
                Other
              </button>
            </div>
          </div>

          {/* Other Concern (conditional) */}
          {hasOther && (
            <div className="form-group" style={{ animation: 'pageSlideIn 0.3s ease-out' }}>
              <label className="form-label">Describe Your Skin Concern</label>
              <textarea
                className="form-input"
                placeholder="Please describe your skin concern in detail..."
                value={formData.other_concern}
                onChange={(e) => updateField('other_concern', e.target.value)}
                rows={3}
                id="reg-other-concern"
                style={{ resize: 'vertical', minHeight: 80 }}
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            id="reg-submit"
            style={{ marginTop: 8 }}
          >
            {loading ? (
              <><Loader2 size={18} className="spin" /> Submitting...</>
            ) : (
              <><Sparkles size={18} /> Register Now</>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 16, lineHeight: 1.5 }}>
            By registering, you agree to receive communications from WBH Skin regarding this event.
          </p>
        </form>
      </div>
    </div>
  );
}
