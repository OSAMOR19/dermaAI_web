'use client';

import { useState } from 'react';
import { Camera, Scan, ShieldCheck, Activity, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  { Icon: ShieldCheck, title: 'Privacy First', desc: 'Encoded facial data' },
  { Icon: Activity, title: 'Deep Analysis', desc: 'Pores & Hydration' },
  { Icon: Scan, title: 'High Precision', desc: 'Medical Accuracy' },
  { Icon: Heart, title: 'Personalized', desc: 'Custom Care Plans' },
];

export default function LandingSkinAnalysis() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | { hydration: string; elasticity: string; pigmentation: string; diagnosis: string }>(null);

  const startScan = () => {
    setIsScanning(true); setProgress(0); setResult(null);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval); setIsScanning(false);
          setResult({ hydration: '82%', elasticity: 'Excellent', pigmentation: 'Normal', diagnosis: 'Your skin barrier is healthy. We noticed minor dehydration around the forehead area. Recommended treatment: Hyaluronic Acid infusion.' });
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <section id="analysis" style={{ padding: '80px 0', background: '#2d1a12', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Grid BG */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 80, flexWrap: 'wrap' }}>
          {/* Left text */}
          <div style={{ flex: 1, minWidth: 280, textAlign: 'left' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(227,27,93,0.2)', color: '#e31b5d',
              borderRadius: 50, padding: '6px 16px', fontSize: 11, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 28,
              border: '1px solid rgba(227,27,93,0.3)',
            }}>
              <Sparkles size={14} /> Next-Gen Technology
            </div>

            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 60px)', fontFamily: 'Georgia,serif',
              fontWeight: 700, lineHeight: 1.1, marginBottom: 24,
            }}>
              AI-Powered Skin Analysis<br />
              <span style={{ color: '#e31b5d', fontStyle: 'italic' }}>Instant Clinical Diagnosis</span>
            </h2>

            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.7)', marginBottom: 40, lineHeight: 1.7, maxWidth: 480 }}>
              Using advanced computer vision, our scanner identifies 14+ specific skin concerns in seconds. Professional medical insights at your fingertips.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 48 }}>
              {features.map(({ Icon, title, desc }, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '16px', borderRadius: 16,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{
                    width: 44, height: 44, background: 'rgba(227,27,93,0.2)',
                    borderRadius: 12, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#e31b5d', flexShrink: 0,
                  }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{title}</h4>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button
                onClick={startScan}
                disabled={isScanning}
                style={{
                  background: '#e31b5d', color: '#fff', border: 'none',
                  borderRadius: 20, padding: '18px 40px', fontSize: 16, fontWeight: 700,
                  cursor: isScanning ? 'not-allowed' : 'pointer', opacity: isScanning ? 0.7 : 1,
                  boxShadow: '0 12px 32px rgba(227,27,93,0.3)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                <Scan size={20} style={{ animation: isScanning ? 'pulse 1s infinite' : 'none' }} />
                {isScanning ? `Scanning... ${progress}%` : 'Start Diagnostic Scan'}
              </button>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: 20, padding: '16px 40px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
                }}>Get Full Analysis</button>
              </Link>
            </div>
          </div>

          {/* Right preview panel */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '1',
              borderRadius: 48, overflow: 'hidden', border: '6px solid rgba(255,255,255,0.06)',
              background: 'rgba(0,0,0,0.3)', boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
            }}>
              {/* Scanner result overlay */}
              {(isScanning || result) ? (
                <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                  {isScanning && (
                    <div style={{ textAlign: 'center' }}>
                      <Scan size={80} color="#e31b5d" style={{ animation: 'pulse 1.5s infinite', marginBottom: 24 }} />
                      <h3 style={{ fontSize: 24, fontFamily: 'Georgia,serif', fontWeight: 700, marginBottom: 8 }}>Face analysis in progress</h3>
                      <p style={{ color: 'rgba(255,255,255,0.6)' }}>Please keep your face centered</p>
                    </div>
                  )}
                  {result && !isScanning && (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <div style={{ width: 72, height: 72, background: '#e31b5d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <ShieldCheck size={36} color="#fff" />
                      </div>
                      <h3 style={{ fontSize: 28, fontFamily: 'Georgia,serif', fontWeight: 700, marginBottom: 20 }}>Analysis Complete</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                        {[{ label: 'Hydration', val: result.hydration }, { label: 'Elastic', val: result.elasticity }, { label: 'Pigment', val: result.pigmentation }].map((item, i) => (
                          <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '14px 10px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p style={{ fontSize: 20, fontFamily: 'Georgia,serif', fontWeight: 700, color: '#e31b5d', marginBottom: 4 }}>{item.val}</p>
                            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{item.label}</p>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: 'rgba(227,27,93,0.1)', padding: '16px 20px', borderRadius: 20, border: '1px solid rgba(227,27,93,0.2)', textAlign: 'left', marginBottom: 16 }}>
                        <p style={{ color: '#e31b5d', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Clinical Observation</p>
                        <p style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontSize: 14 }}>"{result.diagnosis}"</p>
                      </div>
                      <button onClick={() => setResult(null)} style={{ background: 'transparent', border: 'none', color: '#e31b5d', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
                        Restart Scan
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <Image src="/face1.jpg" alt="Scanner Ready" fill style={{ objectFit: 'cover', opacity: 0.4 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #2d1a12 0%, rgba(45,26,18,0.4) 50%, transparent 100%)' }} />
                  </div>
                  <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: 32 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', position: 'relative' }}>
                      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px dashed rgba(227,27,93,0.4)', animation: 'spin 20s linear infinite' }} />
                      <Camera size={40} color="#fff" />
                    </div>
                    <h3 style={{ fontSize: 24, fontFamily: 'Georgia,serif', fontWeight: 700, marginBottom: 12 }}>Scanner Ready</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 260, margin: '0 auto', lineHeight: 1.6 }}>
                      Position yourself in a well-lit area for the most accurate diagnostic result.
                    </p>
                  </div>
                </div>
              )}

              {/* Corner accents */}
              {[{top:20,left:20,borderTop:'2px solid rgba(227,27,93,0.4)',borderLeft:'2px solid rgba(227,27,93,0.4)',borderTopLeftRadius:16},{top:20,right:20,borderTop:'2px solid rgba(227,27,93,0.4)',borderRight:'2px solid rgba(227,27,93,0.4)',borderTopRightRadius:16},{bottom:20,left:20,borderBottom:'2px solid rgba(227,27,93,0.4)',borderLeft:'2px solid rgba(227,27,93,0.4)',borderBottomLeftRadius:16},{bottom:20,right:20,borderBottom:'2px solid rgba(227,27,93,0.4)',borderRight:'2px solid rgba(227,27,93,0.4)',borderBottomRightRadius:16}].map((s,i) => (
                <div key={i} style={{ position: 'absolute', width: 36, height: 36, ...s }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
      `}</style>
    </section>
  );
}
