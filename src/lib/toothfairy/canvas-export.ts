/**
 * Canvas export contract for DrawingCanvasV2.
 *
 * Guarantees a 1024x1024 image data URL regardless of the source canvas's
 * internal resolution, plus metadata that Phase 3 (enhance) and Phase 5
 * (mint) can rely on without re-inspecting the source. Simple drawings stay
 * PNG; complex photo-backed drawings can fall back to a bounded JPEG.
 */

export interface ExportedDrawing {
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  hasStrokes: boolean;
}

const TARGET_RESOLUTION = 1024;
const MAX_EXPORT_BYTES = 2_000_000;
const SIZE_WARNING_THRESHOLD = MAX_EXPORT_BYTES;
const MIN_JPEG_QUALITY = 0.72;

export function exportDrawing(source: HTMLCanvasElement): ExportedDrawing {
  // Always produce a 1024×1024 normalized output, regardless of source size
  const target = document.createElement('canvas');
  target.width = TARGET_RESOLUTION;
  target.height = TARGET_RESOLUTION;
  const ctx = target.getContext('2d');
  if (!ctx) {
    return {
      dataUrl: '',
      width: 0,
      height: 0,
      sizeBytes: 0,
      hasStrokes: false,
    };
  }

  // Paint cream background so exports always have a non-transparent base
  ctx.fillStyle = 'oklch(97.5% 0.01 80)';
  ctx.fillRect(0, 0, TARGET_RESOLUTION, TARGET_RESOLUTION);

  // Draw source scaled to fit
  ctx.drawImage(source, 0, 0, TARGET_RESOLUTION, TARGET_RESOLUTION);

  const { dataUrl, sizeBytes } = encodeBoundedImage(target);
  const hasStrokes = detectStrokes(source);

  if (sizeBytes > SIZE_WARNING_THRESHOLD) {
    // eslint-disable-next-line no-console
    console.warn(
      `[toothfairy] Exported drawing is ${(sizeBytes / 1024).toFixed(0)}KB over the ${(SIZE_WARNING_THRESHOLD / 1024).toFixed(0)}KB target`
    );
  }

  return {
    dataUrl,
    width: TARGET_RESOLUTION,
    height: TARGET_RESOLUTION,
    sizeBytes,
    hasStrokes,
  };
}

function estimateDataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  const payload = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Math.ceil((payload.length * 3) / 4);
}

function encodeBoundedImage(canvas: HTMLCanvasElement): {
  dataUrl: string;
  sizeBytes: number;
} {
  let dataUrl = canvas.toDataURL('image/png');
  let sizeBytes = estimateDataUrlBytes(dataUrl);
  if (sizeBytes <= MAX_EXPORT_BYTES) {
    return { dataUrl, sizeBytes };
  }

  let quality = 0.9;
  do {
    dataUrl = canvas.toDataURL('image/jpeg', quality);
    sizeBytes = estimateDataUrlBytes(dataUrl);
    quality -= 0.06;
  } while (sizeBytes > MAX_EXPORT_BYTES && quality >= MIN_JPEG_QUALITY);

  return { dataUrl, sizeBytes };
}

/**
 * Quick pixel sample to detect if the canvas has any non-background content.
 * Downsamples to 32x32 for speed.
 */
function detectStrokes(source: HTMLCanvasElement): boolean {
  const sample = document.createElement('canvas');
  sample.width = 32;
  sample.height = 32;
  const sctx = sample.getContext('2d');
  if (!sctx) return false;
  sctx.drawImage(source, 0, 0, 32, 32);
  try {
    const data = sctx.getImageData(0, 0, 32, 32).data;
    // Background is cream, roughly RGB(253, 248, 238)
    // Look for any pixel that deviates substantially from cream
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a < 200) continue;
      const delta =
        Math.abs(r - 253) + Math.abs(g - 248) + Math.abs(b - 238);
      if (delta > 30) return true;
    }
  } catch {
    return false;
  }
  return false;
}
