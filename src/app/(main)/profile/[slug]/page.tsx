'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft, Camera, Save, CreditCard, Plus, Trash2,
  Bell, BellOff, Mail, Smartphone, Calendar as CalendarIcon,
  Moon, Sun, Globe, Database, RefreshCw,
  ShieldCheck, Fingerprint, Eye, EyeOff, AlertTriangle,
  ChevronDown, ChevronUp, MessageCircle, Bug, ExternalLink,
  ScanLine, TrendingUp, TrendingDown, Loader2, CheckCircle2,
} from 'lucide-react';

/* ============================== SHARED ============================== */
function SubpageHeader({ title }: { title: string }) {
  return (
    <header className="subpage-header">
      <Link href="/profile" className="icon-btn" style={{ background: 'rgba(0,0,0,0.04)' }}>
        <ArrowLeft size={20} />
      </Link>
      <h1 className="subpage-title">{title}</h1>
      <div style={{ width: 44 }} />
    </header>
  );
}

function ToggleSwitch({ on, onToggle, id }: { on: boolean; onToggle: () => void; id: string }) {
  return (
    <button
      id={id}
      className={`toggle-switch ${on ? 'on' : ''}`}
      onClick={onToggle}
      role="switch"
      aria-checked={on}
    >
      <span className="toggle-knob" />
    </button>
  );
}

/* ============================== EDIT PROFILE ============================== */
function EditProfile() {
  const { user } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [skinType, setSkinType] = useState('');

  // Load profile from Supabase
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || user.email || '');
        setPhone(data.phone || '');
        setDob(data.date_of_birth || '');
        setSkinType(data.skin_type || '');
      } else {
        setEmail(user.email || '');
        setFirstName(user.user_metadata?.first_name || '');
        setLastName(user.user_metadata?.last_name || '');
      }
      setLoading(false);
    };
    load();
  }, [user, supabase]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    setSuccess(false);

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        date_of_birth: dob || null,
        skin_type: skinType || null,
        updated_at: new Date().toISOString(),
      });

    // Also update the auth user metadata so the layout/dashboard see the new name instantly
    await supabase.auth.updateUser({
      data: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  const initials = firstName ? `${firstName[0]}${lastName?.[0] || ''}`.toUpperCase() : 'U';

  if (loading) {
    return (
      <>
        <SubpageHeader title="Edit Profile" />
        <div className="subpage-body" style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <Loader2 size={24} className="spin" style={{ color: 'var(--primary)' }} />
        </div>
      </>
    );
  }

  return (
    <>
      <SubpageHeader title="Edit Profile" />
      <div className="subpage-body">
        {/* Avatar */}
        <div className="edit-avatar-section">
          <div className="edit-avatar">
            <div className="edit-avatar-circle">
              <span>{initials}</span>
            </div>
            <button className="edit-avatar-btn"><Camera size={16} /></button>
          </div>
          <p className="edit-avatar-hint">Tap to change photo</p>
        </div>

        {error && <div className="auth-error" style={{ margin: '0 0 16px' }}>{error}</div>}
        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(76,175,80,0.08)', borderRadius: 10, marginBottom: 16, color: '#2E7D32', fontSize: '0.88rem', fontWeight: 600 }}>
            <CheckCircle2 size={16} /> Profile saved successfully
          </div>
        )}

        {/* Form */}
        <div className="sub-form">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input type="text" className="form-input" placeholder="Enter your first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-input" placeholder="Enter your last name" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-input" placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-input" value={dob} onChange={e => setDob(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Skin Type</label>
            <select className="form-input" value={skinType} onChange={e => setSkinType(e.target.value)}>
              <option value="">Select your skin type</option>
              <option>Normal</option>
              <option>Dry</option>
              <option>Oily</option>
              <option>Combination</option>
              <option>Sensitive</option>
            </select>
          </div>
          <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 8 }} onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 size={18} className="spin" /> Saving…</> : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      </div>
    </>
  );
}


