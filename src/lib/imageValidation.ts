export interface ValidationResult {
  passed: boolean;
  message?: string;
  lightingValue?: number;
  sharpnessValue?: number;
}

export async function validateImageData(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): Promise<{ lightingOk: boolean; sharpnessOk: boolean; lightingAvg: number; sharpnessAvg: number }> {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  let totalLuminance = 0;
  
  // To calculate sharpness, we can do a simplified edge detection horizontal pass
  let totalEdgeAbs = 0;
  let edgeCount = 0;
  
  const step = 4; // Check every pixel (r,g,b,a) -> step=4. We'll sample to be fast.
  const sampleStep = 4 * 4; // check every 4 pixels for performance

  for (let i = 0; i < data.length; i += sampleStep) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Perceived luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuminance += lum;
    
    // Quick horizontal edge detection if not at the rightmost edge
    if (i + sampleStep < data.length && (i/4) % width < width - 4) {
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

export function drawImageToCanvas(imgSource: HTMLImageElement | HTMLVideoElement): { ctx: CanvasRenderingContext2D, width: number, height: number } | null {
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

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(imgSource, 0, 0, width, height);

  return { ctx, width, height };
}

export async function validateStaticImage(dataUrl: string): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const res = drawImageToCanvas(img);
      if (!res) {
        resolve({ passed: false, message: 'Invalid image data format' });
        return;
      }
      const val = await validateImageData(res.ctx, res.width, res.height);
      
      if (!val.lightingOk) {
        resolve({ passed: false, message: 'Image too dark or overly exposed — please retake in better lighting' });
      } else if (!val.sharpnessOk) {
        resolve({ passed: false, message: 'Image is too blurry. Please retake a sharper photo.' });
      } else {
        resolve({ passed: true });
      }
    };
    img.onerror = () => resolve({ passed: false, message: 'Corrupted image file' });
    img.src = dataUrl;
  });
}
