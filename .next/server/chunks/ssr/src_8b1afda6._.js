module.exports = [
"[project]/src/lib/imageValidation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "drawImageToCanvas",
    ()=>drawImageToCanvas,
    "validateImageData",
    ()=>validateImageData,
    "validateStaticImage",
    ()=>validateStaticImage
]);
async function validateImageData(ctx, width, height) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    let totalLuminance = 0;
    // To calculate sharpness, we can do a simplified edge detection horizontal pass
    let totalEdgeAbs = 0;
    let edgeCount = 0;
    const step = 4; // Check every pixel (r,g,b,a) -> step=4. We'll sample to be fast.
    const sampleStep = 4 * 4; // check every 4 pixels for performance
    for(let i = 0; i < data.length; i += sampleStep){
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Perceived luminance
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLuminance += lum;
        // Quick horizontal edge detection if not at the rightmost edge
        if (i + sampleStep < data.length && i / 4 % width < width - 4) {
            const nextR = data[i + sampleStep];
            const nextG = data[i + sampleStep + 1];
            const nextB = data[i + sampleStep + 2];
            const nextLum = 0.299 * nextR + 0.587 * nextG + 0.114 * nextB;
            totalEdgeAbs += Math.abs(lum - nextLum);
            edgeCount++;
        }
    }
    const sampledPixels = data.length / sampleStep;
    const avgLuminance = totalLuminance / sampledPixels;
    // Variance
    const avgEdge = totalEdgeAbs / edgeCount;
    // Good lighting: Not completely black and not fully washed out (white out)
    const lightingOk = avgLuminance > 30 && avgLuminance < 230;
    // Good sharpness: if variance > threshold (e.g., 5.0 is blurry, > 8.0 is okay, > 12 is sharp)
    const sharpnessOk = avgEdge > 7.0;
    return {
        lightingOk,
        sharpnessOk,
        lightingAvg: avgLuminance,
        sharpnessAvg: avgEdge
    };
}
function drawImageToCanvas(imgSource) {
    const canvas = document.createElement('canvas');
    let width = 0;
    let height = 0;
    if (imgSource instanceof HTMLVideoElement) {
        width = imgSource.videoWidth || 640;
        height = imgSource.videoHeight || 480;
    } else {
        width = imgSource.width;
        height = imgSource.height;
    }
    if (!width || !height) return null;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', {
        willReadFrequently: true
    });
    if (!ctx) return null;
    ctx.drawImage(imgSource, 0, 0, width, height);
    return {
        ctx,
        width,
        height
    };
}
async function validateStaticImage(dataUrl) {
    return new Promise((resolve)=>{
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = async ()=>{
            const res = drawImageToCanvas(img);
            if (!res) {
                resolve({
                    passed: false,
                    message: 'Invalid image data format'
                });
                return;
            }
            const val = await validateImageData(res.ctx, res.width, res.height);
            if (!val.lightingOk) {
                resolve({
                    passed: false,
                    message: 'Image too dark or overly exposed — please retake in better lighting'
                });
            } else if (!val.sharpnessOk) {
                resolve({
                    passed: false,
                    message: 'Image is too blurry. Please retake a sharper photo.'
                });
            } else {
                resolve({
                    passed: true
                });
            }
        };
        img.onerror = ()=>resolve({
                passed: false,
                message: 'Corrupted image file'
            });
        img.src = dataUrl;
    });
}
}),
"[project]/src/app/(main)/scan/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScanPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-ssr] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-ssr] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-ssr] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AuthProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$imageValidation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/imageValidation.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const MAX_IMAGES = 1; // Simplified to 1-shot (multi-angle is optional advanced)
const API_URL = '/api/analyze';
const SCAN_METRICS = [
    'Mapping skin topology…',
    'Detecting acne zones…',
    'Analyzing skin texture…',
    'Checking hydration levels…',
    'Scanning for dark spots…',
    'Evaluating skin barrier…',
    'Assessing pore structure…'
];
const WIREFRAME_POINTS = [
    {
        x: 50,
        y: 12,
        d: 0
    },
    {
        x: 38,
        y: 18,
        d: 0.15
    },
    {
        x: 62,
        y: 18,
        d: 0.3
    },
    {
        x: 30,
        y: 28,
        d: 0.45
    },
    {
        x: 42,
        y: 30,
        d: 0.6
    },
    {
        x: 58,
        y: 30,
        d: 0.75
    },
    {
        x: 70,
        y: 28,
        d: 0.9
    },
    {
        x: 35,
        y: 36,
        d: 1.0
    },
    {
        x: 44,
        y: 37,
        d: 1.1
    },
    {
        x: 56,
        y: 37,
        d: 1.2
    },
    {
        x: 65,
        y: 36,
        d: 1.3
    },
    {
        x: 50,
        y: 44,
        d: 1.5
    },
    {
        x: 46,
        y: 50,
        d: 1.7
    },
    {
        x: 54,
        y: 50,
        d: 1.8
    },
    {
        x: 26,
        y: 48,
        d: 2.0
    },
    {
        x: 74,
        y: 48,
        d: 2.1
    },
    {
        x: 38,
        y: 60,
        d: 2.3
    },
    {
        x: 50,
        y: 63,
        d: 2.5
    },
    {
        x: 62,
        y: 60,
        d: 2.7
    },
    {
        x: 28,
        y: 68,
        d: 2.9
    },
    {
        x: 72,
        y: 68,
        d: 3.0
    },
    {
        x: 38,
        y: 76,
        d: 3.2
    },
    {
        x: 50,
        y: 80,
        d: 3.4
    },
    {
        x: 62,
        y: 76,
        d: 3.5
    }
];
const WIRE_LINES = [
    [
        50,
        12,
        38,
        18
    ],
    [
        50,
        12,
        62,
        18
    ],
    [
        38,
        18,
        30,
        28
    ],
    [
        62,
        18,
        70,
        28
    ],
    [
        30,
        28,
        42,
        30
    ],
    [
        70,
        28,
        58,
        30
    ],
    [
        42,
        30,
        50,
        44
    ],
    [
        58,
        30,
        50,
        44
    ],
    [
        30,
        28,
        35,
        36
    ],
    [
        70,
        28,
        65,
        36
    ],
    [
        35,
        36,
        44,
        37
    ],
    [
        65,
        36,
        56,
        37
    ],
    [
        50,
        44,
        46,
        50
    ],
    [
        50,
        44,
        54,
        50
    ],
    [
        26,
        48,
        30,
        28
    ],
    [
        74,
        48,
        70,
        28
    ],
    [
        26,
        48,
        28,
        68
    ],
    [
        74,
        48,
        72,
        68
    ],
    [
        38,
        60,
        50,
        63
    ],
    [
        62,
        60,
        50,
        63
    ],
    [
        28,
        68,
        38,
        76
    ],
    [
        72,
        68,
        62,
        76
    ],
    [
        38,
        76,
        50,
        80
    ],
    [
        62,
        76,
        50,
        80
    ],
    [
        35,
        36,
        26,
        48
    ],
    [
        65,
        36,
        74,
        48
    ],
    [
        44,
        37,
        38,
        60
    ],
    [
        56,
        37,
        62,
        60
    ]
];
function dataURLtoBlob(dataURL) {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
    const binary = atob(data);
    const array = new Uint8Array(binary.length);
    for(let i = 0; i < binary.length; i++)array[i] = binary.charCodeAt(i);
    return new Blob([
        array
    ], {
        type: mime
    });
}
function ScanPage() {
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [scanMode, setScanMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('choose');
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('init');
    const [statusText, setStatusText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('Preparing camera…');
    const [metricIdx, setMetricIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [cameraError, setCameraError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [apiError, setApiError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [analyzing, setAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasPrompted, setHasPrompted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Advanced Indicators
    const [indicators, setIndicators] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        position: false,
        lighting: false,
        sharpness: false,
        angle: false
    });
    // Multi-image state
    const [capturedImages, setCapturedImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [uploadImages, setUploadImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    /* ---- Sound helpers ---- */ const speak = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((text)=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const utterance = undefined;
        // Prefer a female English voice for a beauty app feel
        const voices = undefined;
        const femaleVoice = undefined;
    }, []);
    const playBeep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((freq = 800, dur = 0.12, vol = 0.06)=>{
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = freq;
            g.gain.value = vol;
            o.connect(g);
            g.connect(ctx.destination);
            o.start();
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            o.stop(ctx.currentTime + dur);
        } catch  {}
    }, []);
    const playChime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        [
            600,
            800,
            1050
        ].forEach((f, i)=>setTimeout(()=>playBeep(f, 0.25, 0.08), i * 160));
    }, [
        playBeep
    ]);
    const playShutter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        playBeep(1200, 0.06, 0.1);
        setTimeout(()=>playBeep(800, 0.06, 0.05), 80);
    }, [
        playBeep
    ]);
    /* ---- Capture frame from video ---- */ const captureFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
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
    /* ---- Camera start & Validation loop ---- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (scanMode !== 'camera') return;
        let isActive = true;
        let rafId;
        const start = async ()=>{
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',
                        width: {
                            ideal: 640
                        },
                        height: {
                            ideal: 480
                        }
                    },
                    audio: false
                });
                if (!isActive) {
                    stream.getTracks().forEach((t)=>t.stop());
                    return;
                }
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setPhase('position');
                    setStatusText(`Position your face within the frame`);
                    speak('Please position your face within the frame.');
                }
            } catch  {
                if (!isActive) return;
                setCameraError(true);
                setStatusText('Camera access denied');
            }
        };
        start();
        // The validation simulation loop
        let validSince = 0;
        const loop = async ()=>{
            if (!isActive) return;
            if (videoRef.current && videoRef.current.readyState === 4 && (phase === 'position' || phase === 'capture')) {
                const imgParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$imageValidation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["drawImageToCanvas"])(videoRef.current);
                if (imgParams) {
                    const { lightingOk, sharpnessOk } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$imageValidation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateImageData"])(imgParams.ctx, imgParams.width, imgParams.height);
                    setIndicators((prev)=>{
                        // Simulated angle & position logic (relies on clear, sharp, lit face staying still)
                        const positionOk = lightingOk && sharpnessOk;
                        const angleOk = positionOk;
                        const next = {
                            position: positionOk,
                            lighting: lightingOk,
                            sharpness: sharpnessOk,
                            angle: angleOk
                        };
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
        return ()=>{
            isActive = false;
            cancelAnimationFrame(rafId);
            streamRef.current?.getTracks().forEach((t)=>t.stop());
        };
    }, [
        scanMode,
        phase,
        speak
    ]);
    /* ---- Take snapshot ---- */ const takeSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (capturedImages.length >= MAX_IMAGES || phase !== 'position') return;
        const img = captureFrame();
        if (img) {
            setCapturedImages([
                img
            ]);
            playShutter();
            setPhase('review');
            setStatusText('Please review your capture');
            speak('Capture successful. Please review your capture.');
        }
    }, [
        capturedImages.length,
        captureFrame,
        playShutter,
        phase,
        speak
    ]);
    // Manual capture prompt logic
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        indicators,
        phase,
        hasPrompted,
        speak
    ]);
    /* ---- Upload handler ---- */ const handleUpload = async (e)=>{
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
        reader.onload = async ()=>{
            const dataUrl = reader.result;
            // Perform validation checks automatically post-upload
            const validation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$imageValidation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateStaticImage"])(dataUrl);
            if (!validation.passed) {
                setApiError(validation.message || 'Image rejected by quality validation.');
                return;
            }
            setUploadImages([
                dataUrl
            ]);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };
    /* ---- Analyze (shared logic for camera + upload) ---- */ const runAnalysis = async (images)=>{
        if (images.length === 0) return;
        setPhase('analyze');
        setAnalyzing(true);
        setApiError(null);
        setStatusText('Connecting to AI…');
        speak('Analyzing your skin, please wait.');
        try {
            sessionStorage.setItem('wbh_scan_image', images[0]);
            sessionStorage.setItem('wbh_scan_time', new Date().toISOString());
        } catch  {}
        try {
            const formData = new FormData();
            images.forEach((img, i)=>{
                const blob = dataURLtoBlob(img);
                formData.append(`file${i}`, blob, `scan_${i}.jpg`);
            });
            const metricInterval = setInterval(()=>{
                setMetricIdx((prev)=>(prev + 1) % SCAN_METRICS.length);
            }, 2500);
            const controller = new AbortController();
            const timeoutId = setTimeout(()=>controller.abort(), 120000);
            const res = await fetch(API_URL, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            clearInterval(metricInterval);
            if (!res.ok) {
                const errBody = await res.json().catch(()=>null);
                throw new Error(errBody?.error || `Server error (${res.status})`);
            }
            const data = await res.json();
            try {
                sessionStorage.setItem('wbh_analysis', JSON.stringify(data));
            } catch  {}
            // Outer Save
            try {
                const { createClient: mkClient } = await __turbopack_context__.A("[project]/src/lib/supabase/client.ts [app-ssr] (ecmascript, async loader)");
                const authClient = mkClient();
                const { data: { user: loggedInUser } } = await authClient.auth.getUser();
                if (loggedInUser) {
                    const scanId = crypto.randomUUID();
                    const conditions = data.detected_conditions || [];
                    const avgConfidence = conditions.length > 0 ? conditions.reduce((sum, c)=>sum + c.confidence, 0) / conditions.length : 0;
                    const score = Math.max(0, Math.round(100 - avgConfidence));
                    const storagePaths = [];
                    for(let i = 0; i < images.length; i++){
                        const { uploadScanImage: upload } = await __turbopack_context__.A("[project]/src/lib/supabase/storage.ts [app-ssr] (ecmascript, async loader)");
                        const blob = dataURLtoBlob(images[i]);
                        const path = await upload(loggedInUser.id, scanId, blob, i);
                        storagePaths.push(path);
                    }
                    if (storagePaths.length > 0) {
                        await fetch('/api/scans', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                analysis: data,
                                image_urls: storagePaths
                            })
                        }).catch(()=>{});
                    }
                }
            } catch  {}
            setPhase('done');
            setStatusText('✓ Scan complete!');
            playChime();
            setTimeout(()=>router.push('/analysis'), 1800);
        } catch (err) {
            const is503 = err instanceof Error && (err.message.includes('503') || err.message.includes('502'));
            const msg = err instanceof DOMException && err.name === 'AbortError' ? 'Request timed out. The AI server may be starting up — please retry.' : is503 ? 'The AI is currently experiencing high demand. Please try again in a few moments.' : err instanceof Error ? err.message : 'Analysis failed. Please try again.';
            speak('Analysis failed. Please try again.');
            setApiError(msg);
            setStatusText('Analysis failed');
            setAnalyzing(false);
            setPhase(scanMode === 'camera' ? 'review' : 'init');
        }
    };
    /* ============ CHOOSE MODE SCREEN ============ */ if (scanMode === 'choose') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "scn-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "scn-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard",
                            className: "scn-back",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 376,
                                columnNumber: 56
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 376,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-brand",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/wbhlogo.svg",
                                alt: "WBH"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 377,
                                columnNumber: 38
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 377,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-badge",
                            children: "READY"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 378,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 375,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scan-choose",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "scan-choose-title",
                            children: "How would you like to scan?"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 381,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "scan-choose-desc",
                            children: "For maximum accuracy, use the live camera feed."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 382,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-choose-options",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "scan-choose-card",
                                    onClick: ()=>setScanMode('camera'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "scan-choose-icon camera-icon",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                size: 32
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                                lineNumber: 385,
                                                columnNumber: 61
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 385,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Live Scan"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 386,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Real-time validation"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 387,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 384,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "scan-choose-card",
                                    onClick: ()=>setScanMode('upload'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "scan-choose-icon upload-icon",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                size: 32
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                                lineNumber: 390,
                                                columnNumber: 61
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 390,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Upload Photo"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 391,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Submit existing image"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 392,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 389,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 383,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 380,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(main)/scan/page.tsx",
            lineNumber: 374,
            columnNumber: 7
        }, this);
    }
    /* ============ UPLOAD MODE ============ */ if (scanMode === 'upload') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "scn-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "scn-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "scn-back",
                            onClick: ()=>{
                                setScanMode('choose');
                                setUploadImages([]);
                                setAnalyzing(false);
                                setApiError(null);
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 405,
                                columnNumber: 144
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 405,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-brand",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/wbhlogo.svg",
                                alt: "WBH"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 406,
                                columnNumber: 38
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 406,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-badge",
                            children: analyzing ? '● ANALYZING' : uploadImages.length > 0 ? 'READY' : 'SELECT'
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 407,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 404,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scan-upload-body",
                    children: [
                        uploadImages.length > 0 && !analyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-upload-preview",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: uploadImages[0],
                                alt: "Uploaded photo",
                                className: "scan-upload-img"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 413,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 412,
                            columnNumber: 13
                        }, this),
                        uploadImages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-upload-drop",
                            onClick: ()=>fileInputRef.current?.click(),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                    size: 48,
                                    strokeWidth: 1.5
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 420,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Select Photo"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 421,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Upload an image of the affected skin area for better accuracy (Max 20MB)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 422,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "scan-upload-hint",
                                    children: "JPG, PNG, HEIC"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 423,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 419,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: fileInputRef,
                            type: "file",
                            accept: "image/jpeg, image/png, image/heic",
                            onChange: handleUpload,
                            style: {
                                display: 'none'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 427,
                            columnNumber: 11
                        }, this),
                        analyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-analyzing-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "scn-loading-spinner"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 438,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontWeight: 600,
                                        marginTop: 12
                                    },
                                    children: SCAN_METRICS[metricIdx]
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 439,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 437,
                            columnNumber: 13
                        }, this),
                        apiError && !analyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '16px',
                                margin: '0 16px 12px',
                                background: 'rgba(229,57,53,0.12)',
                                borderRadius: 12,
                                textAlign: 'center',
                                border: '1px solid rgba(229,57,53,0.3)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#E53935',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        marginBottom: 8
                                    },
                                    children: "✓ Validation Issue"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 446,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#E53935',
                                        fontSize: '0.85rem'
                                    },
                                    children: apiError
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 447,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 445,
                            columnNumber: 13
                        }, this),
                        uploadImages.length > 0 && !analyzing && !apiError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-upload-actions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-outline",
                                    onClick: ()=>setUploadImages([]),
                                    children: "Upload Another"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 454,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-primary",
                                    onClick: ()=>runAnalysis(uploadImages),
                                    children: "Analyse My Skin"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 457,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 453,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 409,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(main)/scan/page.tsx",
            lineNumber: 403,
            columnNumber: 7
        }, this);
    }
    /* ============ CAMERA MODE ============ */ const allIndicatorsOk = indicators.position && indicators.lighting && indicators.sharpness && indicators.angle;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "scn-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "scn-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "scn-back",
                        onClick: ()=>{
                            setScanMode('choose');
                            setCapturedImages([]);
                            streamRef.current?.getTracks().forEach((t)=>t.stop());
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 473,
                            columnNumber: 159
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 473,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scn-brand",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/images/wbhlogo.svg",
                            alt: "WBH"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 474,
                            columnNumber: 36
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `scn-badge ${phase === 'done' ? 'done' : 'live'}`,
                        children: phase === 'done' ? '✓ DONE' : phase === 'review' ? 'REVIEW' : 'LIVE'
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 475,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(main)/scan/page.tsx",
                lineNumber: 472,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scn-body",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scn-viewport",
                    children: [
                        phase === 'review' && capturedImages[0] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: capturedImages[0],
                            alt: "Captured Review",
                            style: {
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transform: 'scaleX(-1)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 483,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: videoRef,
                            className: "scn-video",
                            playsInline: true,
                            muted: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 485,
                            columnNumber: 13
                        }, this),
                        (phase === 'analyze' || phase === 'done') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "wire-layer",
                            children: [
                                WIREFRAME_POINTS.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "wd",
                                        style: {
                                            left: `${p.x}%`,
                                            top: `${p.y}%`,
                                            animationDelay: `${p.d}s`
                                        }
                                    }, i, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 492,
                                        columnNumber: 17
                                    }, this)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "wl",
                                    viewBox: "0 0 100 100",
                                    preserveAspectRatio: "none",
                                    children: WIRE_LINES.map(([x1, y1, x2, y2], i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: x1,
                                            y1: y1,
                                            x2: x2,
                                            y2: y2
                                        }, i, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 496,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 494,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 490,
                            columnNumber: 13
                        }, this),
                        phase === 'analyze' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-upload-overlay",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "scn-loading-spinner"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 505,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: SCAN_METRICS[metricIdx]
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 506,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 504,
                            columnNumber: 13
                        }, this),
                        phase === 'init' && !cameraError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-loading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "scn-loading-spinner"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 513,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Preparing camera…"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 514,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 512,
                            columnNumber: 13
                        }, this),
                        cameraError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-error",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '1.5rem',
                                        marginBottom: 8
                                    },
                                    children: "🔒"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 521,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontWeight: 600
                                    },
                                    children: "Camera access denied"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 522,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '0.8rem',
                                        opacity: 0.6,
                                        marginTop: 6
                                    },
                                    children: "Enable camera in browser settings and reload"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 523,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 520,
                            columnNumber: 13
                        }, this),
                        phase === 'position' && !cameraError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `scn-oval ${allIndicatorsOk ? 'complete' : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bk tl"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 532,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bk tr"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 532,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bk bl"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 533,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bk br"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 533,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "oval-label",
                                        children: "Center Face Here"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 534,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 531,
                                columnNumber: 15
                            }, this)
                        }, void 0, false)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 481,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/scan/page.tsx",
                lineNumber: 480,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "scn-hud",
                children: [
                    analyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scn-metric",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                size: 13
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 542,
                                columnNumber: 51
                            }, this),
                            " ",
                            SCAN_METRICS[metricIdx]
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 542,
                        columnNumber: 23
                    }, this),
                    phase === 'position' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scn-status phase-position",
                        style: {
                            color: allIndicatorsOk ? 'var(--primary)' : 'var(--text-secondary)'
                        },
                        children: statusText
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 545,
                        columnNumber: 11
                    }, this),
                    apiError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            padding: '10px 16px',
                            margin: '8px 0',
                            background: 'rgba(229,57,53,0.12)',
                            borderRadius: 10,
                            textAlign: 'center'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                color: '#E53935',
                                fontSize: '0.82rem',
                                fontWeight: 600
                            },
                            children: [
                                "⚠ ",
                                apiError
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 552,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 551,
                        columnNumber: 11
                    }, this),
                    phase === 'position' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "validation-hud",
                        style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 6,
                            justifyContent: 'center',
                            marginBottom: 16
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...validationPillStyle(indicators.position)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: "Face Position"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 559,
                                        columnNumber: 74
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: indicators.position ? '✓' : '✗'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 559,
                                        columnNumber: 99
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 559,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...validationPillStyle(indicators.lighting)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: "Lighting"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 560,
                                        columnNumber: 74
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: indicators.lighting ? '✓' : '✗'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 560,
                                        columnNumber: 94
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 560,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...validationPillStyle(indicators.sharpness)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: "Sharpness"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 561,
                                        columnNumber: 75
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: indicators.sharpness ? '✓' : '✗'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 561,
                                        columnNumber: 96
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 561,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...validationPillStyle(indicators.angle)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: "Angle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 562,
                                        columnNumber: 71
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: indicators.angle ? '✓' : '✗'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 562,
                                        columnNumber: 88
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 562,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 558,
                        columnNumber: 11
                    }, this),
                    phase === 'position' && !analyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scan-camera-controls",
                        style: {
                            marginTop: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "scan-shutter-btn",
                                onClick: takeSnapshot,
                                "aria-label": "Take photo",
                                disabled: !allIndicatorsOk,
                                style: {
                                    opacity: allIndicatorsOk ? 1 : 0.4,
                                    cursor: allIndicatorsOk ? 'pointer' : 'not-allowed'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "scan-shutter-inner"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 576,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 569,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '0.75rem',
                                    opacity: 0.5,
                                    marginTop: 12
                                },
                                children: "Align indicators to unlock camera"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 578,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 568,
                        columnNumber: 11
                    }, this),
                    phase === 'review' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scan-upload-actions",
                        style: {
                            padding: '0 20px',
                            marginTop: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-outline",
                                onClick: ()=>{
                                    setPhase('position');
                                    setCapturedImages([]);
                                    setStatusText('Position your face within the frame');
                                },
                                children: "Retake"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 587,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "btn btn-primary",
                                onClick: ()=>runAnalysis(capturedImages),
                                children: "Analyse My Skin"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 593,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 586,
                        columnNumber: 12
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(main)/scan/page.tsx",
                lineNumber: 541,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(main)/scan/page.tsx",
        lineNumber: 471,
        columnNumber: 5
    }, this);
}
// Inline styles for quick layout
function validationPillStyle(ok) {
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
        transition: 'all 0.3s ease'
    };
}
}),
];

//# sourceMappingURL=src_8b1afda6._.js.map