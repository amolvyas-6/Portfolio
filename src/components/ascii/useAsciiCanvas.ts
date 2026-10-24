import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "@/lib/gsap";
import { useTheme } from "@/lib/themeContext";
import { buildAtlas, readColors, type Kind } from "./glyphAtlas";

export interface Grid {
  cols: number;
  rows: number;
  /** Cell size in CSS px (after density scaling). */
  cellW: number;
  cellH: number;
}
export type Put = (col: number, row: number, glyph: number, kind: Kind) => void;
export interface Frame {
  t: number;
  dt: number;
  grid: Grid;
  put: Put;
}
interface Options {
  cellW: number;
  cellH: number;
  maxCells: number;
  fps: number;
  /** When false the canvas keeps its last frame. Defaults to true. */
  active?: boolean;
  onGrid?: (grid: Grid) => void;
  onFrame: (frame: Frame) => void;
}

/**
 * Shared canvas engine for ASCII art: grid sizing, glyph atlas, ticker loop,
 * and pausing when off-screen, hidden, or reduced-motion.
 */
export function useAsciiCanvas(ref: RefObject<HTMLCanvasElement | null>, options: Options) {
  const optsRef = useRef(options);
  const timeRef = useRef(0);
  const reduced = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    optsRef.current = options;
  });

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let grid: Grid | null = null;
    let atlas: HTMLCanvasElement | null = null;
    let cw = 1;
    let ch = 1;
    let visible = true;
    let disposed = false;
    let acc = 0;

    const draw = (dt: number) => {
      if (!grid || !atlas) return;
      const g = grid;
      const a = atlas;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const put: Put = (c, r, glyph, kind) => {
        if (glyph <= 0 || c < 0 || r < 0 || c >= g.cols || r >= g.rows) return;
        ctx.drawImage(a, glyph * cw, kind * ch, cw, ch, c * cw, r * ch, cw, ch);
      };
      optsRef.current.onFrame({ t: timeRef.current, dt, grid: g, put });
    };

    const setup = async () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      const { cellW, cellH, maxCells } = optsRef.current;
      const scale = Math.max(1, Math.sqrt((w * h) / (cellW * cellH) / maxCells));
      const cssW = cellW * scale;
      const cssH = cellH * scale;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = Math.max(1, Math.round(cssW * dpr));
      ch = Math.max(1, Math.round(cssH * dpr));
      const next: Grid = {
        cols: Math.ceil(w / cssW),
        rows: Math.ceil(h / cssH),
        cellW: cssW,
        cellH: cssH,
      };
      canvas.width = next.cols * cw;
      canvas.height = next.rows * ch;
      await document.fonts.load('400 16px "JetBrains Mono Variable"');
      if (disposed) return;
      atlas = buildAtlas(cw, ch, cw / 0.6, readColors(canvas));
      grid = next;
      optsRef.current.onGrid?.(next);
      draw(0);
    };

    const tick = (_time: number, deltaMs: number) => {
      if (!visible || document.hidden || optsRef.current.active === false) return;
      acc += deltaMs;
      if (acc < 1000 / optsRef.current.fps) return;
      const dt = acc / 1000;
      acc = 0;
      timeRef.current += dt;
      draw(dt);
    };

    const ro = new ResizeObserver(() => void setup());
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    if (!reduced) gsap.ticker.add(tick);

    return () => {
      disposed = true;
      ro.disconnect();
      io.disconnect();
      gsap.ticker.remove(tick);
    };
  }, [ref, reduced, theme]);
}
