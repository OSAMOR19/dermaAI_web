module.exports = [
"[project]/.next-internal/server/app/api/analyze/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/app/api/analyze/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
const DERMA_PROMPT = `You are an AI dermatology analysis assistant.

The user has uploaded one or more skin images (possibly from different angles or areas).
Analyze ALL provided images together to give a comprehensive assessment.

IMPORTANT RULES:
- Only analyze what is visually observable in the images.
- Do NOT guess if the images are unclear.
- If the image quality is poor, return "image_quality: poor".
- Do NOT provide a medical diagnosis.
- Only provide possible conditions based on visual patterns.
- When multiple images are provided, cross-reference observations across all images for more accurate analysis.
- Always return STRICT JSON with no additional text.

Analyze the images for signs of the following skin conditions:

- acne
- eczema
- psoriasis
- rosacea
- fungal infection
- hyperpigmentation
- dermatitis
- rash
- normal skin

Return the response in the following JSON structure:

{
  "image_quality": "good | moderate | poor",
  "images_analyzed": number,
  "detected_conditions": [
    {
      "condition": "name of condition",
      "confidence": number from 0 to 100,
      "observations": [
        "visible redness",
        "raised bumps",
        "dry patches"
      ],
      "severity": "low | moderate | high"
    }
  ],
  "skin_type_estimate": "oily | dry | combination | normal | unknown",
  "recommendations": [
    "gentle cleansing",
    "avoid irritants",
    "consult dermatologist if symptoms persist"
  ],
  "warning_signs": [
    "rapidly spreading rash",
    "severe inflammation"
  ],
  "disclaimer": "This AI analysis is for informational purposes only and is not a medical diagnosis. Consult a licensed dermatologist for medical advice."
}

If no condition is detected, return:

"detected_conditions": []

Do not return any explanation outside the JSON object.`;
async function POST(request) {
    try {
        if (!GEMINI_API_KEY) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Gemini API key not configured'
            }, {
                status: 500
            });
        }
        const formData = await request.formData();
        // Collect all image files (file0, file1, file2, file3 or single 'file')
        const imageParts = [];
        // Support single file upload (backward compat)
        const singleFile = formData.get('file');
        if (singleFile) {
            const arrayBuffer = await singleFile.arrayBuffer();
            const base64Data = Buffer.from(arrayBuffer).toString('base64');
            imageParts.push({
                inline_data: {
                    mime_type: singleFile.type || 'image/jpeg',
                    data: base64Data
                }
            });
        }
        // Support multiple files (file0, file1, file2, file3)
        for(let i = 0; i < 4; i++){
            const file = formData.get(`file${i}`);
            if (file) {
                const arrayBuffer = await file.arrayBuffer();
                const base64Data = Buffer.from(arrayBuffer).toString('base64');
                imageParts.push({
                    inline_data: {
                        mime_type: file.type || 'image/jpeg',
                        data: base64Data
                    }
                });
            }
        }
        if (imageParts.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No image files provided'
            }, {
                status: 400
            });
        }
        // Build Gemini request with prompt + all images
        const parts = [
            {
                text: DERMA_PROMPT
            },
            ...imageParts
        ];
        const geminiResponse = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts
                    }
                ],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 2048,
                    responseMimeType: 'application/json'
                }
            })
        });
        if (!geminiResponse.ok) {
            const errText = await geminiResponse.text();
            console.error('Gemini API error:', geminiResponse.status, errText);
            if (geminiResponse.status === 429) {
                let retryMsg = 'AI rate limit reached. Please wait 30 seconds and try again.';
                try {
                    const errJson = JSON.parse(errText);
                    const retryInfo = errJson?.error?.details?.find((d)=>d['@type']?.includes('RetryInfo'));
                    if (retryInfo?.retryDelay) {
                        retryMsg = `AI rate limit reached. Please retry in ${retryInfo.retryDelay}.`;
                    }
                } catch  {}
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: retryMsg
                }, {
                    status: 429
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `AI service error (${geminiResponse.status})`
            }, {
                status: 502
            });
        }
        const geminiData = await geminiResponse.json();
        const textContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textContent) {
            console.error('No text in Gemini response:', JSON.stringify(geminiData));
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'AI returned an empty response'
            }, {
                status: 502
            });
        }
        let analysis;
        try {
            analysis = JSON.parse(textContent);
        } catch  {
            const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch) {
                analysis = JSON.parse(jsonMatch[1].trim());
            } else {
                console.error('Failed to parse Gemini JSON:', textContent);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: 'AI returned invalid response format'
                }, {
                    status: 502
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(analysis);
    } catch (error) {
        console.error('Analysis route error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error during analysis'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6e7df709._.js.map