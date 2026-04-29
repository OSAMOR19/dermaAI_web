'use client';

import { Truck, Globe, Sparkles, ArrowRight, FlaskConical, Brain, Users, HeadsetIcon } from 'lucide-react';

const trustBadges = [
  { icon: <Truck size={18} />, text: 'Next-Day UK Delivery' },
  { icon: <Globe size={18} />, text: 'Worldwide Shipping' },
  { icon: <FlaskConical size={18} />, text: 'Clinical-Grade Products' },
  { icon: <Brain size={18} />, text: 'AI-Personalised Care Plans' },
  { icon: <Users size={18} />, text: 'Wholesale Accounts Available' },
  { icon: <HeadsetIcon size={18} />, text: 'Expert Concierge Support' },
  { icon: <Sparkles size={18} />, text: 'Premium Brands Only' },
];

const steps = [
  {
    num: '01',
    title: 'Scan Your Face',
    desc: 'Upload a selfie or take one in-app. Our AI analyses 14+ skin dimensions — pores, hydration, texture, pigmentation and more.',
  },
  {
    num: '02',
    title: 'Get Your Report',
    desc: 'Receive a detailed clinical diagnosis in under 60 seconds. Each concern is graded with professional accuracy.',
  },
  {
    num: '03',
    title: 'Shop Your Match',
    desc: 'See products precisely matched to your skin profile from our curated range of professional-grade beauty products.',
  },
];

export default function LandingWhyChooseUs() {
  return (
    <section className="landing-wcus">
      {/* Trust bar */}
      <div className="landing-wcus-trust">
        {trustBadges.map((b, i) => (
          <div key={i} className="landing-trust-badge">
            <span className="landing-trust-icon">{b.icon}</span>
            <span className="landing-trust-text">{b.text}</span>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="landing-wcus-inner">
        <div className="landing-wcus-header">
          <span className="landing-section-mono">How It Works</span>
          <h2 className="landing-section-title">
            Three steps to<br /><em>perfect skin</em>
          </h2>
        </div>

        <div className="landing-steps-grid">
          {steps.map((step, i) => (
            <div key={i} className="landing-step-card">
              <span className="landing-step-num">{step.num}</span>
              <h3 className="landing-step-title">{step.title}</h3>
              <p className="landing-step-desc">{step.desc}</p>
              {i < 2 && <ArrowRight size={18} className="landing-step-arrow" />}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .landing-wcus { padding: 0 0 100px; position: relative; }
        .landing-wcus-trust {
          display: flex; justify-content: center; gap: 28px; flex-wrap: wrap;
          padding: 24px 48px; margin-bottom: 80px;
          background: linear-gradient(135deg, #1a1109 0%, #2a1a12 100%);
        }
        .landing-trust-badge {
          display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.85);
          font-size: 13px; letter-spacing: 0.06em; font-family: 'DM Sans', sans-serif;
        }
        .landing-trust-icon { color: #e84c88; display: flex; }
        .landing-trust-text { font-weight: 400; }

        .landing-wcus-inner { max-width: 1100px; margin: 0 auto; padding: 0 40px; }
        .landing-wcus-header { text-align: center; margin-bottom: 64px; }
        .landing-section-mono {
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.25em;
          color: #e84c88; text-transform: uppercase; margin-bottom: 14px; display: block;
        }
        .landing-section-title {
          font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(32px, 4vw, 52px);
          font-weight: 300; line-height: 1.15; color: #1a1109;
        }
        .landing-section-title em { font-style: italic; color: #e84c88; }

        .landing-steps-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
        }
        .landing-step-card {
          background: #fff; border: 1px solid rgba(0,0,0,0.05);
          border-radius: 20px; padding: 44px 36px 40px;
          position: relative; transition: all 0.35s ease;
          box-shadow: 0 2px 16px rgba(0,0,0,0.03);
        }
        .landing-step-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 44px rgba(0,0,0,0.08);
          border-color: rgba(232,76,136,0.15);
        }
        .landing-step-num {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 52px; font-weight: 300; color: rgba(232,76,136,0.35);
          line-height: 1; margin-bottom: 20px; display: block;
        }
        .landing-step-title {
          font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 700;
          color: #1a1109; margin-bottom: 12px;
        }
        .landing-step-desc {
          font-size: 14px; line-height: 1.7; color: #5a4a3a;
          font-family: 'DM Sans', sans-serif;
        }
        .landing-step-arrow {
          position: absolute; right: -20px; top: 50%; transform: translateY(-50%);
          color: rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
          .landing-wcus-trust { flex-direction: column; align-items: center; gap: 14px; padding: 20px 16px; }
          .landing-wcus { padding: 0 0 60px !important; }
          .landing-steps-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .landing-step-card { padding: 32px 24px 28px !important; }
          .landing-step-arrow { display: none; }
          .landing-wcus-inner { padding: 0 20px; }
          .landing-wcus-header { margin-bottom: 40px !important; }
          .landing-section-title { font-size: 28px !important; }
        }
      `}</style>
    </section>
  );
}
