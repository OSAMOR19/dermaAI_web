'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ScanLine, Download, Share2, Calendar,
  Droplets, Layers, Shield, Eye, Zap,
  Sparkles, Sun, FlaskConical, Heart,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info
} from 'lucide-react';

/* ---- Static data (simulating scan output) ---- */
const SCORE = 78;

const CONDITIONS = [
  {
    id: 'acne',
    name: 'Acne Vulgaris',
    area: 'Forehead & Chin',
    severity: 'Moderate',
    severityColor: 'orange',
    confidence: 87,
    description: 'Mild-to-moderate comedonal and inflammatory acne concentrated in the T-zone. Predominantly closed comedones with some papules.',
  },
  {
    id: 'darkspots',
    name: 'Hyperpigmentation',
    area: 'Cheeks & Jawline',
    severity: 'Mild',
    severityColor: 'yellow',
    confidence: 92,
    description: 'Post-inflammatory hyperpigmentation likely resulting from previous acne lesions. Superficial melanin deposits detected.',
  },
  {
    id: 'dryness',
    name: 'Dehydration Zones',
    area: 'Perioral & Temples',
    severity: 'Mild',
    severityColor: 'blue',
    confidence: 79,
    description: 'Transepidermal water loss detected in perioral region. Skin barrier function is mildly compromised in these areas.',
  },
];

const METRICS = [
  { label: 'Hydration', value: 72, icon: Droplets, color: '#00B4FA' },
  { label: 'Texture', value: 85, icon: Layers, color: '#FC65D1' },
  { label: 'Barrier', value: 68, icon: Shield, color: '#FF9800' },
  { label: 'Clarity', value: 79, icon: Eye, color: '#4CAF50' },
  { label: 'Elasticity', value: 81, icon: Zap, color: '#A855F7' },
];

const RECOMMENDATIONS = [
  {
    icon: FlaskConical,
    title: 'Gentle BHA Cleanser',
    desc: 'Use a 2% Salicylic Acid cleanser twice daily to unclog pores and reduce comedonal acne.',
    timing: 'Morning & Evening',
    priority: 'high',
  },
  {
    icon: Droplets,
    title: 'Hyaluronic Acid Serum',
    desc: 'Apply a multi-weight hyaluronic acid serum on damp skin to boost hydration levels in dehydrated zones.',
    timing: 'Morning & Evening',
    priority: 'high',
  },
  {
    icon: Sun,
    title: 'SPF 50+ Sunscreen',
    desc: 'Broad-spectrum mineral sunscreen is critical to prevent hyperpigmentation from worsening with UV exposure.',
    timing: 'Every Morning',
    priority: 'high',
  },
  {
    icon: Sparkles,
    title: 'Niacinamide 10%',
    desc: 'A niacinamide + zinc serum helps fade dark spots, regulate sebum, and strengthen the skin barrier.',
    timing: 'Evening',
    priority: 'medium',
  },
  {
    icon: Heart,
    title: 'Ceramide Moisturizer',
    desc: 'A ceramide-rich moisturizer restores the lipid barrier and prevents transepidermal water loss.',
    timing: 'Morning & Evening',
    priority: 'medium',
  },
];

const SCAN_HISTORY = [
  { date: 'Today', score: 78, change: +3 },
  { date: 'Mar 6', score: 75, change: +2 },
  { date: 'Feb 28', score: 73, change: -1 },
  { date: 'Feb 20', score: 74, change: +4 },
];

