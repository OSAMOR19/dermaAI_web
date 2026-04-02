import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const DERMA_PROMPT = `You are an AI dermatology analysis assistant.

Your job is to analyze a user uploaded skin image and return a structured analysis of possible visible skin conditions.

IMPORTANT RULES:
- Only analyze what is visually observable in the image.
- Do NOT guess if the image is unclear.
- If the image quality is poor, return "image_quality: poor".
- Do NOT provide a medical diagnosis.
- Only provide possible conditions based on visual patterns.
- Always return STRICT JSON with no additional text.

Analyze the image for signs of the following skin conditions:

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

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = file.type || 'image/jpeg';

    // Call Gemini Vision API
    const geminiResponse = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: DERMA_PROMPT },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errText);

      if (geminiResponse.status === 429) {
        // Extract retry delay if available
        let retryMsg = 'AI rate limit reached. Please wait 30 seconds and try again.';
        try {
          const errJson = JSON.parse(errText);
          const retryInfo = errJson?.error?.details?.find(
            (d: { '@type': string }) => d['@type']?.includes('RetryInfo')
          );
          if (retryInfo?.retryDelay) {
            retryMsg = `AI rate limit reached. Please retry in ${retryInfo.retryDelay}.`;
          }
        } catch { /* use default message */ }
        return NextResponse.json({ error: retryMsg }, { status: 429 });
      }

      return NextResponse.json(
        { error: `AI service error (${geminiResponse.status})` },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();

    // Extract the text content from Gemini's response
    const textContent =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textContent) {
      console.error('No text in Gemini response:', JSON.stringify(geminiData));
      return NextResponse.json(
        { error: 'AI returned an empty response' },
        { status: 502 }
      );
    }

    // Parse the JSON from Gemini's text response
    let analysis;
    try {
      analysis = JSON.parse(textContent);
    } catch {
      // Try to extract JSON from markdown code block if present
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
