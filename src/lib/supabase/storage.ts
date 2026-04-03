import { createClient } from '@/lib/supabase/client';

const BUCKET = 'scans';

/**
 * Upload a scan image to Supabase Storage
 * @returns The storage path (not full URL)
 */
export async function uploadScanImage(
  userId: string,
  scanId: string,
  file: Blob,
  index: number
): Promise<string> {
  const supabase = createClient();
  const ext = file.type === 'image/png' ? 'png' : 'jpg';
  const path = `${userId}/${scanId}/${index}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });

  if (error) throw error;
  return path;
}

/**
 * Get a signed URL for a scan image (valid for 1 hour)
 */
export async function getScanImageUrl(path: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600);

  if (error) throw error;
  return data.signedUrl;
}

/**
 * Get signed URLs for multiple images
 */
export async function getScanImageUrls(paths: string[]): Promise<string[]> {
  return Promise.all(paths.map(getScanImageUrl));
}
