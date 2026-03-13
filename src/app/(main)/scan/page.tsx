'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Shield, Activity, Camera, Upload, Image as ImageIcon } from 'lucide-react';

type ScanMode = 'choose' | 'camera' | 'upload';
type Phase = 'init' | 'position' | 'align' | 'scan' | 'analyze' | 'done';

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

const SCAN_METRICS = [
  'Mapping facial topology...',
  'Detecting acne zones...',
  'Analyzing skin texture...',
  'Checking hydration levels...',
  'Scanning for dark spots...',
  'Evaluating skin barrier...',
  'Assessing pore structure...',
  'Measuring skin elasticity...',
];

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanMode, setScanMode] = useState<ScanMode>('choose');
  const [phase, setPhase] = useState<Phase>('init');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Preparing camera…');
  const [metricText, setMetricText] = useState('');
  const [cameraError, setCameraError] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadAnalyzing, setUploadAnalyzing] = useState(false);
  const router = useRouter();

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

  const playPositionTone = useCallback(() => {
    playBeep(520, 0.08); setTimeout(() => playBeep(620, 0.08), 120);
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
          setPhase('position');
          setStatusText('Position your face within the frame');
          playPositionTone();
        }
      } catch {
        setCameraError(true);
        setStatusText('Camera access denied');
      }
    };
    start();
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, [scanMode, playPositionTone]);

  /* ---- Phase machine ---- */
  useEffect(() => {
    if (scanMode !== 'camera') return;
    let timer: NodeJS.Timeout;

    if (phase === 'position') {
      timer = setTimeout(() => {
        setPhase('align');
        setStatusText('Face detected — hold still…');
        playBeep(700, 0.2, 0.08);
      }, 4000);
    }

    if (phase === 'align') {
      timer = setTimeout(() => {
        setPhase('scan');
        setStatusText('Scanning in progress…');
        playBeep(900, 0.12);
      }, 2500);
    }

    if (phase === 'scan') {
      let p = 0;
      const iv = setInterval(() => {
        p += 1.5;
        setProgress(Math.min(p, 100));
        if (Math.round(p) % 12 === 0) playBeep(550 + p * 3, 0.06);
        if (Math.round(p) % 14 === 0) setMetricText(SCAN_METRICS[Math.floor(p / 14) % SCAN_METRICS.length]);
        if (p >= 100) {
          clearInterval(iv);
          setPhase('analyze');
          setStatusText('Analyzing results…');
          setMetricText('');
        }
      }, 70);
      return () => clearInterval(iv);
    }

    if (phase === 'analyze') {
      timer = setTimeout(() => {
        const imageData = captureFrame();
        const scanTimestamp = new Date().toISOString();
        try {
          if (imageData) sessionStorage.setItem('dermaai_scan_image', imageData);
          sessionStorage.setItem('dermaai_scan_time', scanTimestamp);
        } catch { /* storage full */ }
        setPhase('done');
        setStatusText('✓ Scan complete!');
        playChime();
        setTimeout(() => router.push('/analysis'), 1800);
      }, 2800);
    }

    return () => clearTimeout(timer);
  }, [scanMode, phase, playBeep, playChime, captureFrame, router]);

  /* ---- Upload handler ---- */
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUploadPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyzeUpload = () => {
    if (!uploadPreview) return;
    setUploadAnalyzing(true);
    try {
      sessionStorage.setItem('dermaai_scan_image', uploadPreview);
      sessionStorage.setItem('dermaai_scan_time', new Date().toISOString());
    } catch { /* storage full */ }
    // Simulate analysis time
    setTimeout(() => {
      playChime();
      router.push('/analysis');
    }, 3000);
  };

  const isActive = phase === 'scan' || phase === 'analyze' || phase === 'done';

  /* ============ CHOOSE MODE SCREEN ============ */
  if (scanMode === 'choose') {
    return (
      <div className="scn-page">
        <header className="scn-header">
          <Link href="/dashboard" className="scn-back"><ArrowLeft size={20} /></Link>
          <div className="scn-brand"><Shield size={14} /> DERMAAI SCAN</div>
          <div className="scn-badge">READY</div>
        </header>
        <div className="scan-choose">
          <h2 className="scan-choose-title">How would you like to scan?</h2>
          <p className="scan-choose-desc">Use your camera for a live scan or upload an existing photo of the skin condition.</p>
          <div className="scan-choose-options">
            <button className="scan-choose-card" onClick={() => setScanMode('camera')}>
              <div className="scan-choose-icon camera-icon"><Camera size={32} /></div>
              <h3>Live Scan</h3>
              <p>Use camera for real-time scanning</p>
            </button>
            <button className="scan-choose-card" onClick={() => setScanMode('upload')}>
              <div className="scan-choose-icon upload-icon"><Upload size={32} /></div>
              <h3>Upload Photo</h3>
              <p>Analyze an existing image</p>
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
          <button className="scn-back" onClick={() => { setScanMode('choose'); setUploadPreview(null); setUploadAnalyzing(false); }}><ArrowLeft size={20} /></button>
          <div className="scn-brand"><Shield size={14} /> UPLOAD SCAN</div>
          <div className="scn-badge">{uploadAnalyzing ? '● ANALYZING' : 'UPLOAD'}</div>
        </header>
        <div className="scan-upload-body">
          {!uploadPreview ? (
            <div className="scan-upload-drop" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon size={48} strokeWidth={1.5} />
              <h3>Select a Photo</h3>
              <p>Tap to browse your gallery for a skin photo to analyze</p>
              <span className="scan-upload-hint">JPG, PNG · Max 10 MB</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUpload}
                style={{ display: 'none' }}
              />
            </div>
          ) : (
            <div className="scan-upload-preview">
              <img src={uploadPreview} alt="Upload preview" className="scan-upload-img" />
              {uploadAnalyzing && (
                <div className="scan-upload-overlay">
                  <div className="scn-loading-spinner" />
                  <p>Analyzing image…</p>
                </div>
              )}
            </div>
          )}
          {uploadPreview && !uploadAnalyzing && (
            <div className="scan-upload-actions">
              <button className="btn btn-outline" onClick={() => { setUploadPreview(null); }}>
                Choose Different
              </button>
              <button className="btn btn-primary" onClick={analyzeUpload}>
                Analyze Photo
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ============ CAMERA MODE ============ */
  return (
    <div className="scn-page">
      <header className="scn-header">
        <button className="scn-back" onClick={() => { setScanMode('choose'); streamRef.current?.getTracks().forEach(t => t.stop()); }}><ArrowLeft size={20} /></button>
        <div className="scn-brand"><Shield size={14} /> DERMAAI SCAN</div>
        <div className={`scn-badge ${phase === 'scan' ? 'live' : phase === 'done' ? 'done' : ''}`}>
          {phase === 'scan' ? '● LIVE' : phase === 'done' ? '✓ DONE' : 'READY'}
        </div>
      </header>

      <div className="scn-body">
        <div className="scn-viewport">
          <video ref={videoRef} className="scn-video" playsInline muted />
          <div className={`scn-grid ${isActive ? 'on' : ''}`} />
          <div className={`scn-oval ${phase === 'align' || phase === 'scan' ? 'detected' : ''} ${phase === 'done' ? 'complete' : ''}`}>
            <i className="bk tl" /><i className="bk tr" /><i className="bk bl" /><i className="bk br" />
            {phase === 'position' && <span className="oval-label">Place face here</span>}
          </div>
          {phase === 'scan' && <div className="scn-sweep" />}
          {isActive && (
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
          {(phase === 'analyze' || phase === 'done') && (
            <>
              <span className="dtag" style={{ top: '28%', left: '6%' }}>Acne Zone</span>
              <span className="dtag" style={{ top: '52%', right: '4%', animationDelay: '0.5s' }}>Dark Spots</span>
              <span className="dtag" style={{ top: '42%', left: '2%', animationDelay: '1s' }}>Dryness</span>
            </>
          )}
          {phase === 'init' && !cameraError && (
            <div className="scn-loading">
              <div className="scn-loading-spinner" />
              <p>Preparing camera…</p>
            </div>
          )}
          {cameraError && (
            <div className="scn-error">
              <p style={{ fontSize: '1.5rem', marginBottom: 8 }}>🔒</p>
              <p style={{ fontWeight: 600 }}>Camera access denied</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: 6 }}>Enable camera in browser settings and reload</p>
            </div>
          )}
        </div>

        <aside className={`scn-data ${isActive ? 'on' : ''}`}>
          <h4>SCAN DATA</h4>
          {[
            { label: 'Hydration', v: '72%' },
            { label: 'Texture', v: '85%' },
            { label: 'Barrier', v: '68%' },
            { label: 'Clarity', v: '79%' },
            { label: 'Elasticity', v: '81%' },
          ].map(d => (
            <div key={d.label} className="sd-row">
              <span className="sd-label">{d.label}</span>
              <span className="sd-val">{phase === 'done' ? d.v : phase === 'analyze' ? '...' : '—'}</span>
              <div className="sd-bar"><div style={{ width: phase === 'done' ? d.v : '0%' }} /></div>
            </div>
          ))}
        </aside>
      </div>

      <footer className="scn-hud">
        {metricText && <div className="scn-metric"><Activity size={13} /> {metricText}</div>}
        <div className={`scn-status phase-${phase}`}>{statusText}</div>
        {(phase === 'scan' || phase === 'analyze') && (
          <div className="scn-prog"><div className="scn-prog-fill" style={{ width: `${phase === 'analyze' ? 100 : progress}%` }} /></div>
        )}
        {phase === 'position' && (
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>
            Ensure good lighting · Remove glasses · Look directly at camera
          </p>
        )}
      </footer>
    </div>
  );
}
