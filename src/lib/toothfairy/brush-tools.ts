/**
 * Brush tool stroke functions for DrawingCanvasV2.
 *
 * Three tools — pencil, crayon, marker — each with distinct stroke behavior
 * so a 5-7yo feels a real difference when they switch tools.
 */

export type BrushTool = 'pencil' | 'crayon' | 'marker';

export type BrushSizeIndex = 0 | 1 | 2;

export const BRUSH_SIZES: Record<BrushTool, [number, number, number]> = {
  pencil: [4, 8, 16],
  crayon: [12, 20, 32],
  marker: [16, 24, 40],
};

export const BRUSH_DEFAULT_SIZE_INDEX: Record<BrushTool, BrushSizeIndex> = {
  pencil: 1,
  crayon: 1,
  marker: 1,
};

export interface Point {
  x: number;
  y: number;
}

function configurePencil(ctx: CanvasRenderingContext2D, size: number, color: string) {
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
}

function configureCrayon(ctx: CanvasRenderingContext2D, size: number, color: string) {
  ctx.globalAlpha = 0.75;
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
}

function configureMarker(ctx: CanvasRenderingContext2D, size: number, color: string) {
  ctx.globalAlpha = 0.85;
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = color;
}

function drawLineSegment(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point
) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

/**
 * Add subtle crayon-texture ticks around a segment.
 * We draw 2 small perpendicular marks at the midpoint at offsets of ±2-3px,
 * with reduced alpha, to fake the broken edge of a crayon line.
 */
function drawCrayonTexture(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  size: number,
  color: string
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 0.5) return;

  // Perpendicular unit vector
  const px = -dy / len;
  const py = dx / len;

  const mid: Point = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };

  const prevAlpha = ctx.globalAlpha;
  const prevWidth = ctx.lineWidth;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = Math.max(1, size * 0.15);
  ctx.strokeStyle = color;

  // Two ticks, offset 2-3px on either side of the segment
  const offset1 = size * 0.4;
  const offset2 = size * 0.4;
  drawLineSegment(
    ctx,
    { x: mid.x + px * offset1, y: mid.y + py * offset1 },
    { x: mid.x + px * (offset1 + 1.5), y: mid.y + py * (offset1 + 1.5) }
  );
  drawLineSegment(
    ctx,
    { x: mid.x - px * offset2, y: mid.y - py * offset2 },
    { x: mid.x - px * (offset2 + 1.5), y: mid.y - py * (offset2 + 1.5) }
  );

  ctx.globalAlpha = prevAlpha;
  ctx.lineWidth = prevWidth;
}

export function pencilStroke(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  size: number,
  color: string
) {
  configurePencil(ctx, size, color);
  drawLineSegment(ctx, from, to);
}

export function crayonStroke(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  size: number,
  color: string
) {
  configureCrayon(ctx, size, color);
  drawLineSegment(ctx, from, to);
  drawCrayonTexture(ctx, from, to, size, color);
}

export function markerStroke(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  size: number,
  color: string
) {
  configureMarker(ctx, size, color);
  drawLineSegment(ctx, from, to);
}

export function strokeForTool(
  tool: BrushTool,
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  size: number,
  color: string
) {
  if (tool === 'pencil') return pencilStroke(ctx, from, to, size, color);
  if (tool === 'crayon') return crayonStroke(ctx, from, to, size, color);
  return markerStroke(ctx, from, to, size, color);
}

export function eraserStroke(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  size: number
) {
  const prevAlpha = ctx.globalAlpha;
  const prevOp = ctx.globalCompositeOperation;
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(0,0,0,1)';
  drawLineSegment(ctx, from, to);
  ctx.globalAlpha = prevAlpha;
  ctx.globalCompositeOperation = prevOp;
}