/* ============================== PAYMENT METHODS ============================== */
function PaymentMethods() {
  const cards = [
    { id: 1, brand: 'Visa', last4: '4242', exp: '12/27', isDefault: true },
    { id: 2, brand: 'Mastercard', last4: '8910', exp: '06/26', isDefault: false },
  ];

  return (
    <>
      <SubpageHeader title="Payment Methods" />
      <div className="subpage-body">
        <div className="payment-cards">
          {cards.map((card) => (
            <div key={card.id} className={`payment-card ${card.isDefault ? 'default' : ''}`}>
              <div className="payment-card-top">
                <div className="payment-brand">
                  <CreditCard size={20} />
                  <span>{card.brand}</span>
                </div>
                {card.isDefault && <span className="default-badge">Default</span>}
              </div>
              <div className="payment-number">•••• •••• •••• {card.last4}</div>
              <div className="payment-exp">Expires {card.exp}</div>
              <div className="payment-actions">
                <button className="payment-action-btn">Set as Default</button>
                <button className="payment-action-btn danger"><Trash2 size={14} /> Remove</button>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-outline btn-block btn-lg" style={{ marginTop: 8 }}>
          <Plus size={18} /> Add New Card
        </button>

        <div className="sub-section">
          <h2 className="sub-section-title">Billing Address</h2>
          <div className="sub-form">
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input type="text" className="form-input" placeholder="123 Main Street" />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">City</label>
                <input type="text" className="form-input" placeholder="City" />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Postcode</label>
                <input type="text" className="form-input" placeholder="Postcode" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================== NOTIFICATIONS ============================== */
function Notifications() {
  const [settings, setSettings] = useState({
    push: true, email: true, scanReminders: true,
    appointmentReminders: true, promotions: false, weeklyReport: true,
  });
  const toggle = (key: keyof typeof settings) =>
    setSettings((p) => ({ ...p, [key]: !p[key] }));

  const items = [
    { key: 'push' as const, icon: Smartphone, label: 'Push Notifications', desc: 'Get instant alerts on your device' },
    { key: 'email' as const, icon: Mail, label: 'Email Notifications', desc: 'Receive updates in your inbox' },
    { key: 'scanReminders' as const, icon: ScanLine, label: 'Scan Reminders', desc: 'Weekly reminder to check your skin' },
    { key: 'appointmentReminders' as const, icon: CalendarIcon, label: 'Appointment Reminders', desc: '24h before your consultation' },
    { key: 'weeklyReport' as const, icon: TrendingUp, label: 'Weekly Progress Report', desc: 'Summary of your skin health trends' },
    { key: 'promotions' as const, icon: BellOff, label: 'Promotions & Offers', desc: 'Special deals and new features' },
  ];

  return (
    <>
      <SubpageHeader title="Notifications" />
      <div className="subpage-body">
        <div className="toggle-list">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="toggle-row">
                <div className="toggle-row-left">
                  <div className="toggle-icon-wrap"><Icon size={18} /></div>
                  <div>
                    <div className="toggle-label">{item.label}</div>
                    <div className="toggle-desc">{item.desc}</div>
                  </div>
                </div>
                <ToggleSwitch on={settings[item.key]} onToggle={() => toggle(item.key)} id={`toggle-${item.key}`} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ============================== APP SETTINGS ============================== */
function AppSettings() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <>
      <SubpageHeader title="App Settings" />
      <div className="subpage-body">
        <div className="sub-section">
          <h2 className="sub-section-title">Appearance</h2>
          <div className="toggle-list">
            <div className="toggle-row">
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap">{isDark ? <Moon size={18} /> : <Sun size={18} />}</div>
                <div>
                  <div className="toggle-label">Dark Mode</div>
                  <div className="toggle-desc">{isDark ? 'Switch to light theme' : 'Switch to dark theme'}</div>
                </div>
              </div>
              <ToggleSwitch on={isDark} onToggle={toggleTheme} id="toggle-dark" />
            </div>
            <div className="toggle-row">
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap"><RefreshCw size={18} /></div>
                <div>
                  <div className="toggle-label">Reduced Motion</div>
                  <div className="toggle-desc">Minimize animations</div>
                </div>
              </div>
              <ToggleSwitch on={reducedMotion} onToggle={() => setReducedMotion(!reducedMotion)} id="toggle-motion" />
            </div>
          </div>
        </div>

        <div className="sub-section">
          <h2 className="sub-section-title">General</h2>
          <div className="toggle-list">
            <div className="toggle-row" style={{ cursor: 'pointer' }}>
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap"><Globe size={18} /></div>
                <div>
                  <div className="toggle-label">Language</div>
                  <div className="toggle-desc">English (US)</div>
                </div>
              </div>
              <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="toggle-row" style={{ cursor: 'pointer' }}>
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap"><Database size={18} /></div>
                <div>
                  <div className="toggle-label">Clear Cache</div>
                  <div className="toggle-desc">Free up storage space</div>
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>24 MB</span>
            </div>
          </div>
        </div>

        <p className="sub-version">WBH v1.0.0 · Build 2026.03</p>
      </div>
    </>
  );
}

/* ============================== PRIVACY & SECURITY ============================== */
function PrivacySecurity() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [dataSharing, setDataSharing] = useState(true);

  return (
    <>
      <SubpageHeader title="Privacy & Security" />
      <div className="subpage-body">
        <div className="sub-section">
          <h2 className="sub-section-title">Security</h2>
          <div className="toggle-list">
            <div className="toggle-row">
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap"><ShieldCheck size={18} /></div>
                <div>
                  <div className="toggle-label">Two-Factor Authentication</div>
                  <div className="toggle-desc">Extra layer of security on login</div>
                </div>
              </div>
              <ToggleSwitch on={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} id="toggle-2fa" />
            </div>
            <div className="toggle-row">
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap"><Fingerprint size={18} /></div>
                <div>
                  <div className="toggle-label">Biometric Login</div>
                  <div className="toggle-desc">Use Face ID or fingerprint</div>
                </div>
              </div>
              <ToggleSwitch on={biometric} onToggle={() => setBiometric(!biometric)} id="toggle-bio" />
            </div>
            <div className="toggle-row" style={{ cursor: 'pointer' }}>
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap">{true ? <Eye size={18} /> : <EyeOff size={18} />}</div>
                <div>
                  <div className="toggle-label">Change Password</div>
                  <div className="toggle-desc">Update your account password</div>
                </div>
              </div>
              <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

        <div className="sub-section">
          <h2 className="sub-section-title">Data</h2>
          <div className="toggle-list">
            <div className="toggle-row">
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap"><Database size={18} /></div>
                <div>
                  <div className="toggle-label">Anonymous Data Sharing</div>
                  <div className="toggle-desc">Help improve AI accuracy</div>
                </div>
              </div>
              <ToggleSwitch on={dataSharing} onToggle={() => setDataSharing(!dataSharing)} id="toggle-data" />
            </div>
          </div>
        </div>

        <button className="btn btn-block" style={{ background: '#FFF0F0', color: 'var(--phone-red)', fontWeight: 600, padding: '14px 24px', borderRadius: 'var(--radius-md)', marginTop: 16 }}>
          <AlertTriangle size={16} /> Delete Account
        </button>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
          This action is irreversible. All your data will be permanently removed.
        </p>
      </div>
    </>
  );
}

/* ============================== SCAN HISTORY ============================== */
function ScanHistory() {
  const [scans, setScans] = useState<{
    id: string;
    created_at: string;
    score: number;
    analysis: { detected_conditions?: { condition: string }[] } | null;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/scans');
        if (!res.ok) throw new Error('Failed to load scans');
        const data = await res.json();
        setScans(data);
      } catch (err) {
        console.error(err);
        setError('Could not load scan history. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <SubpageHeader title="Scan History" />
      <div className="subpage-body">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Loader2 size={24} className="spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <AlertTriangle size={32} style={{ color: '#FF9800', marginBottom: 12 }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error}</p>
          </div>
        ) : scans.length === 0 ? (
          <div className="no-data-state">
            <ScanLine size={52} style={{ color: 'var(--primary)', opacity: 0.3, marginBottom: 16 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>No Scans Yet</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
              Take your first AI skin scan to start tracking your skin health over time.
            </p>
            <Link href="/scan" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Start Your First Scan
            </Link>
          </div>
        ) : (
          <div className="history-timeline">
            {scans.map((scan, i) => {
              const prev = scans[i + 1];
              const change = prev ? scan.score - prev.score : 0;
              const d = new Date(scan.created_at);
              const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              const conditions = scan.analysis?.detected_conditions?.map(c => c.condition) || [];

              return (
                <Link href="/analysis" key={scan.id} className="history-entry">
                  <div className="history-entry-dot">
                    <div className={`he-dot ${i === 0 ? 'current' : ''}`} />
                    {i < scans.length - 1 && <div className="he-line" />}
                  </div>
                  <div className="history-entry-content">
                    <div className="he-header">
                      <div>
                        <div className="he-date">{dateStr}</div>
                        <div className="he-time">{timeStr}</div>
                      </div>
                      <div className="he-score-col">
                        <div className="he-score">{scan.score}<span>/100</span></div>
                        {prev && (
                          <div className={`he-change ${change > 0 ? 'up' : change < 0 ? 'down' : ''}`}>
                            {change > 0 ? <TrendingUp size={12} /> : change < 0 ? <TrendingDown size={12} /> : null}
                            {change > 0 ? '+' : ''}{change}
                          </div>
                        )}
                      </div>
                    </div>
                    {conditions.length > 0 && (
                      <div className="he-tags">
                        {conditions.slice(0, 3).map((c) => (
                          <span key={c} className="he-tag">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}


/* ============================== HELP CENTER ============================== */
function HelpCenter() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: 'How accurate is the AI skin analysis?', a: 'Our AI model is trained on thousands of dermatological images and achieves over 90% accuracy for common skin conditions. However, it is not a substitute for professional medical advice.' },
    { q: 'How often should I scan my skin?', a: 'We recommend scanning once a week to track changes over time. Consistent scanning helps the AI provide more accurate trend analysis and personalized recommendations.' },
    { q: 'Is my scan data private?', a: 'Absolutely. All scan images are encrypted and stored securely. We never share your personal health data with third parties without your explicit consent.' },
    { q: 'Can I delete my scan history?', a: 'Yes. Go to Privacy & Security in your profile settings to manage your data. You can delete individual scans or your entire history at any time.' },
    { q: 'How do video consultations work?', a: 'After booking an appointment, you\'ll receive a link to join a secure video call with your dermatologist at the scheduled time. Calls typically last 15-30 minutes.' },
  ];

  return (
    <>
      <SubpageHeader title="Help Center" />
      <div className="subpage-body">
        <div className="sub-section">
          <h2 className="sub-section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-question">
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                {openFaq === i && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sub-section">
          <h2 className="sub-section-title">Contact Us</h2>
          <div className="toggle-list">
            <div className="toggle-row" style={{ cursor: 'pointer' }}>
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap"><MessageCircle size={18} /></div>
                <div>
                  <div className="toggle-label">Live Chat Support</div>
                  <div className="toggle-desc">Available 9 AM – 6 PM</div>
                </div>
              </div>
              <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="toggle-row" style={{ cursor: 'pointer' }}>
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap"><Mail size={18} /></div>
                <div>
                  <div className="toggle-label">Email Support</div>
                  <div className="toggle-desc">support@wbh.com</div>
                </div>
              </div>
              <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="toggle-row" style={{ cursor: 'pointer' }}>
              <div className="toggle-row-left">
                <div className="toggle-icon-wrap"><Bug size={18} /></div>
                <div>
                  <div className="toggle-label">Report a Bug</div>
                  <div className="toggle-desc">Help us improve WBH</div>
                </div>
              </div>
              <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================== MAIN ROUTER ============================== */
const PAGES: Record<string, { component: React.FC; title: string }> = {
  'edit-profile': { component: EditProfile, title: 'Edit Profile' },
  'payment-methods': { component: PaymentMethods, title: 'Payment Methods' },
  'notifications': { component: Notifications, title: 'Notifications' },
  'app-settings': { component: AppSettings, title: 'App Settings' },
  'privacy-security': { component: PrivacySecurity, title: 'Privacy & Security' },
  'scan-history': { component: ScanHistory, title: 'Scan History' },
  'help-center': { component: HelpCenter, title: 'Help Center' },
};

export default function ProfileSubpage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const page = PAGES[slug];

  if (!page) {
    return (
      <div className="subpage-page">
        <SubpageHeader title="Not Found" />
        <div className="subpage-body" style={{ textAlign: 'center', paddingTop: 60 }}>
          <p style={{ fontSize: '1.1rem', marginBottom: 16 }}>This page doesn&apos;t exist.</p>
          <button className="btn btn-primary" onClick={() => router.push('/profile')}>
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const PageComponent = page.component;
  return (
    <div className="subpage-page">
      <PageComponent />
    </div>
  );
}
