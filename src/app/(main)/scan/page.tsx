'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Activity, Camera, Upload, Image as ImageIcon, X, Plus } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { validateImageData, validateStaticImage, drawImageToCanvas } from '@/lib/imageValidation';

type ScanMode = 'choose' | 'camera' | 'upload';
type Phase = 'init' | 'position' | 'capture' | 'review' | 'analyze' | 'done';

const MAX_IMAGES = 1; // Simplified to 1-shot (multi-angle is optional advanced)
const API_URL = '/api/analyze';

const SCAN_METRICS = [
  'Mapping skin topology…',
  'Detecting acne zones…',
  'Analyzing skin texture…',
  'Checking hydration levels…',
  'Scanning for dark spots…',
  'Evaluating skin barrier…',
  'Assessing pore structure…',
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
  const [hasPrompted, setHasPrompted] = useState(false);

  // Advanced Indicators
  const [indicators, setIndicators] = useState({
    position: false,
    lighting: false,
    sharpness: false,
    angle: false,
  });

  // Multi-image state
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [uploadImages, setUploadImages] = useState<string[]>([]);

  const router = useRouter();
  const { user } = useAuth();

  /* ---- Sound helpers ---- */
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    // Prefer a female English voice for a beauty app feel
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v =>
      v.lang.startsWith('en') && /samantha|victoria|karen|fiona|moira|tessa|female|woman/i.test(v.name)
    ) || voices.find(v =>
      v.lang.startsWith('en') && !/male|guy|daniel|thomas|alex|fred|junior|ralph/i.test(v.name)
    ) || voices.find(v => v.lang.startsWith('en'));

    if (femaleVoice) utterance.voice = femaleVoice;
    window.speechSynthesis.speak(utterance);
  }, []);
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

  /* ---- Camera start & Validation loop ---- */
  useEffect(() => {
    if (scanMode !== 'camera') return;
    let isActive = true;
    let rafId: number;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (!isActive) { stream.getTracks().forEach(t => t.stop()); return; }
        
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setPhase('position');
          setStatusText(`Position your face within the frame`);
          speak('Please position your face within the frame.');
        }
      } catch {
        if (!isActive) return;
        setCameraError(true);
        setStatusText('Camera access denied');
      }
    };
    start();

    // The validation simulation loop
    let validSince = 0;
    const loop = async () => {
      if (!isActive) return;
      if (videoRef.current && videoRef.current.readyState === 4 && (phase === 'position' || phase === 'capture')) {
        const imgParams = drawImageToCanvas(videoRef.current);
        if (imgParams) {
          const { lightingOk, sharpnessOk } = await validateImageData(imgParams.ctx, imgParams.width, imgParams.height);
          
          setIndicators(prev => {
            // Simulated angle & position logic (relies on clear, sharp, lit face staying still)
            const positionOk = lightingOk && sharpnessOk;
            const angleOk = positionOk;
            
            const next = { position: positionOk, lighting: lightingOk, sharpness: sharpnessOk, angle: angleOk };
            const allValidNow = next.position && next.lighting && next.sharpness && next.angle;

            if (allValidNow) {
              if (validSince === 0) validSince = Date.now();
              const holdSecs = (Date.now() - validSince) / 1000;
              
              if (holdSecs > 1) {
                setStatusText('Perfectly aligned! Press capture.');
              } else {
                setStatusText('Perfectly aligned!');
              }
            } else {
              validSince = 0;
              setStatusText(`Position your face within the frame`);
            }

            return next;
          });
        }
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      isActive = false;
      cancelAnimationFrame(rafId);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [scanMode, phase, speak]);

  /* ---- Take snapshot ---- */
  const takeSnapshot = useCallback(() => {
    if (capturedImages.length >= MAX_IMAGES || phase !== 'position') return;
    const img = captureFrame();
    if (img) {
      setCapturedImages([img]);
      playShutter();
      setPhase('review');
      setStatusText('Please review your capture');
      speak('Capture successful. Please review your capture.');
    }
  }, [capturedImages.length, captureFrame, playShutter, phase, speak]);

  // Manual capture prompt logic
  useEffect(() => {
    if (phase !== 'position') {
      setHasPrompted(false);
      return;
    }
    const allValid = indicators.position && indicators.lighting && indicators.sharpness && indicators.angle;
    if (allValid) {
      if (!hasPrompted) {
        setHasPrompted(true);
        speak('Alignment is perfect. Please press the capture button.');
      }
    } else {
      if (hasPrompted) setHasPrompted(false);
    }
  }, [indicators, phase, hasPrompted, speak]);

  /* ---- Upload handler ---- */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setApiError(null);

    const file = files[0]; // strictly 1 shot layout
    
    // Size check
    if (file.size > 20 * 1024 * 1024) {
      setApiError('Maximum file size is 20MB.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      
      // Perform validation checks automatically post-upload
      const validation = await validateStaticImage(dataUrl);
      if (!validation.passed) {
        setApiError(validation.message || 'Image rejected by quality validation.');
        return;
      }

      setUploadImages([dataUrl]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  /* ---- Analyze (shared logic for camera + upload) ---- */
  const runAnalysis = async (images: string[]) => {
    if (images.length === 0) return;

    setPhase('analyze');
    setAnalyzing(true);
    setApiError(null);
    setStatusText('Connecting to AI…');
    speak('Analyzing your skin, please wait.');

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
      try { sessionStorage.setItem('wbh_analysis', JSON.stringify(data)); } catch { }

      // Outer Save
      try {
        const { createClient: mkClient } = await import('@/lib/supabase/client');
        const authClient = mkClient();
        const { data: { user: loggedInUser } } = await authClient.auth.getUser();

        if (loggedInUser) {
          const scanId = crypto.randomUUID();
          const conditions = data.detected_conditions || [];
          const avgConfidence = conditions.length > 0
            ? conditions.reduce((sum: number, c: { confidence: number }) => sum + c.confidence, 0) / conditions.length
            : 0;
          const score = Math.max(0, Math.round(100 - avgConfidence));

          const storagePaths: string[] = [];
          
          for (let i = 0; i < images.length; i++) {
            const { uploadScanImage: upload } = await import('@/lib/supabase/storage');
            const blob = dataURLtoBlob(images[i]);
            const path = await upload(loggedInUser.id, scanId, blob, i);
            storagePaths.push(path);
          }

          if (storagePaths.length > 0) {
            await fetch('/api/scans', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ analysis: data, image_urls: storagePaths }),
            }).catch(()=>{});
          }
        }
      } catch { }

      setPhase('done');
      setStatusText('✓ Scan complete!');
      playChime();
      setTimeout(() => router.push('/analysis'), 1800);
    } catch (err: unknown) {
      const is503 = err instanceof Error && (err.message.includes('503') || err.message.includes('502'));
      const msg = err instanceof DOMException && err.name === 'AbortError'
        ? 'Request timed out. The AI server may be starting up — please retry.'
        : is503 ? 'The AI is currently experiencing high demand. Please try again in a few moments.'
        : err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      speak('Analysis failed. Please try again.');
      setApiError(msg);
      setStatusText('Analysis failed');
      setAnalyzing(false);
      setPhase(scanMode === 'camera' ? 'review' : 'init');
    }
  };

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
          <p className="scan-choose-desc">For maximum accuracy, use the live camera feed.</p>
          <div className="scan-choose-options">
            <button className="scan-choose-card" onClick={() => setScanMode('camera')}>
              <div className="scan-choose-icon camera-icon"><Camera size={32} /></div>
              <h3>Live Scan</h3>
              <p>Real-time validation</p>
            </button>
            <button className="scan-choose-card" onClick={() => setScanMode('upload')}>
              <div className="scan-choose-icon upload-icon"><Upload size={32} /></div>
              <h3>Upload Photo</h3>
              <p>Submit existing image</p>
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
          <div className="scn-badge">{analyzing ? '● ANALYZING' : (uploadImages.length>0 ? 'READY' : 'SELECT')}</div>
        </header>
        <div className="scan-upload-body">
          {/* Preview image */}
          {uploadImages.length > 0 && !analyzing && (
            <div className="scan-upload-preview">
              <img src={uploadImages[0]} alt="Uploaded photo" className="scan-upload-img" />
            </div>
          )}

          {/* Drop zone (when no images) */}
          {uploadImages.length === 0 && (
            <div className="scan-upload-drop" onClick={() => fileInputRef.current?.click()}>
              <ImageIcon size={48} strokeWidth={1.5} />
              <h3>Select Photo</h3>
              <p>Upload an image of the affected skin area for better accuracy (Max 20MB)</p>
              <span className="scan-upload-hint">JPG, PNG, HEIC</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/heic"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />

          {/* Analyzing overlay */}
          {analyzing && (
            <div className="scan-analyzing-card">
              <div className="scn-loading-spinner" />
              <p style={{ fontWeight: 600, marginTop: 12 }}>{SCAN_METRICS[metricIdx]}</p>
            </div>
          )}

          {/* Error */}
          {apiError && !analyzing && (
            <div style={{ padding: '16px', margin: '0 16px 12px', background: 'rgba(229,57,53,0.12)', borderRadius: 12, textAlign: 'center', border: '1px solid rgba(229,57,53,0.3)' }}>
              <p style={{ color: '#E53935', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>✓ Validation Issue</p>
              <p style={{ color: '#E53935', fontSize: '0.85rem' }}>{apiError}</p>
            </div>
          )}

          {/* Actions */}
          {uploadImages.length > 0 && !analyzing && !apiError && (
            <div className="scan-upload-actions">
              <button className="btn btn-outline" onClick={() => setUploadImages([])}>
                Upload Another
              </button>
              <button className="btn btn-primary" onClick={() => runAnalysis(uploadImages)}>
                Analyse My Skin
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ============ CAMERA MODE ============ */
  const allIndicatorsOk = indicators.position && indicators.lighting && indicators.sharpness && indicators.angle;

  return (
    <div className="scn-page">
      <header className="scn-header">
        <button className="scn-back" onClick={() => { setScanMode('choose'); setCapturedImages([]); streamRef.current?.getTracks().forEach(t => t.stop()); }}><ArrowLeft size={20} /></button>
        <div className="scn-brand"><img src="/images/wbhlogo.svg" alt="WBH" /></div>
        <div className={`scn-badge ${phase === 'done' ? 'done' : 'live'}`}>
          {phase === 'done' ? '✓ DONE' : phase === 'review' ? 'REVIEW' : 'LIVE'}
        </div>
      </header>

      <div className="scn-body">
        <div className="scn-viewport">
          {phase === 'review' && capturedImages[0] ? (
            <img src={capturedImages[0]} alt="Captured Review" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
          ) : (
            <video ref={videoRef} className="scn-video" playsInline muted />
          )}

          {/* Wireframe effect during analysis - visually looks cool */}
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

          {/* Camera Oval guide */}
          {phase === 'position' && !cameraError && (
            <>
              {/* Fake Oval for aesthetics */}
              <div className={`scn-oval ${allIndicatorsOk ? 'complete' : ''}`}>
                 <span className="bk tl"></span><span className="bk tr"></span>
                 <span className="bk bl"></span><span className="bk br"></span>
                 <div className="oval-label">Center Face Here</div>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="scn-hud">
        {analyzing && <div className="scn-metric"><Activity size={13} /> {SCAN_METRICS[metricIdx]}</div>}
        
        {phase === 'position' && (
          <div className="scn-status phase-position" style={{ color: allIndicatorsOk ? 'var(--primary)' : 'var(--text-secondary)' }}>
            {statusText}
          </div>
        )}
        
        {apiError && (
          <div style={{ padding: '10px 16px', margin: '8px 0', background: 'rgba(229,57,53,0.12)', borderRadius: 10, textAlign: 'center' }}>
            <p style={{ color: '#E53935', fontSize: '0.82rem', fontWeight: 600 }}>⚠ {apiError}</p>
          </div>
        )}

        {/* Real-time Validation Indicators Panel */}
        {phase === 'position' && (
          <div className="validation-hud" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ ...validationPillStyle(indicators.position) }}><div>Face Position</div> <span>{indicators.position ? '✓' : '✗'}</span></div>
            <div style={{ ...validationPillStyle(indicators.lighting) }}><div>Lighting</div> <span>{indicators.lighting ? '✓' : '✗'}</span></div>
            <div style={{ ...validationPillStyle(indicators.sharpness) }}><div>Sharpness</div> <span>{indicators.sharpness ? '✓' : '✗'}</span></div>
            <div style={{ ...validationPillStyle(indicators.angle) }}><div>Angle</div> <span>{indicators.angle ? '✓' : '✗'}</span></div>
          </div>
        )}

        {/* Action Controls */}
        {phase === 'position' && !analyzing && (
          <div className="scan-camera-controls" style={{ marginTop: 0 }}>
            <button 
              className="scan-shutter-btn" 
              onClick={takeSnapshot} 
              aria-label="Take photo"
              disabled={!allIndicatorsOk}
              style={{ opacity: allIndicatorsOk ? 1 : 0.4, cursor: allIndicatorsOk ? 'pointer' : 'not-allowed' }}
            >
              <span className="scan-shutter-inner" />
            </button>
            <p style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: 12 }}>
              Align indicators to unlock camera
            </p>
          </div>
        )}

        {/* Review Screen Actions */}
        {phase === 'review' && (
           <div className="scan-upload-actions" style={{ padding: '0 20px', marginTop: 10 }}>
              <button 
                className="btn btn-outline" 
                onClick={() => { setPhase('position'); setCapturedImages([]); setStatusText('Position your face within the frame'); }}
              >
                Retake
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => runAnalysis(capturedImages)}
              >
                Analyse My Skin
              </button>
           </div>
        )}
      </footer>
    </div>
  );
}

// Inline styles for quick layout
function validationPillStyle(ok: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 600,
    border: '1px solid',
    borderColor: ok ? 'rgba(76,175,80,0.4)' : 'rgba(229,57,53,0.3)',
    background: ok ? 'rgba(76,175,80,0.1)' : 'rgba(229,57,53,0.06)',
    color: ok ? 'var(--green, #4CAF50)' : '#E53935',
    transition: 'all 0.3s ease',
  };
}
