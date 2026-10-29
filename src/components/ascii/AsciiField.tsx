import { useEffect, useRef, type MutableRefObject } from "react";
import { useFinePointer } from "@/hooks/useFinePointer";
import { mulberry32 } from "@/lib/seeded";
import { cn } from "@/lib/cn";
import { MAX_GLYPH, RAMP } from "./glyphAtlas";
import { fbm, noise3 } from "./noise";
import { useAsciiCanvas, type Grid } from "./useAsciiCanvas";

interface Props {
  className?: string;
  /** Cursor glow and ripples (fine pointers only). */
  interactive?: boolean;
  /** Text lines the field assembles into while `progress` goes 0 to 1. */
  maskLines?: string[];
  progress?: MutableRefObject<number>;
}

interface Ripple {
  x: number;
  y: number;
  born: number;
}

const GLOW_RADIUS = 60;
const RIPPLE_LIFE = 0.6;
const RIPPLE_SPEED = 300;
const RIPPLE_THICKNESS = 20;
const MAX_RIPPLES = 5;

function buildMask(lines: string[], grid: Grid): Uint8Array {
  const { cols, rows, cellW, cellH } = grid;
  const canvas = document.createElement("canvas");
  canvas.width = cols;
  canvas.height = rows;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const mask = new Uint8Array(cols * rows);
  if (!ctx) return mask;
  const k = cellW / cellH;
  const longest = Math.max(...lines.map((l) => l.length));
  const fontPx = Math.min((cols * 0.8) / (longest * 0.72), (rows * 0.7) / (lines.length * k));
  ctx.scale(1, k);
  ctx.fillStyle = "#fff";
  ctx.font = `800 ${fontPx}px "Martian Mono Variable", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((line, i) => {
    const y = rows / 2 / k + (i - (lines.length - 1) / 2) * fontPx;
    ctx.fillText(line, cols / 2, y);
  });
  const data = ctx.getImageData(0, 0, cols, rows).data;
  for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3] > 110 ? 1 : 0;
  return mask;
}

export function AsciiField({ className, interactive = false, maskLines, progress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fine = useFinePointer();
  const rand = useRef(new Float32Array(0));
  const mask = useRef<Uint8Array | null>(null);
  const ripples = useRef<Ripple[]>([]);
  const pointer = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    if (!interactive || !fine) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let last = { x: -9999, y: -9999 };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.current = { x, y };
      if (Math.hypot(x - last.x, y - last.y) > 56) {
        last = { x, y };
        ripples.current.push({ x, y, born: performance.now() / 1000 });
        if (ripples.current.length > MAX_RIPPLES) ripples.current.shift();
      }
    };
    const onLeave = () => {
      pointer.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive, fine]);

  useAsciiCanvas(canvasRef, {
    cellW: 10,
    cellH: 18,
    maxCells: fine ? 6000 : 2500,
    fps: fine ? 60 : 30,
    onGrid: (grid) => {
      const r = mulberry32(7);
      rand.current = Float32Array.from({ length: grid.cols * grid.rows }, r);
      mask.current = null;
      void document.fonts.ready.then(() => (mask.current = null));
    },
    onFrame: ({ t, grid, put }) => {
      const { cols, rows, cellW, cellH } = grid;
      const now = performance.now() / 1000;
      const p = progress?.current ?? 1;
      const assembling = !!maskLines && p < 1;
      if (maskLines && !mask.current) mask.current = buildMask(maskLines, grid);

      ripples.current = ripples.current.filter((rp) => now - rp.born < RIPPLE_LIFE);
      const { x: px, y: py } = pointer.current;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = (c + 0.5) * cellW;
          const y = (r + 0.5) * cellH;

          if (maskLines && mask.current) {
            const threshold = p * 1.15 - 0.05;
            const resolved = rand.current[i] < threshold;
            if (resolved) {
              const edge = threshold - rand.current[i] < 0.04;
              if (mask.current[i]) put(c, r, MAX_GLYPH, edge ? 2 : 1);
              else if (!assembling) continue;
              else put(c, r, 2 + Math.floor(fbm(c * 0.2, r * 0.3, t) * 2), 0);
            } else {
              const n = noise3(c * 0.7, r * 0.7, t * 6);
              put(c, r, 1 + Math.floor(n * (MAX_GLYPH - 3)), 0);
            }
            continue;
          }

          let v = fbm(c * 0.06, r * 0.1, t * 0.18);
          v = Math.max(0, (v - 0.38) * 1.7);
          let kind: 0 | 1 | 2 = 0;

          const dist = Math.hypot(x - px, y - py);
          if (dist < GLOW_RADIUS) {
            v += (1 - dist / GLOW_RADIUS) * 0.7;
            kind = 1;
          }
          for (const rp of ripples.current) {
            const age = (now - rp.born) / RIPPLE_LIFE;
            const d = Math.abs(Math.hypot(x - rp.x, y - rp.y) - age * RIPPLE_SPEED * RIPPLE_LIFE);
            if (d < RIPPLE_THICKNESS) {
              const fall = (1 - d / RIPPLE_THICKNESS) * (1 - age);
              v += fall * 0.9;
              kind = d < RIPPLE_THICKNESS * 0.35 && age < 0.45 ? 2 : 1;
            }
          }
          const glyph = Math.min(MAX_GLYPH, Math.floor(v * RAMP.length));
          put(c, r, glyph, kind);
        }
      }
    },
  });

  return <canvas ref={canvasRef} aria-hidden className={cn("size-full", className)} />;
}
