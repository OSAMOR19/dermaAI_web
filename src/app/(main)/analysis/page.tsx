'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ScanLine, Download, Share2, Calendar,
  Sparkles, Sun, FlaskConical, Heart, Droplets,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info,
  ShieldAlert, Eye, ShoppingBag, ArrowRight
} from 'lucide-react';

/* ---- Types ---- */
interface DetectedCondition {
  condition: string;
  confidence: number;
  observations: string[];
  severity: 'Mild' | 'Moderate' | 'Severe' | string;
  clinical_explanation?: string;
  active_ingredients?: string[];
}

interface GeminiAnalysis {
  image_quality: string;
  detected_conditions: DetectedCondition[];
  skin_type_estimate: string;
  recommendations: string[];
  warning_signs: string[];
  disclaimer: string;
}

interface RecommendedProduct {
  name: string;
  category: string;
  image: string;
  link: string;
  reason: string;
}

interface Recommendation {
  issue: string;
  skin_type: string;
  summary: string;
  routine: { morning: string[]; evening: string[] };
  recommended_products: RecommendedProduct[];
  avoid: string[];
  primary_concerns: string[];
  secondary_concerns: string[];
}

/* ---- Helpers ---- */
function severityColor(s: string): string {
  if (s.toLowerCase() === 'severe') return 'red';
  if (s.toLowerCase() === 'moderate') return 'orange';
  return 'yellow';
}

function computeScore(conditions: DetectedCondition[]): number {
  if (!conditions.length) return 95;
  let penalty = 0;
  for (const c of conditions) {
    const sevWeight = c.severity === 'high' ? 1.5 : c.severity === 'moderate' ? 1.0 : 0.5;
    penalty += (c.confidence / 100) * sevWeight * 25;
  }
  return Math.max(5, Math.min(95, Math.round(100 - penalty)));
}

function getScoreLabel(s: number) {
  if (s >= 85) return { text: 'Excellent', color: '#4CAF50' };
  if (s >= 70) return { text: 'Good', color: '#00B4FA' };
  if (s >= 50) return { text: 'Fair', color: '#FF9800' };
  if (s >= 30) return { text: 'Needs Attention', color: '#E53935' };
  return { text: 'Severe Concern', color: '#B71C1C' };
}

function getScoreSummary(score: number, conditions: DetectedCondition[]): string {
  if (score >= 85) return 'Your skin appears healthy! Keep up your current skincare routine.';
  if (score >= 70) return 'Your skin health is good overall with a few areas that may need targeted care.';
  if (score >= 50) return 'Some skin concerns were detected. Consider consulting a dermatologist for personalized advice.';
  if (score >= 30) return 'Multiple skin concerns were identified. We strongly recommend seeing a dermatologist.';
  return `${conditions.length} significant skin condition${conditions.length > 1 ? 's' : ''} detected. Please consult a dermatologist as soon as possible.`;
}

/* ---- Static fallback recommendations ---- */
const FALLBACK_RECOMMENDATIONS = [
  {
    icon: FlaskConical,
    title: 'Gentle Cleanser',
    desc: 'Use a gentle, pH-balanced cleanser twice daily to maintain skin health.',
    timing: 'Morning & Evening',
    priority: 'high',
  },
  {
    icon: Droplets,
    title: 'Hyaluronic Acid Serum',
    desc: 'Apply a hyaluronic acid serum on damp skin to boost hydration.',
    timing: 'Morning & Evening',
    priority: 'high',
  },
  {
    icon: Sun,
    title: 'SPF 50+ Sunscreen',
    desc: 'Broad-spectrum sunscreen is critical to protect skin and prevent further damage.',
    timing: 'Every Morning',
    priority: 'high',
  },
  {
    icon: Sparkles,
    title: 'Niacinamide 10%',
    desc: 'Niacinamide helps strengthen the skin barrier, fade marks, and regulate sebum.',
    timing: 'Evening',
    priority: 'medium',
  },
  {
    icon: Heart,
    title: 'Ceramide Moisturizer',
    desc: 'A ceramide-rich moisturizer restores the lipid barrier and prevents water loss.',
    timing: 'Morning & Evening',
    priority: 'medium',
  },
];