export default function AnalysisPage() {
  const [expandedCondition, setExpandedCondition] = useState<string | null>('acne');
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanTime, setScanTime] = useState<string>('');

  /* Read captured scan data from sessionStorage */
  useEffect(() => {
    try {
      const img = sessionStorage.getItem('dermaai_scan_image');
      const time = sessionStorage.getItem('dermaai_scan_time');
      if (img) setScanImage(img);
      const d = time ? new Date(time) : new Date();
      setScanTime(d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    } catch {
      setScanTime(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' · ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));
    }
  }, []);

  const circumference = 2 * Math.PI * 54; // r=54 for our ring
  const offset = circumference - (SCORE / 100) * circumference;

  const getScoreLabel = (s: number) => {
    if (s >= 85) return { text: 'Excellent', color: '#4CAF50' };
    if (s >= 70) return { text: 'Good', color: '#00B4FA' };
    if (s >= 50) return { text: 'Fair', color: '#FF9800' };
    return { text: 'Needs Attention', color: '#E53935' };
  };

  const scoreInfo = getScoreLabel(SCORE);

  return (
    <div className="results-page">
      {/* ---- Header ---- */}
      <header className="results-header">
        <Link href="/dashboard" className="icon-btn" style={{ background: 'rgba(0,0,0,0.04)' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="results-title">Analysis Results</h1>
          <p className="results-date">{scanTime}</p>
        </div>
        <button className="icon-btn" style={{ background: 'rgba(0,0,0,0.04)' }}>
          <Share2 size={18} />
        </button>
      </header>

      {/* ---- Captured Scan Image ---- */}
      {scanImage && (
        <div className="scan-capture-card">
          <img src={scanImage} alt="Your scan" className="scan-capture-img" />
          <div className="scan-capture-label">
            <ScanLine size={14} /> Your Scan
          </div>
        </div>
      )}

      {/* ---- Score Ring ---- */}
      <section className="score-section">
        <div className="score-ring-wrapper">
          <svg className="score-ring-svg" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FC65D1" />
                <stop offset="100%" stopColor="#00B4FA" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="54" className="score-ring-bg" />
            <circle
              cx="60" cy="60" r="54"
              className="score-ring-fill"
              stroke="url(#scoreGrad)"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="score-ring-text">
            <span className="score-ring-number">{SCORE}</span>
            <span className="score-ring-of">/100</span>
          </div>
        </div>
        <div className="score-info">
          <span className="score-label" style={{ color: scoreInfo.color }}>{scoreInfo.text}</span>
          <p className="score-summary">Your skin health is good overall with a few areas that need targeted care.</p>
        </div>
      </section>

      {/* ---- Detected Conditions ---- */}
      <section className="results-section">
        <h2 className="section-label">
          <AlertTriangle size={16} />
          Detected Conditions
        </h2>
        <div className="conditions-list">
          {CONDITIONS.map((c) => {
            const isOpen = expandedCondition === c.id;
            return (
              <div
                key={c.id}
                className={`condition-card ${isOpen ? 'open' : ''}`}
                onClick={() => setExpandedCondition(isOpen ? null : c.id)}
              >
                <div className="condition-top">
                  <div>
                    <div className="condition-name">{c.name}</div>
                    <div className="condition-area">{c.area}</div>
                  </div>
                  <div className="condition-right">
                    <span className={`severity-badge ${c.severityColor}`}>{c.severity}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
                {isOpen && (
                  <div className="condition-detail">
                    <p>{c.description}</p>
                    <div className="confidence-row">
                      <span>AI Confidence</span>
                      <div className="confidence-bar">
                        <div style={{ width: `${c.confidence}%` }} />
                      </div>
                      <span className="confidence-val">{c.confidence}%</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- Metrics Breakdown ---- */}
      <section className="results-section">
        <h2 className="section-label">
          <Layers size={16} />
          Skin Metrics
        </h2>
        <div className="metrics-card">
          {METRICS.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="metric-row">
                <div className="metric-label">
                  <Icon size={16} style={{ color: m.color }} />
                  <span>{m.label}</span>
                </div>
                <div className="metric-bar-wrap">
                  <div className="metric-bar">
                    <div
                      className="metric-bar-fill"
                      style={{ width: `${m.value}%`, background: m.color }}
                    />
                  </div>
                  <span className="metric-val" style={{ color: m.color }}>{m.value}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- AI Recommendations ---- */}
      <section className="results-section">
        <h2 className="section-label">
          <Sparkles size={16} />
          AI Recommendations
        </h2>
        <div className="rec-list">
          {RECOMMENDATIONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <div key={i} className={`rec-card priority-${r.priority}`}>
                <div className="rec-icon-wrap">
                  <Icon size={22} />
                </div>
                <div className="rec-body">
                  <div className="rec-top">
                    <h3>{r.title}</h3>
                    <span className={`priority-tag ${r.priority}`}>
                      {r.priority === 'high' ? 'Essential' : 'Recommended'}
                    </span>
                  </div>
                  <p>{r.desc}</p>
                  <div className="rec-timing">🕐 {r.timing}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- Scan History ---- */}
      <section className="results-section">
        <h2 className="section-label">
          <CheckCircle2 size={16} />
          Progress Tracker
        </h2>
        <div className="history-card">
          <div className="history-grid">
            {SCAN_HISTORY.map((h, i) => (
              <div key={i} className={`history-item ${i === 0 ? 'current' : ''}`}>
                <div className="history-score">{h.score}</div>
                <div className="history-bar-col">
                  <div className="history-bar" style={{ height: `${h.score}%` }} />
                </div>
                <div className="history-date">{h.date}</div>
                <div className={`history-change ${h.change >= 0 ? 'up' : 'down'}`}>
                  {h.change >= 0 ? '+' : ''}{h.change}
                </div>
              </div>
            ))}
          </div>
          <div className="history-insight">
            <Info size={14} />
            <span>Your skin health has improved <strong>+4 points</strong> over the last 3 weeks</span>
          </div>
        </div>
      </section>

      {/* ---- Action Bar ---- */}
      <div className="results-actions">
        <button className="action-btn secondary">
          <Download size={18} />
          <span>Report</span>
        </button>
        <Link href="/scan" className="action-btn primary">
          <ScanLine size={18} />
          <span>Scan Again</span>
        </Link>
        <Link href="/booking" className="action-btn secondary">
          <Calendar size={18} />
          <span>Book Dr.</span>
        </Link>
      </div>
    </div>
  );
}
