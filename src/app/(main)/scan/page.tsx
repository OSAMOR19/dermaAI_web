'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Activity, Camera, Upload, Image as ImageIcon, X, Plus } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { uploadScanImage } from '@/lib/supabase/storage';

type ScanMode = 'choose' | 'camera' | 'upload';
type Phase = 'init' | 'position' | 'capture' | 'review' | 'analyze' | 'done';

const MAX_IMAGES = 4;
const API_URL = '/api/analyze';

const SCAN_METRICS = [
  'Mapping skin topology…',
  'Detecting acne zones…',
  'Analyzing skin texture…',
  'Checking hydration levels…',
  'Scanning for dark spots…',
  'Evaluating skin barrier…',
  'Assessing pore structure…',
  'Measuring skin elasticity…',
];

const WIREFRAME_POINTS = [
  { x: 50, y: 12, d: 0 }, { x: 38, y: 18, d: 0.15 }, { x: 62, y: 18, d: 0.3 },
  { x: 30, y: 28, d: 0.45 }, { x: 42, y: 30, d: 0.6 }, { x: 58, y: 30, d: 0.75 }, { x: 70, y: 28, d: 0.9 },
  { x: 35, y: 36, d: 1.0 }, { x: 44, y: 37, d: 1.1 }, { x: 56, y: 37, d: 1.2 }, { x: 65, y: 36, d: 1.3 },
  { x: 50, y: 44, d: 1.5 }, { x: 46, y: 50, d: 1.7 }, { x: 54, y: 50, d: 1.8 },
  { x: 26, y: 48, d: 2.0 }, { x: 74, y: 48, d: 2.1 },
  { x: 38, y: 60, d: 2.3 }, { x: 50, y: 63, d: 2.5 }, { x: 62, y: 60, d: 2.7 },
  { x: 28, y: 68, d: 2.9 }, { x: 72, y: 68, d: 3.0 },
  { x: 38, y: 76, d: 3.2 }, { x: 50, y: 80, d: 3.4 }, { x: 62, y: 76, d: 3.5 },
];

const WIRE_LINES: [number, number, number, number][] = [
  [50,12,38,18],[50,12,62,18],[38,18,30,28],[62,18,70,28],
  [30,28,42,30],[70,28,58,30],[42,30,50,44],[58,30,50,44],
  [30,28,35,36],[70,28,65,36],[35,36,44,37],[65,36,56,37],
  [50,44,46,50],[50,44,54,50],[26,48,30,28],[74,48,70,28],
  [26,48,28,68],[74,48,72,68],[38,60,50,63],[62,60,50,63],
  [28,68,38,76],[72,68,62,76],[38,76,50,80],[62,76,50,80],
  [35,36,26,48],[65,36,74,48],[44,37,38,60],[56,37,62,60],
];