// SCAN_HISTORY removed

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [score, setScore] = useState(0);
  const [expandedCondition, setExpandedCondition] = useState<number | null>(null);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanTime, setScanTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [recLoading, setRecLoading] = useState(false);

  /* Read analysis data from sessionStorage */
  useEffect(() => {
    try {
      const img = sessionStorage.getItem('wbh_scan_image');
      const time = sessionStorage.getItem('wbh_scan_time');
      if (img) setScanImage(img);
      const d = time ? new Date(time) : new Date();
      setScanTime(
        d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
        ' · ' +
        d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      );

      const raw = sessionStorage.getItem('wbh_analysis');
      if (!raw) {
        setNoData(true);
        setLoading(false);
        return;
      }

      const parsed: GeminiAnalysis = JSON.parse(raw);
      setAnalysis(parsed);
      const s = computeScore(parsed.detected_conditions || []);
      setScore(s);
      if (parsed.detected_conditions?.length > 0) setExpandedCondition(0);
    } catch {
      setNoData(true);
    } finally {
      setLoading(false);
    }
  }, []);

  /* Fetch product recommendations when analysis is loaded */
  useEffect(() => {
    if (!analysis) return;
    const fetchRecs = async () => {
      setRecLoading(true);
      try {
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analysis),
        });
        if (res.ok) {
          const data: Recommendation = await res.json();
          setRecommendation(data);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      } finally {
        setRecLoading(false);
      }
    };
    fetchRecs();
  }, [analysis]);

  const conditions = analysis?.detected_conditions || [];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const scoreInfo = getScoreLabel(score);

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div className="results-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="scn-loading-spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ opacity: 0.6 }}>Loading analysis…</p>
        </div>
      </div>
    );
  }

  /* ---- No data fallback ---- */
  if (noData) {
    return (
      <div className="results-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '85vh' }}>
        <div style={{ textAlign: 'center', padding: '0 32px', maxWidth: 360 }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(252,101,209,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ScanLine size={48} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12, color: 'var(--text)' }}>No Analysis Data</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.95rem', lineHeight: 1.65 }}>
            It looks like you haven&apos;t scanned yet. Take a scan first to see your personalised skin analysis and product recommendations.
          </p>
          <Link href="/scan" className="btn btn-primary btn-lg btn-block">
            <ScanLine size={20} />
            Start Scan
          </Link>
        </div>
      </div>
    );
  }


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

      {/* ---- Image Quality Warning ---- */}
      {analysis?.image_quality === 'poor' && (
        <div style={{ margin: '0 16px 12px', padding: '12px 16px', background: 'rgba(255,152,0,0.1)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
          <AlertTriangle size={18} style={{ color: '#FF9800', flexShrink: 0 }} />
          <p style={{ fontSize: '0.85rem', color: '#FF9800', margin: 0 }}>
            Image quality is poor. Results may be less accurate. Try scanning again with better lighting.
          </p>
        </div>
      )}

      {/* ---- Score Ring Removed ---- */}

      {/* ---- Warning Signs ---- */}
      {analysis?.warning_signs && analysis.warning_signs.length > 0 && (
        <section className="results-section">
          <div style={{ margin: '0 0 12px', padding: '14px 16px', background: 'rgba(229,57,53,0.08)', borderRadius: 14, border: '1px solid rgba(229,57,53,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ShieldAlert size={18} style={{ color: '#E53935' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#E53935' }}>Warning Signs</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {analysis.warning_signs.map((w, i) => (
                <li key={i} style={{ fontSize: '0.85rem', marginBottom: 4, color: '#c62828' }}>{w}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---- Detected Conditions ---- */}
      <section className="results-section">
        <h2 className="section-label">
          <AlertTriangle size={16} />
          Detected Conditions
        </h2>
        {conditions.length === 0 ? (
          <div className="metrics-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <CheckCircle2 size={36} style={{ color: '#4CAF50', marginBottom: 10 }} />
            <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 6 }}>Your skin looks healthy! ✨</p>
            <p style={{ opacity: 0.6, fontSize: '0.85rem', lineHeight: 1.5 }}>Our AI did not detect any significant skin conditions. Keep up your current skincare routine and stay protected from the sun.</p>
          </div>
        ) : (
          <div className="conditions-list">
            {conditions.map((c, idx) => {
              const isOpen = expandedCondition === idx;
              return (
                <div
                  key={idx}
                  className={`condition-card ${isOpen ? 'open' : ''}`}
                  onClick={() => setExpandedCondition(isOpen ? null : idx)}
                >
                  <div className="condition-top">
                    <div>
                      <div className="condition-name" style={{ textTransform: 'capitalize' }}>{c.condition}</div>
                      <div className="condition-area">{c.severity} severity</div>
                    </div>
                    <div className="condition-right">
                      <span className={`severity-badge ${severityColor(c.severity)}`} style={{ textTransform: 'uppercase' }}>{c.severity}</span>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="condition-detail">
                      {/* Clinical Explanation */}
                      {c.clinical_explanation && (
                         <div style={{ marginBottom: 12 }}>
                           <p style={{ fontSize: '0.88rem', lineHeight: 1.5, color: 'var(--text-secondary)', margin: 0 }}>
                             {c.clinical_explanation}
                           </p>
                         </div>
                      )}
                      
                      {/* Active Ingredients */}
                      {c.active_ingredients && c.active_ingredients.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, opacity: 0.7 }}>
                            <FlaskConical size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            To Treat
                          </p>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {c.active_ingredients.map((ing, ii) => (
                              <span key={ii} style={{ background: 'rgba(252,101,209,0.1)', color: 'var(--primary)', padding: '3px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600 }}>{ing}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Observations */}
                      {c.observations && c.observations.length > 0 && (
                        <div style={{ marginBottom: 12 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: 6, opacity: 0.7 }}>
                            <Eye size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            Visual Observations
                          </p>
                          <ul style={{ margin: 0, paddingLeft: 18 }}>
                            {c.observations.map((obs, oi) => (
                              <li key={oi} style={{ fontSize: '0.85rem', marginBottom: 3 }}>{obs}</li>
                            ))}
                          </ul>
                        </div>
                      )}
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
        )}
      </section>



      {/* ---- Recommended Products ---- */}
      <section className="results-section">
        <h2 className="section-label">
          <ShoppingBag size={16} />
          Recommended Products
        </h2>

        {recLoading ? (
          <div className="prod-loading">
            <div className="scn-loading-spinner" style={{ width: 28, height: 28 }} />
            <p style={{ fontSize: '0.85rem', opacity: 0.5, marginTop: 10 }}>Finding the best products for your skin…</p>
          </div>
        ) : recommendation ? (
          <>
            {/* Summary */}
            {recommendation.summary && (
              <div className="prod-summary">
                <Sparkles size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <p>{recommendation.summary}</p>
              </div>
            )}

            {/* Morning & Evening Routine removed */}

            {/* Product Cards */}
            {recommendation.recommended_products.length > 0 ? (
              <div className="prod-grid">
                {recommendation.recommended_products.map((p, i) => (
                  <a key={i} href={p.link || '#'} target="_blank" rel="noopener noreferrer" className="prod-card" style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="prod-card-img" style={{ background: '#fff', overflow: 'hidden' }}>
                      {p.image ? (
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <ShoppingBag size={28} />
                      )}
                    </div>
                    <div className="prod-card-body">
                      <span className="prod-category">{p.category}</span>
                      <h4 className="prod-name">{p.name}</h4>
                      <p className="prod-reason">{p.reason}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="metrics-card" style={{ textAlign: 'center', padding: 20 }}>
                <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>No specific products matched. Check back after your next scan.</p>
              </div>
            )}

            {/* Avoid List removed */}
          </>
        ) : (
          <div className="metrics-card" style={{ textAlign: 'center', padding: 20 }}>
            <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>Product recommendations will appear here after your scan.</p>
          </div>
        )}
      </section>

      {/* ---- Scan History removed ---- */}

      {/* ---- Disclaimer ---- */}
      {analysis?.disclaimer && (
        <div style={{ margin: '0 16px 16px', padding: '12px 16px', background: 'rgba(0,0,0,0.03)', borderRadius: 12 }}>
          <p style={{ fontSize: '0.78rem', opacity: 0.5, margin: 0, lineHeight: 1.5, textAlign: 'center' }}>
            <Info size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            {analysis.disclaimer}
          </p>
        </div>
      )}

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
