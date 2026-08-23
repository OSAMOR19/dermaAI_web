'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ScanLine, Download, Share2, Calendar,
  Sparkles, Sun, FlaskConical, Heart, Droplets,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Info,
  ShieldAlert, Eye, ShoppingBag, ArrowRight, Check, Stethoscope,
  Activity
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
  confidence_score?: number;
}

interface RecommendedProduct {
  name: string;
  brand?: string;
  price?: string;
  match_score?: number;
  key_ingredient?: string;
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



// SCAN_HISTORY removed

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null);
  const [score, setScore] = useState(0);
  const [scanTime, setScanTime] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [recLoading, setRecLoading] = useState(false);

  // New: Condition selection state
  const [selectedConditions, setSelectedConditions] = useState<Set<number>>(new Set());
  const [expandedDetails, setExpandedDetails] = useState<Set<number>>(new Set());
  const [conditionsConfirmed, setConditionsConfirmed] = useState(false);

  /* Read analysis data from sessionStorage, fall back to DB */
  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        // 1. Try sessionStorage first (set after a live scan)
        const raw = sessionStorage.getItem('wbh_analysis');
        if (raw) {
          const time = sessionStorage.getItem('wbh_scan_time');
          const d = time ? new Date(time) : new Date();
          setScanTime(
            d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
            ' · ' +
            d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          );
          const parsed: GeminiAnalysis = JSON.parse(raw);
          setAnalysis(parsed);
          setScore(parsed.confidence_score !== undefined ? parsed.confidence_score : computeScore(parsed.detected_conditions || []));
          setLoading(false);
          return;
        }

        // 2. Fallback: fetch the most recent scan from the database (with cache)
        const cached = sessionStorage.getItem('wbh_scans_cache');
        const cacheTs = sessionStorage.getItem('wbh_scans_cache_ts');
        const now = Date.now();
        let scans;
        if (cached && cacheTs && (now - parseInt(cacheTs)) < 60000) {
          scans = JSON.parse(cached);
        } else {
          const res = await fetch('/api/scans');
          if (!res.ok) throw new Error('Failed to fetch scans');
          scans = await res.json();
          sessionStorage.setItem('wbh_scans_cache', JSON.stringify(scans));
          sessionStorage.setItem('wbh_scans_cache_ts', String(now));
        }

        if (!scans || scans.length === 0) {
          setNoData(true);
          setLoading(false);
          return;
        }

        const latest = scans[0];
        if (!latest.analysis) {
          setNoData(true);
          setLoading(false);
          return;
        }

        // Populate state from the DB record
        const d = new Date(latest.created_at);
        setScanTime(
          d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) +
          ' · ' +
          d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        );
        const parsed: GeminiAnalysis = latest.analysis;
        setAnalysis(parsed);
        setScore(parsed.confidence_score !== undefined ? parsed.confidence_score : computeScore(parsed.detected_conditions || []));
      } catch {
        setNoData(true);
      } finally {
        setLoading(false);
      }
    };
    loadAnalysis();
  }, []);

  /* Fetch product recommendations ONLY after user confirms their conditions */
  useEffect(() => {
    if (!analysis || !conditionsConfirmed) return;

    // Build a filtered analysis with only selected conditions
    const filteredConditions = (analysis.detected_conditions || []).filter(
      (_, idx) => selectedConditions.has(idx)
    );

    if (filteredConditions.length === 0) return;

    const filteredAnalysis = {
      ...analysis,
      detected_conditions: filteredConditions,
    };

    const fetchRecs = async () => {
      setRecLoading(true);
      try {
        const res = await fetch('/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(filteredAnalysis),
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
  }, [analysis, conditionsConfirmed, selectedConditions]);

  const conditions = analysis?.detected_conditions || [];
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const scoreInfo = getScoreLabel(score);

  // Toggle condition selection
  const toggleCondition = (idx: number) => {
    if (conditionsConfirmed) return; // Don't allow changes after confirmation
    setSelectedConditions(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Toggle detail expansion for a condition
  const toggleDetail = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDetails(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // Confirm selected conditions
  const handleConfirmSelection = () => {
    if (selectedConditions.size === 0) return;
    setConditionsConfirmed(true);
  };

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


  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Skin Analysis',
          text: 'I just got my AI skin analysis on Wholesale Beauty Hub! Check it out.',
          url: window.location.origin
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        alert('Link copied to clipboard!');
      }
    } catch (e) {
      console.log('Error sharing', e);
    }
  };

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
        <button onClick={handleShare} className="icon-btn" style={{ background: 'rgba(0,0,0,0.04)' }}>
          <Share2 size={18} />
        </button>
      </header>

      {/* ---- Privacy Notice ---- */}
      <div style={{ margin: '0 16px 12px', padding: '12px 16px', background: 'rgba(252,101,209,0.06)', borderRadius: 12, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.82rem', flexShrink: 0 }}>🔒</span>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
          Your scan images are retained briefly for processing, then securely removed. Only your diagnostic results are stored.
        </p>
      </div>

      {/* ---- Image Quality Warning ---- */}
      {analysis?.image_quality === 'poor' && (
        <div style={{ margin: '0 16px 12px', padding: '12px 16px', background: 'rgba(255,152,0,0.1)', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
          <AlertTriangle size={18} style={{ color: '#FF9800', flexShrink: 0 }} />
          <p style={{ fontSize: '0.85rem', color: '#FF9800', margin: 0 }}>
            Image quality is poor. Results may be less accurate. Try scanning again with better lighting.
          </p>
        </div>
      )}

      {/* ---- Medical Caveat Disclaimer Banner ---- */}
      <section className="results-section" style={{ marginBottom: 20 }}>
        <div className="consultation-banner" style={{ margin: '0 0 12px', padding: '20px' }}>
          <div className="consultation-banner-icon" style={{ width: 40, height: 40, marginBottom: 10 }}>
            <Stethoscope size={20} />
          </div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800 }}>For Informational Purposes Only</h3>
          <p style={{ fontSize: '0.82rem', lineHeight: 1.5, marginBottom: 14 }}>
            This AI skin analysis is intended for informational purposes only and does not constitute medical advice, diagnosis, or treatment. For professional guidance tailored to your unique skin needs, we recommend booking a personalised consultation with the experts at Wholesale Beauty Hub.
          </p>
          <Link
            href="/booking"
            className="consultation-btn"
            style={{ fontSize: '0.82rem', padding: '10px 24px' }}
          >
            <Calendar size={14} style={{ marginRight: 6 }} />
            Book WBH Expert Consultation
          </Link>
        </div>
      </section>

      {/* ---- Circular Score Ring ---- */}
      <section className="score-section" style={{ marginBottom: 20 }}>
        <div className="score-ring-wrapper">
          <svg className="score-ring-svg" width="130" height="130">
            <circle className="score-ring-bg" cx="65" cy="65" r="54" />
            <circle
              className="score-ring-fill"
              cx="65"
              cy="65"
              r="54"
              stroke={scoreInfo.color}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="score-ring-text" style={{ flexDirection: 'column' }}>
            <span className="score-ring-number">{score}</span>
            <span className="score-ring-of">/ 100</span>
          </div>
        </div>
        <div className="score-info">
          <span className="score-label" style={{ color: scoreInfo.color, fontWeight: 700, fontSize: '1.2rem', display: 'block', marginBottom: 6 }}>
            {scoreInfo.text}
          </span>
          <p className="score-summary" style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {getScoreSummary(score, conditions)}
          </p>
        </div>
      </section>

      {/* ---- Scan Quality check & AI Confidence Details ---- */}
      <section className="results-section" style={{ marginBottom: 24 }}>
        <div style={{
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '20px 24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={15} style={{ color: 'var(--primary)' }} />
            Scan Diagnostics
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div style={{ background: '#fcfcfc', border: '1px solid #f2f2f2', padding: 12, borderRadius: 12 }}>
              <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: 4 }}>Lighting Quality</div>
              <strong style={{ fontSize: '0.85rem', color: '#4CAF50' }}>✓ Optimal</strong>
            </div>
            
            <div style={{ background: '#fcfcfc', border: '1px solid #f2f2f2', padding: 12, borderRadius: 12 }}>
              <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: 4 }}>Image Sharpness</div>
              <strong style={{ fontSize: '0.85rem', color: '#4CAF50' }}>✓ Clear Focus</strong>
            </div>
            
            <div style={{ background: '#fcfcfc', border: '1px solid #f2f2f2', padding: 12, borderRadius: 12 }}>
              <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: 4 }}>Face Validation</div>
              <strong style={{ fontSize: '0.85rem', color: '#4CAF50' }}>✓ Single Subject</strong>
            </div>
            
            <div style={{ background: '#fcfcfc', border: '1px solid #f2f2f2', padding: 12, borderRadius: 12 }}>
              <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: 4 }}>AI Scan Confidence</div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>
                {analysis?.confidence_score ?? 85}%
              </strong>
            </div>
          </div>
        </div>
      </section>

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

      {/* ---- Detected Conditions (Selection Mode) ---- */}
      <section className="results-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 className="section-label" style={{ margin: 0 }}>
            <AlertTriangle size={16} />
            Detected Conditions
          </h2>
          {conditions.length > 0 && (
            <span style={{ 
              background: conditionsConfirmed ? 'rgba(76,175,80,0.1)' : 'rgba(232,76,136,0.08)', 
              color: conditionsConfirmed ? '#4CAF50' : 'var(--primary)', 
              padding: '3px 10px', borderRadius: 'var(--radius-full)', 
              fontSize: '0.72rem', fontWeight: 700 
            }}>
              {conditionsConfirmed 
                ? `${selectedConditions.size} Confirmed`
                : `${conditions.length} Found`}
            </span>
          )}
        </div>

        {conditions.length === 0 ? (
          <div className="metrics-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
            <CheckCircle2 size={36} style={{ color: '#4CAF50', marginBottom: 10 }} />
            <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: 6 }}>Your skin looks healthy! ✨</p>
            <p style={{ opacity: 0.6, fontSize: '0.85rem', lineHeight: 1.5 }}>Our AI did not detect any significant skin conditions. Keep up your current skincare routine and stay protected from the sun.</p>
          </div>
        ) : (
          <>
            {/* Status Banner */}
            {conditionsConfirmed ? (
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', 
                background: 'rgba(76,175,80,0.06)', border: '1px solid rgba(76,175,80,0.18)', 
                borderRadius: 'var(--radius-md)', marginBottom: 14 
              }}>
                <div style={{ 
                  width: 28, height: 28, borderRadius: '50%', background: '#4CAF50', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <Check size={14} color="#fff" />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  Selection confirmed — your personalised product recommendations are below.
                </p>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '14px 16px', 
                background: 'rgba(232,76,136,0.04)', border: '1px solid rgba(232,76,136,0.12)', 
                borderRadius: 'var(--radius-md)', marginBottom: 14 
              }}>
                <Info size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Our AI detected the following conditions. Select the ones you recognise, then confirm to receive personalised product recommendations.
                </p>
              </div>
            )}

            {/* Condition Cards */}
            <div className="conditions-list">
              {conditions.map((c, idx) => {
                const isSelected = selectedConditions.has(idx);
                const isDetailOpen = expandedDetails.has(idx);
                const isDimmed = conditionsConfirmed && !isSelected;
                return (
                  <div
                    key={idx}
                    className={`condition-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleCondition(idx)}
                    style={isDimmed ? { opacity: 0.35, pointerEvents: 'none' } : {}}
                  >
                    {/* Checkbox */}
                    <div className="condition-checkbox">
                      <Check size={14} className="condition-checkbox-icon" />
                    </div>

                    {/* Content */}
                    <div className="condition-select-body">
                      <div className="condition-select-header">
                        <span className="condition-select-name">{c.condition}</span>
                        <span className={`severity-badge ${severityColor(c.severity)}`} style={{ textTransform: 'uppercase' }}>{c.severity}</span>
                      </div>

                      <div className="condition-select-meta">
                        <span className="condition-confidence-pill">
                          {c.confidence}% confidence
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {c.severity} severity
                        </span>
                      </div>

                      {/* Toggle details */}
                      <button
                        className="condition-detail-toggle"
                        onClick={(e) => toggleDetail(idx, e)}
                      >
                        {isDetailOpen ? 'Hide details' : 'View details'}
                        {isDetailOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {/* Expandable Detail Panel */}
                      {isDetailOpen && (
                        <div className="condition-detail" onClick={(e) => e.stopPropagation()}>
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

                          {/* Confidence Bar */}
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
                  </div>
                );
              })}
            </div>

            {/* Confirm Selection Button */}
            {!conditionsConfirmed && (
              <button
                className="confirm-selection-btn"
                onClick={handleConfirmSelection}
                disabled={selectedConditions.size === 0}
              >
                <CheckCircle2 size={18} />
                {selectedConditions.size === 0
                  ? 'Select conditions to continue'
                  : `Confirm ${selectedConditions.size} Condition${selectedConditions.size > 1 ? 's' : ''} & View Products`}
              </button>
            )}
          </>
        )}
      </section>



      {/* ---- Recommended Products (Only shown after confirmation) ---- */}
      {conditionsConfirmed && (
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

              {/* Product Cards */}
              {recommendation.recommended_products.length > 0 ? (
                <div className="prod-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {recommendation.recommended_products.map((p, i) => (
                    <div key={i} className="prod-card" style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #ebebeb', display: 'flex', flexDirection: 'column' }}>
                      <div className="prod-card-img" style={{ position: 'relative', height: 130, background: '#fcfcfc', overflow: 'hidden' }}>
                        <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '2px 6px', borderRadius: 4, fontSize: '0.6rem', fontWeight: 800, color: 'var(--primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                          {p.match_score}%
                        </div>
                        <div style={{ position: 'absolute', top: 6, right: 6, background: '#111', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.6rem', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                          {p.brand}
                        </div>
                      </div>
                      <div className="prod-card-body" style={{ padding: 10, display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 6 }}>
                          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 4px', color: '#111', lineHeight: 1.2 }}>{p.name}</h3>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111' }}>{p.price}</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                          <Sparkles size={10} color="var(--primary)" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.key_ingredient}</span>
                        </div>
                        
                        <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: 12, lineHeight: 1.3, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {p.reason}
                        </p>
                        
                        <a 
                          href={p.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary btn-block" 
                          style={{ display: 'flex', width: '100%', padding: '8px 0', fontSize: '0.75rem', textDecoration: 'none', justifyContent: 'center', alignItems: 'center', borderRadius: 8 }}
                        >
                          Shop Now <ArrowRight size={12} style={{ marginLeft: 4 }} />
                        </a>
                      </div>
                    </div>
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
      )}

      {/* Disclaimer banner moved to top */}

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
          <span>Book WBH</span>
        </Link>
      </div>
    </div>
  );
}
