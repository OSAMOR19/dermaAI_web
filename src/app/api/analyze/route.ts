import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const DERMA_PROMPT = `You are an AI dermatology analysis assistant.

The user has uploaded one or more skin images.
First, perform validation on the image(s):
1. Check if there is a human face/skin area in the image. If there are NO faces or clear skin areas, set "validation_error" to "no_face_detected".
2. Check if there are MULTIPLE human faces present in the image(s). If you detect more than one face, set "validation_error" to "multiple_faces_detected".
3. Check if the image quality is too low (e.g., extremely blurry, out of focus, extremely dark, or not a skin image). If so, set "validation_error" to "low_quality".

If "validation_error" is set, you do NOT need to perform skin condition analysis. Just return the JSON with the "validation_error" field populated and "detected_conditions" as an empty array.

Otherwise, analyze the image(s) for signs of the following strict list of 12 skin conditions:

- Acne (Inflammatory)
- Acne (Comedonal)
- Hyperpigmentation
- Melasma
- Dark Spots / Sun Damage
- Rosacea
- Dehydration
- Oily Skin / Excess Sebum
- Fine Lines / Wrinkles
- Dark Circles
- Enlarged Pores
- Uneven Skin Tone

Return the response in the following strict JSON format ONLY:

{
  "image_quality": "good" | "poor",
  "validation_error": null | "no_face_detected" | "multiple_faces_detected" | "low_quality",
  "images_analyzed": 1,
  "detected_conditions": [
    {
      "condition": "Must be an EXACT MATCH to one of the 12 allowed conditions above (e.g. 'Melasma' or 'Acne (Inflammatory)')",
      "confidence": 85,
      "observations": [
        "visible redness",
        "raised bumps"
      ],
      "severity": "Moderate",
      "clinical_explanation": "A very brief 1-sentence explanation of this condition based on the observations, strictly avoiding the word 'clinical'.",
      "active_ingredients": ["Salicylic Acid", "Niacinamide"]
    }
  ],
  "skin_type_estimate": "oily" | "dry" | "normal" | "combination",
  "confidence_score": 85, // Overall analysis confidence/quality score (0-100) based on image clarity and quality
  "disclaimer": "This AI analysis is for informational purposes only and does not constitute medical advice."
}

If no condition is detected, return an empty array for detected_conditions.
Do not return any explanation outside the JSON object.`;

const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
];

function getGeminiUrl(model: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
}

async function callGeminiWithRetry(
  parts: ({ text: string } | { inline_data: { mime_type: string; data: string } })[],
  maxRetries = 3
) {
  const body = JSON.stringify({
    contents: [{ parts }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  });

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      console.log(`Gemini attempt ${attempt + 1}/${maxRetries} with model ${model}`);

      const response = await fetch(getGeminiUrl(model), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        return { response, model };
      }

      const status = response.status;
      console.error(`Gemini ${model} error (attempt ${attempt + 1}):`, status);

      // Only retry on 503 (overloaded) or 429 (rate limit)
      if (status !== 503 && status !== 429) {
        const errText = await response.text();
        throw new Error(`AI service error (${status}): ${errText}`);
      }

      // Wait before retrying: 2s, 4s, 8s
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt + 1) * 1000;
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    console.log(`All retries exhausted for ${model}, trying next model...`);
  }

  throw new Error('AI_OVERLOADED');
}

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    // Collect all image files (file0, file1, file2, file3 or single 'file')
    const imageParts: { inline_data: { mime_type: string; data: string } }[] = [];

    // Support single file upload (backward compat)
    const singleFile = formData.get('file') as File | null;
    if (singleFile) {
      const arrayBuffer = await singleFile.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
      imageParts.push({
        inline_data: {
          mime_type: singleFile.type || 'image/jpeg',
          data: base64Data,
        },
      });
    }

    // Support multiple files (file0, file1, file2, file3)
    for (let i = 0; i < 4; i++) {
      const file = formData.get(`file${i}`) as File | null;
      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString('base64');
        imageParts.push({
          inline_data: {
            mime_type: file.type || 'image/jpeg',
            data: base64Data,
          },
        });
      }
    }

    if (imageParts.length === 0) {
      return NextResponse.json(
        { error: 'No image files provided' },
        { status: 400 }
      );
    }

    // Build Gemini request with prompt + all images
    const parts: ({ text: string } | { inline_data: { mime_type: string; data: string } })[] = [
      { text: DERMA_PROMPT },
      ...imageParts,
    ];

    let geminiData;
    try {
      const { response } = await callGeminiWithRetry(parts);
      geminiData = await response.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg === 'AI_OVERLOADED') {
        return NextResponse.json(
          { error: 'Our AI is experiencing very high demand right now. Please wait a moment and try again.' },
          { status: 503 }
        );
      }
      console.error('Gemini call failed:', msg);
      return NextResponse.json(
        { error: `AI service error` },
        { status: 502 }
      );
    }

    const textContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      console.error('No text in Gemini response:', JSON.stringify(geminiData));
      return NextResponse.json(
        { error: 'AI returned an empty response. Please try again.' },
        { status: 502 }
      );
    }

    let analysis;
    try {
      analysis = JSON.parse(textContent);
    } catch {
      const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1].trim());
      } else {
        console.error('Failed to parse Gemini JSON:', textContent);
        return NextResponse.json(
          { error: 'AI returned invalid response format' },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis route error:', error);
    return NextResponse.json(
      { error: 'Internal server error during analysis' },
      { status: 500 }
    );
  }
}