function dataURLtoBlob(dataURL: string): Blob {
  const [header, data] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new Blob([array], { type: mime });
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanMode, setScanMode] = useState<ScanMode>('choose');
  const [phase, setPhase] = useState<Phase>('init');
  const [statusText, setStatusText] = useState('Preparing camera…');
  const [metricIdx, setMetricIdx] = useState(0);
  const [cameraError, setCameraError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Multi-image state
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [uploadImages, setUploadImages] = useState<string[]>([]);

  const router = useRouter();
  const { user } = useAuth();

  /* ---- Sound helpers ---- */
  const playBeep = useCallback((freq = 800, dur = 0.12, vol = 0.06) => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = freq; g.gain.value = vol;
      o.connect(g); g.connect(ctx.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.stop(ctx.currentTime + dur);
    } catch { /* silent fallback */ }
  }, []);

  const playChime = useCallback(() => {
    [600, 800, 1050].forEach((f, i) => setTimeout(() => playBeep(f, 0.25, 0.08), i * 160));
  }, [playBeep]);

  const playShutter = useCallback(() => {
    playBeep(1200, 0.06, 0.1); setTimeout(() => playBeep(800, 0.06, 0.05), 80);
  }, [playBeep]);

  /* ---- Capture frame from video ---- */
  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  }, []);

  /* ---- Camera start ---- */
  useEffect(() => {
    if (scanMode !== 'camera') return;
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setPhase('capture');
          setStatusText(`Take up to ${MAX_IMAGES} photos of the affected area`);
        }
      } catch {
        setCameraError(true);
        setStatusText('Camera access denied');
      }
    };
    start();
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, [scanMode]);

  /* ---- Take snapshot ---- */
  const takeSnapshot = () => {
    if (capturedImages.length >= MAX_IMAGES) return;
    const img = captureFrame();
    if (img) {
      setCapturedImages(prev => [...prev, img]);
      playShutter();
      if (capturedImages.length + 1 >= MAX_IMAGES) {
        setStatusText(`${MAX_IMAGES}/${MAX_IMAGES} captured — Ready to analyze`);
      } else {
        setStatusText(`${capturedImages.length + 1}/${MAX_IMAGES} captured — Tap to take more`);
      }
    }
  };

  const removeCapture = (idx: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== idx));
  };

  /* ---- Upload handler ---- */
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = MAX_IMAGES - uploadImages.length;
    const toAdd = files.slice(0, remaining);

    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadImages(prev => {
          if (prev.length >= MAX_IMAGES) return prev;
          return [...prev, reader.result as string];
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const removeUpload = (idx: number) => {
    setUploadImages(prev => prev.filter((_, i) => i !== idx));
  };

  /* ---- Analyze (shared logic for camera + upload) ---- */
  const runAnalysis = async (images: string[]) => {
    if (images.length === 0) return;

    setAnalyzing(true);
    setApiError(null);
    setStatusText('Connecting to AI…');

    // Save to sessionStorage for immediate display on analysis page
    try {
      sessionStorage.setItem('wbh_scan_image', images[0]);
      sessionStorage.setItem('wbh_scan_time', new Date().toISOString());
    } catch { /* storage full */ }

    try {
      const formData = new FormData();
      images.forEach((img, i) => {
        const blob = dataURLtoBlob(img);
        formData.append(`file${i}`, blob, `scan_${i}.jpg`);
      });

      // Rotate metric text during analysis
      const metricInterval = setInterval(() => {
        setMetricIdx(prev => (prev + 1) % SCAN_METRICS.length);
      }, 2500);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      clearInterval(metricInterval);

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || `Server error (${res.status})`);
      }

      const data = await res.json();

      try {
        sessionStorage.setItem('wbh_analysis', JSON.stringify(data));
      } catch { /* storage full */ }

      // Upload images to Supabase Storage & save scan to DB
      if (user) {
        try {
          const scanId = crypto.randomUUID();
          const storagePaths: string[] = [];

          for (let i = 0; i < images.length; i++) {
            const blob = dataURLtoBlob(images[i]);
            const path = await uploadScanImage(user.id, scanId, blob, i);
            storagePaths.push(path);
          }

          // Calculate health score from analysis
          const conditions = data.detected_conditions || [];
          const avgConfidence = conditions.length > 0
            ? conditions.reduce((sum: number, c: { confidence: number }) => sum + c.confidence, 0) / conditions.length
            : 0;
          const score = Math.max(0, Math.round(100 - avgConfidence));

          await fetch('/api/scans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              score,
              analysis: data,
              image_urls: storagePaths,
            }),
          });
        } catch (err) {
          console.error('Failed to save scan to DB:', err);
          // Non-critical — analysis still works
        }
      }

      setPhase('done');
      setStatusText('✓ Scan complete!');
      playChime();
      setTimeout(() => router.push('/analysis'), 1800);
    } catch (err: unknown) {
      const msg = err instanceof DOMException && err.name === 'AbortError'
        ? 'Request timed out. The AI server may be starting up — please retry.'
        : err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setApiError(msg);
      setStatusText('Analysis failed');
      setAnalyzing(false);
    }
  };

  const isAnalyzing = analyzing || phase === 'analyze';

  /* ============ CHOOSE MODE SCREEN ============ */
  if (scanMode === 'choose') {
    return (
      <div className="scn-page">
        <header className="scn-header">
          <Link href="/dashboard" className="scn-back"><ArrowLeft size={20} /></Link>
          <div className="scn-brand"><img src="/images/wbhlogo.svg" alt="WBH" /></div>
          <div className="scn-badge">READY</div>
        </header>
        <div className="scan-choose">
          <h2 className="scan-choose-title">How would you like to scan?</h2>
          <p className="scan-choose-desc">Take up to {MAX_IMAGES} photos for a more accurate AI analysis. Multiple angles help detect conditions better.</p>
          <div className="scan-choose-options">
            <button className="scan-choose-card" onClick={() => setScanMode('camera')}>
              <div className="scan-choose-icon camera-icon"><Camera size={32} /></div>
              <h3>Live Scan</h3>
              <p>Take snapshots with your camera</p>
            </button>
            <button className="scan-choose-card" onClick={() => setScanMode('upload')}>
              <div className="scan-choose-icon upload-icon"><Upload size={32} /></div>
              <h3>Upload Photos</h3>
              <p>Select up to {MAX_IMAGES} images</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ============ UPLOAD MODE ============ */
  if (scanMode === 'upload') {
    return (
      <div className="scn-page">
        <header className="scn-header">
          <button className="scn-back" onClick={() => { setScanMode('choose'); setUploadImages([]); setAnalyzing(false); setApiError(null); }}><ArrowLeft size={20} /></button>
          <div className="scn-brand"><img src="/images/wbhlogo.svg" alt="WBH" /></div>
          <div className="scn-badge">{analyzing ? '● ANALYZING' : `${uploadImages.length}/${MAX_IMAGES}`}</div>
        </header>
        <div className="scan-upload-body">
          {/* Thumbnail strip */}
          {uploadImages.length > 0 && (
            <div className="scan-thumbs">
              {uploadImages.map((img, i) => (
                <div key={i} className="scan-thumb">
                  <img src={img} alt={`Photo ${i + 1}`} />
                  {!analyzing && (
                    <button className="scan-thumb-remove" onClick={() => removeUpload(i)}><X size={12} /></button>
                  )}
                  <span className="scan-thumb-num">{i + 1}</span>
                </div>
              ))}
              {uploadImages.length < MAX_IMAGES && !analyzing && (
                <button className="scan-thumb-add" onClick={() => fileInputRef.current?.click()}>
                  <Plus size={20} />
                </button>
              )}
            </div>
          )}

          {/* Drop zone (when no images) */}
          {uploadImages.length === 0 && (
            <div className="scan-upload-drop" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon size={48} strokeWidth={1.5} />
              <h3>Select Photos</h3>
              <p>Upload up to {MAX_IMAGES} images of the skin condition for better accuracy</p>
              <span className="scan-upload-hint">JPG, PNG · Max 10 MB each</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
          />

          {/* Analyzing overlay */}
          {analyzing && (
            <div className="scan-analyzing-card">
              <div className="scn-loading-spinner" />
              <p style={{ fontWeight: 600, marginTop: 12 }}>{SCAN_METRICS[metricIdx]}</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: 4 }}>Analyzing {uploadImages.length} image{uploadImages.length > 1 ? 's' : ''}…</p>
            </div>
          )}

          {/* Error */}
          {apiError && !analyzing && (
            <div style={{ padding: '12px 16px', margin: '0 16px 12px', background: 'rgba(229,57,53,0.12)', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ color: '#E53935', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>⚠ {apiError}</p>
              <button className="btn btn-primary" style={{ marginTop: 8, fontSize: '0.85rem' }} onClick={() => runAnalysis(uploadImages)}>Retry</button>
            </div>
          )}

          {/* Actions */}
          {uploadImages.length > 0 && !analyzing && !apiError && (
            <div className="scan-upload-actions">
              <button className="btn btn-outline" onClick={() => setUploadImages([])}>
                Clear All
              </button>
              <button className="btn btn-primary" onClick={() => runAnalysis(uploadImages)}>
                Analyze {uploadImages.length} Photo{uploadImages.length > 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ============ CAMERA MODE ============ */
  const isActive = capturedImages.length > 0 || phase === 'analyze' || phase === 'done';

  return (
    <div className="scn-page">
      <header className="scn-header">
        <button className="scn-back" onClick={() => { setScanMode('choose'); setCapturedImages([]); streamRef.current?.getTracks().forEach(t => t.stop()); }}><ArrowLeft size={20} /></button>
        <div className="scn-brand"><img src="/images/wbhlogo.svg" alt="WBH" /></div>
        <div className={`scn-badge ${phase === 'done' ? 'done' : capturedImages.length > 0 ? 'live' : ''}`}>
          {phase === 'done' ? '✓ DONE' : `${capturedImages.length}/${MAX_IMAGES}`}
        </div>
      </header>

      <div className="scn-body">
        <div className="scn-viewport">
          <video ref={videoRef} className="scn-video" playsInline muted />

          {/* Wireframe effect during analysis */}
          {(phase === 'analyze' || phase === 'done') && (
            <div className="wire-layer">
              {WIREFRAME_POINTS.map((p, i) => (
                <span key={i} className="wd" style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${p.d}s` }} />
              ))}
              <svg className="wl" viewBox="0 0 100 100" preserveAspectRatio="none">
                {WIRE_LINES.map(([x1, y1, x2, y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
                ))}
              </svg>
            </div>
          )}

          {/* Analyzing overlay on camera */}
          {phase === 'analyze' && (
            <div className="scan-upload-overlay">
              <div className="scn-loading-spinner" />
              <p>{SCAN_METRICS[metricIdx]}</p>
            </div>
          )}

          {/* Camera loading */}
          {phase === 'init' && !cameraError && (
            <div className="scn-loading">
              <div className="scn-loading-spinner" />
              <p>Preparing camera…</p>
            </div>
          )}

          {/* Camera error */}
          {cameraError && (
            <div className="scn-error">
              <p style={{ fontSize: '1.5rem', marginBottom: 8 }}>🔒</p>
              <p style={{ fontWeight: 600 }}>Camera access denied</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: 6 }}>Enable camera in browser settings and reload</p>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {capturedImages.length > 0 && !analyzing && (
        <div className="scan-thumbs" style={{ padding: '0 16px', marginBottom: 8 }}>
          {capturedImages.map((img, i) => (
            <div key={i} className="scan-thumb">
              <img src={img} alt={`Snap ${i + 1}`} />
              <button className="scan-thumb-remove" onClick={() => removeCapture(i)}><X size={12} /></button>
              <span className="scan-thumb-num">{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      <footer className="scn-hud">
        {analyzing && <div className="scn-metric"><Activity size={13} /> {SCAN_METRICS[metricIdx]}</div>}
        <div className={`scn-status phase-${phase}`}>{statusText}</div>

        {apiError && (
          <div style={{ padding: '10px 16px', margin: '8px 0', background: 'rgba(229,57,53,0.12)', borderRadius: 10, textAlign: 'center' }}>
            <p style={{ color: '#E53935', fontSize: '0.82rem', fontWeight: 600 }}>⚠ {apiError}</p>
            <button onClick={() => runAnalysis(capturedImages)} style={{ marginTop: 8, padding: '6px 20px', borderRadius: 8, background: 'linear-gradient(135deg,#FC65D1,#00B4FA)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Retry</button>
          </div>
        )}

        {/* Camera controls */}
        {phase === 'capture' && !analyzing && (
          <div className="scan-camera-controls">
            {capturedImages.length < MAX_IMAGES && (
              <button className="scan-shutter-btn" onClick={takeSnapshot} aria-label="Take photo">
                <span className="scan-shutter-inner" />
              </button>
            )}
            {capturedImages.length > 0 && (
              <button
                className="btn btn-primary"
                style={{ marginTop: 12, width: '100%' }}
                onClick={() => {
                  setPhase('analyze');
                  runAnalysis(capturedImages);
                }}
              >
                Analyze {capturedImages.length} Photo{capturedImages.length > 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}

        {phase === 'capture' && capturedImages.length === 0 && (
          <p style={{ fontSize: '0.8rem', color: 'rgba(0,0,0,0.4)', marginTop: 8 }}>
            Take photos from different angles for better accuracy
          </p>
        )}
      </footer>
    </div>
  );
}
