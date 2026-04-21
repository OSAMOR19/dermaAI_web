(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/imageValidation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/(main)/scan/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScanPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/activity.js [app-client] (ecmascript) <export default as Activity>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/camera.js [app-client] (ecmascript) <export default as Camera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-client] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AuthProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$imageValidation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/imageValidation.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
    var _header_match;
    const [header, data] = dataURL.split(',');
    const mime = ((_header_match = header.match(/:(.*?);/)) === null || _header_match === void 0 ? void 0 : _header_match[1]) || 'image/jpeg';
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
    _s();
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [scanMode, setScanMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('choose');
    const [phase, setPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('init');
    const [statusText, setStatusText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Preparing camera…');
    const [metricIdx, setMetricIdx] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [cameraError, setCameraError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [apiError, setApiError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [analyzing, setAnalyzing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasPrompted, setHasPrompted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Advanced Indicators
    const [indicators, setIndicators] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        position: false,
        lighting: false,
        sharpness: false,
        angle: false
    });
    // Multi-image state
    const [capturedImages, setCapturedImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [uploadImages, setUploadImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    /* ---- Sound helpers ---- */ const speak = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScanPage.useCallback[speak]": (text)=>{
            if ("object" === 'undefined' || !window.speechSynthesis) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.volume = 1;
            utterance.rate = 0.95;
            utterance.pitch = 1.1;
            // Prefer a female English voice for a beauty app feel
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find({
                "ScanPage.useCallback[speak]": (v)=>v.lang.startsWith('en') && /samantha|victoria|karen|fiona|moira|tessa|female|woman/i.test(v.name)
            }["ScanPage.useCallback[speak]"]) || voices.find({
                "ScanPage.useCallback[speak]": (v)=>v.lang.startsWith('en') && !/male|guy|daniel|thomas|alex|fred|junior|ralph/i.test(v.name)
            }["ScanPage.useCallback[speak]"]) || voices.find({
                "ScanPage.useCallback[speak]": (v)=>v.lang.startsWith('en')
            }["ScanPage.useCallback[speak]"]);
            if (femaleVoice) utterance.voice = femaleVoice;
            window.speechSynthesis.speak(utterance);
        }
    }["ScanPage.useCallback[speak]"], []);
    const playBeep = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScanPage.useCallback[playBeep]": function() {
            let freq = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 800, dur = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0.12, vol = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0.06;
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
            } catch (e) {}
        }
    }["ScanPage.useCallback[playBeep]"], []);
    const playChime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScanPage.useCallback[playChime]": ()=>{
            [
                600,
                800,
                1050
            ].forEach({
                "ScanPage.useCallback[playChime]": (f, i)=>setTimeout({
                        "ScanPage.useCallback[playChime]": ()=>playBeep(f, 0.25, 0.08)
                    }["ScanPage.useCallback[playChime]"], i * 160)
            }["ScanPage.useCallback[playChime]"]);
        }
    }["ScanPage.useCallback[playChime]"], [
        playBeep
    ]);
    const playShutter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScanPage.useCallback[playShutter]": ()=>{
            playBeep(1200, 0.06, 0.1);
            setTimeout({
                "ScanPage.useCallback[playShutter]": ()=>playBeep(800, 0.06, 0.05)
            }["ScanPage.useCallback[playShutter]"], 80);
        }
    }["ScanPage.useCallback[playShutter]"], [
        playBeep
    ]);
    /* ---- Capture frame from video ---- */ const captureFrame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScanPage.useCallback[captureFrame]": ()=>{
            const video = videoRef.current;
            if (!video) return null;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/jpeg', 0.85);
        }
    }["ScanPage.useCallback[captureFrame]"], []);
    /* ---- Camera start & Validation loop ---- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScanPage.useEffect": ()=>{
            if (scanMode !== 'camera') return;
            let isActive = true;
            let rafId;
            const start = {
                "ScanPage.useEffect.start": async ()=>{
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
                            stream.getTracks().forEach({
                                "ScanPage.useEffect.start": (t)=>t.stop()
                            }["ScanPage.useEffect.start"]);
                            return;
                        }
                        streamRef.current = stream;
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                            await videoRef.current.play();
                            setPhase('position');
                            setStatusText("Position your face within the frame");
                            speak('Please position your face within the frame.');
                        }
                    } catch (e) {
                        if (!isActive) return;
                        setCameraError(true);
                        setStatusText('Camera access denied');
                    }
                }
            }["ScanPage.useEffect.start"];
            start();
            // The validation simulation loop
            let validSince = 0;
            const loop = {
                "ScanPage.useEffect.loop": async ()=>{
                    if (!isActive) return;
                    if (videoRef.current && videoRef.current.readyState === 4 && (phase === 'position' || phase === 'capture')) {
                        const imgParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$imageValidation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["drawImageToCanvas"])(videoRef.current);
                        if (imgParams) {
                            const { lightingOk, sharpnessOk } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$imageValidation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateImageData"])(imgParams.ctx, imgParams.width, imgParams.height);
                            setIndicators({
                                "ScanPage.useEffect.loop": (prev)=>{
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
                                        setStatusText("Position your face within the frame");
                                    }
                                    return next;
                                }
                            }["ScanPage.useEffect.loop"]);
                        }
                    }
                    rafId = requestAnimationFrame(loop);
                }
            }["ScanPage.useEffect.loop"];
            rafId = requestAnimationFrame(loop);
            return ({
                "ScanPage.useEffect": ()=>{
                    var _streamRef_current;
                    isActive = false;
                    cancelAnimationFrame(rafId);
                    (_streamRef_current = streamRef.current) === null || _streamRef_current === void 0 ? void 0 : _streamRef_current.getTracks().forEach({
                        "ScanPage.useEffect": (t)=>t.stop()
                    }["ScanPage.useEffect"]);
                }
            })["ScanPage.useEffect"];
        }
    }["ScanPage.useEffect"], [
        scanMode,
        phase,
        speak
    ]);
    /* ---- Take snapshot ---- */ const takeSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ScanPage.useCallback[takeSnapshot]": ()=>{
            if (capturedImages.length >= MAX_IMAGES || phase !== 'position') return null;
            const img = captureFrame();
            if (img) {
                setCapturedImages([
                    img
                ]);
                playShutter();
                // Bypass the extra review screen completely
                setPhase('analyze');
                setStatusText('Processing your result...');
                speak('Capture successful. Processing your AI results now.');
                return img;
            }
            return null;
        }
    }["ScanPage.useCallback[takeSnapshot]"], [
        capturedImages.length,
        captureFrame,
        playShutter,
        phase,
        speak
    ]);
    // Manual capture prompt logic
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScanPage.useEffect": ()=>{
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
        }
    }["ScanPage.useEffect"], [
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
            const validation = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$imageValidation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["validateStaticImage"])(dataUrl);
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
        } catch (e) {}
        try {
            const formData = new FormData();
            images.forEach((img, i)=>{
                const blob = dataURLtoBlob(img);
                formData.append("file".concat(i), blob, "scan_".concat(i, ".jpg"));
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
                throw new Error((errBody === null || errBody === void 0 ? void 0 : errBody.error) || "Server error (".concat(res.status, ")"));
            }
            const data = await res.json();
            try {
                sessionStorage.setItem('wbh_analysis', JSON.stringify(data));
            } catch (e) {}
            // Outer Save
            try {
                const { createClient: mkClient } = await __turbopack_context__.A("[project]/src/lib/supabase/client.ts [app-client] (ecmascript, async loader)");
                const authClient = mkClient();
                const { data: { user: loggedInUser } } = await authClient.auth.getUser();
                if (loggedInUser) {
                    const scanId = crypto.randomUUID();
                    const conditions = data.detected_conditions || [];
                    const avgConfidence = conditions.length > 0 ? conditions.reduce((sum, c)=>sum + c.confidence, 0) / conditions.length : 0;
                    const score = Math.max(0, Math.round(100 - avgConfidence));
                    const storagePaths = [];
                    for(let i = 0; i < images.length; i++){
                        const { uploadScanImage: upload } = await __turbopack_context__.A("[project]/src/lib/supabase/storage.ts [app-client] (ecmascript, async loader)");
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
            } catch (e) {}
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "scn-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "scn-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard",
                            className: "scn-back",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 379,
                                columnNumber: 56
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 379,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-brand",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/wbhlogo.svg",
                                alt: "WBH"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 380,
                                columnNumber: 38
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 380,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-badge",
                            children: "READY"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 381,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 378,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scan-choose",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "scan-choose-title",
                            children: "How would you like to scan?"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 384,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "scan-choose-desc",
                            children: "For maximum accuracy, use the live camera feed."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 385,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-choose-options",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "scan-choose-card",
                                    onClick: ()=>setScanMode('camera'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "scan-choose-icon camera-icon",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Camera$3e$__["Camera"], {
                                                size: 32
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                                lineNumber: 388,
                                                columnNumber: 61
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 388,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Live Scan"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 389,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Real-time validation"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 390,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 387,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "scan-choose-card",
                                    onClick: ()=>setScanMode('upload'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "scan-choose-icon upload-icon",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                size: 32
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                                lineNumber: 393,
                                                columnNumber: 61
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 393,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            children: "Upload Photo"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 394,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Submit existing image"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 395,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 392,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 386,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 383,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(main)/scan/page.tsx",
            lineNumber: 377,
            columnNumber: 7
        }, this);
    }
    /* ============ UPLOAD MODE ============ */ if (scanMode === 'upload') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "scn-page",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: "scn-header",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "scn-back",
                            onClick: ()=>{
                                setScanMode('choose');
                                setUploadImages([]);
                                setAnalyzing(false);
                                setApiError(null);
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                size: 20
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 408,
                                columnNumber: 144
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 408,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-brand",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/images/wbhlogo.svg",
                                alt: "WBH"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 409,
                                columnNumber: 38
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 409,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-badge",
                            children: analyzing ? '● ANALYZING' : uploadImages.length > 0 ? 'READY' : 'SELECT'
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 410,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 407,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scan-upload-body",
                    children: [
                        uploadImages.length > 0 && !analyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-upload-preview",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: uploadImages[0],
                                alt: "Uploaded photo",
                                className: "scan-upload-img"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 416,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 415,
                            columnNumber: 13
                        }, this),
                        uploadImages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-upload-drop",
                            onClick: ()=>{
                                var _fileInputRef_current;
                                return (_fileInputRef_current = fileInputRef.current) === null || _fileInputRef_current === void 0 ? void 0 : _fileInputRef_current.click();
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                    size: 48,
                                    strokeWidth: 1.5
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 423,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    children: "Select Photo"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 424,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Upload an image of the affected skin area for better accuracy (Max 20MB)"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 425,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "scan-upload-hint",
                                    children: "JPG, PNG, HEIC"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 426,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 422,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            ref: fileInputRef,
                            type: "file",
                            accept: "image/jpeg, image/png, image/heic",
                            onChange: handleUpload,
                            style: {
                                display: 'none'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 430,
                            columnNumber: 11
                        }, this),
                        analyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-analyzing-card",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "scn-loading-spinner"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 441,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontWeight: 600,
                                        marginTop: 12
                                    },
                                    children: SCAN_METRICS[metricIdx]
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 442,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 440,
                            columnNumber: 13
                        }, this),
                        apiError && !analyzing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: '16px',
                                margin: '0 16px 12px',
                                background: 'rgba(229,57,53,0.12)',
                                borderRadius: 12,
                                textAlign: 'center',
                                border: '1px solid rgba(229,57,53,0.3)'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#E53935',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        marginBottom: 8
                                    },
                                    children: "✓ Validation Issue"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 449,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: '#E53935',
                                        fontSize: '0.85rem'
                                    },
                                    children: apiError
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 450,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 448,
                            columnNumber: 13
                        }, this),
                        uploadImages.length > 0 && !analyzing && !apiError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scan-upload-actions",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-outline",
                                    onClick: ()=>setUploadImages([]),
                                    children: "Upload Another"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 457,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "btn btn-primary",
                                    onClick: ()=>runAnalysis(uploadImages),
                                    children: "Analyse My Skin"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 460,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 456,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 412,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(main)/scan/page.tsx",
            lineNumber: 406,
            columnNumber: 7
        }, this);
    }
    /* ============ CAMERA MODE ============ */ const allIndicatorsOk = indicators.position && indicators.lighting && indicators.sharpness && indicators.angle;
    /* ---- DEDICATED PROCESSING SCREEN (replaces camera completely) ---- */ if (phase === 'analyze' || phase === 'done') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "scn-page",
            style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100dvh',
                background: 'var(--bg, #0a0a0a)'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        textAlign: 'center',
                        padding: '0 32px',
                        maxWidth: 360
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: 'relative',
                                width: 120,
                                height: 120,
                                margin: '0 auto 32px'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        inset: 0,
                                        borderRadius: '50%',
                                        background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)',
                                        animation: 'pulse 2s ease-in-out infinite'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 480,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        inset: 12,
                                        borderRadius: '50%',
                                        background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 70%)',
                                        animation: 'pulse 2s ease-in-out infinite 0.4s'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 485,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        position: 'absolute',
                                        inset: 24,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(236,72,153,0.12)',
                                        border: '2px solid rgba(236,72,153,0.5)'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$activity$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Activity$3e$__["Activity"], {
                                        size: 32,
                                        color: "#ec4899"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 495,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 490,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 479,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: '1.4rem',
                                fontWeight: 700,
                                color: 'var(--text, #fff)',
                                marginBottom: 10
                            },
                            children: phase === 'done' ? '✓ Scan Complete!' : 'Analysing Your Skin'
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 499,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.55)',
                                marginBottom: 28,
                                lineHeight: 1.6
                            },
                            children: phase === 'done' ? 'Taking you to your results…' : 'Our AI is carefully examining your skin. This usually takes 10–15 seconds.'
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 502,
                            columnNumber: 11
                        }, this),
                        phase === 'analyze' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        padding: '10px 20px',
                                        borderRadius: 30,
                                        background: 'rgba(236,72,153,0.08)',
                                        border: '1px solid rgba(236,72,153,0.2)',
                                        color: '#ec4899',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        marginBottom: 20
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "scn-loading-spinner",
                                            style: {
                                                width: 12,
                                                height: 12
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 517,
                                            columnNumber: 17
                                        }, this),
                                        SCAN_METRICS[metricIdx]
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 511,
                                    columnNumber: 15
                                }, this),
                                apiError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        padding: '14px 20px',
                                        borderRadius: 12,
                                        background: 'rgba(229,57,53,0.12)',
                                        border: '1px solid rgba(229,57,53,0.3)',
                                        textAlign: 'center'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#E53935',
                                                fontSize: '0.88rem',
                                                fontWeight: 600,
                                                marginBottom: 6
                                            },
                                            children: "⚠ AI Unavailable"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 524,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: '#E53935',
                                                fontSize: '0.8rem',
                                                opacity: 0.85
                                            },
                                            children: apiError
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 525,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "btn btn-primary",
                                            style: {
                                                marginTop: 14,
                                                width: '100%'
                                            },
                                            onClick: ()=>{
                                                setApiError(null);
                                                setAnalyzing(false);
                                                setPhase('position');
                                                setStatusText('Position your face within the frame');
                                            },
                                            children: "Try Again"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                                            lineNumber: 526,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 523,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 477,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                    children: "\n          @keyframes pulse {\n            0%, 100% { transform: scale(1); opacity: 0.6; }\n            50% { transform: scale(1.15); opacity: 1; }\n          }\n        "
                }, void 0, false, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 544,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/(main)/scan/page.tsx",
            lineNumber: 476,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "scn-page",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "scn-header",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "scn-back",
                        onClick: ()=>{
                            var _streamRef_current;
                            setScanMode('choose');
                            setCapturedImages([]);
                            (_streamRef_current = streamRef.current) === null || _streamRef_current === void 0 ? void 0 : _streamRef_current.getTracks().forEach((t)=>t.stop());
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 557,
                            columnNumber: 159
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 557,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scn-brand",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/images/wbhlogo.svg",
                            alt: "WBH"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 558,
                            columnNumber: 36
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 558,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scn-badge live",
                        children: "LIVE"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 559,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(main)/scan/page.tsx",
                lineNumber: 556,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "scn-body",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "scn-viewport",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: videoRef,
                            className: "scn-video",
                            playsInline: true,
                            muted: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 564,
                            columnNumber: 11
                        }, this),
                        phase === 'init' && !cameraError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-loading",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "scn-loading-spinner"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 569,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    children: "Preparing camera…"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 570,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 568,
                            columnNumber: 13
                        }, this),
                        cameraError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "scn-error",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '1.5rem',
                                        marginBottom: 8
                                    },
                                    children: "🔒"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 577,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontWeight: 600
                                    },
                                    children: "Camera access denied"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 578,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: '0.8rem',
                                        opacity: 0.6,
                                        marginTop: 6
                                    },
                                    children: "Enable camera in browser settings and reload"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 579,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(main)/scan/page.tsx",
                            lineNumber: 576,
                            columnNumber: 13
                        }, this),
                        phase === 'position' && !cameraError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "scn-oval ".concat(allIndicatorsOk ? 'complete' : ''),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bk tl"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 587,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bk tr"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 587,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bk bl"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 588,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bk br"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 588,
                                        columnNumber: 49
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "oval-label",
                                        children: "Center Face Here"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 589,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 586,
                                columnNumber: 15
                            }, this)
                        }, void 0, false)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                    lineNumber: 563,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(main)/scan/page.tsx",
                lineNumber: 562,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "scn-hud",
                children: [
                    phase === 'position' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scn-status phase-position",
                        style: {
                            color: allIndicatorsOk ? 'var(--primary)' : 'var(--text-secondary)'
                        },
                        children: statusText
                    }, void 0, false, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 598,
                        columnNumber: 11
                    }, this),
                    phase === 'position' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "validation-hud",
                        style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 6,
                            justifyContent: 'center',
                            marginBottom: 16
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...validationPillStyle(indicators.position)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: "Face Position"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 606,
                                        columnNumber: 74
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: indicators.position ? '✓' : '✗'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 606,
                                        columnNumber: 99
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 606,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...validationPillStyle(indicators.lighting)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: "Lighting"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 607,
                                        columnNumber: 74
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: indicators.lighting ? '✓' : '✗'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 607,
                                        columnNumber: 94
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 607,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...validationPillStyle(indicators.sharpness)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: "Sharpness"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 608,
                                        columnNumber: 75
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: indicators.sharpness ? '✓' : '✗'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 608,
                                        columnNumber: 96
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 608,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...validationPillStyle(indicators.angle)
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: "Angle"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 609,
                                        columnNumber: 71
                                    }, this),
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: indicators.angle ? '✓' : '✗'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                                        lineNumber: 609,
                                        columnNumber: 88
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 609,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 605,
                        columnNumber: 11
                    }, this),
                    phase === 'position' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "scan-camera-controls",
                        style: {
                            marginTop: 0
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "scan-shutter-btn",
                                onClick: ()=>{
                                    const img = takeSnapshot();
                                    if (img) runAnalysis([
                                        img
                                    ]);
                                },
                                "aria-label": "Take photo",
                                disabled: !allIndicatorsOk,
                                style: {
                                    opacity: allIndicatorsOk ? 1 : 0.4,
                                    cursor: allIndicatorsOk ? 'pointer' : 'not-allowed'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "scan-shutter-inner"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(main)/scan/page.tsx",
                                    lineNumber: 626,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 616,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: '0.75rem',
                                    opacity: 0.5,
                                    marginTop: 12
                                },
                                children: "Align indicators to unlock camera"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(main)/scan/page.tsx",
                                lineNumber: 628,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(main)/scan/page.tsx",
                        lineNumber: 615,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(main)/scan/page.tsx",
                lineNumber: 596,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(main)/scan/page.tsx",
        lineNumber: 555,
        columnNumber: 5
    }, this);
}
_s(ScanPage, "/mQzFioDs+ymjXVz5rFA2ZQXpMg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AuthProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = ScanPage;
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
var _c;
__turbopack_context__.k.register(_c, "ScanPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_7ef435c2._.js.map