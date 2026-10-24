import { hashString, mulberry32 } from "@/lib/seeded";
import { fbm } from "./noise";
import type { Grid, Put } from "./useAsciiCanvas";

export type Pattern = (put: Put, t: number) => void;

const GLYPH = { dot: 2, colon: 3, dash: 4, plus: 6, hash: 8, pct: 9, at: 10 } as const;

/** Dotted road with a crater that breathes. */
function road({ cols, rows }: Grid): Pattern {
  const cx = Math.floor(cols / 2);
  const spread = (cols * 0.4) / rows;
  return (put, t) => {
    for (let r = 0; r < rows; r++) {
      const half = 3 + r * spread;
      put(Math.round(cx - half), r, GLYPH.colon, 0);
      put(Math.round(cx + half), r, GLYPH.colon, 0);
      if ((((r - t * 4) % 4) + 4) % 4 < 2) put(cx, r, GLYPH.plus, 1);
    }
    const ccx = cx + 3;
    const ccy = rows * 0.62;
    const rx = 7 + Math.sin(t * 1.5) * 0.8;
    const ry = rx * 0.45;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const d = Math.hypot((c - ccx) / rx, (r - ccy) / ry);
        if (Math.abs(d - 1) < 0.16) put(c, r, GLYPH.pct, 0);
        else if (d < 0.84) put(c, r, GLYPH.dot, 0);
      }
    }
  };
}

/** Small node graph with pulses travelling along the edges. */
function agentGraph({ cols, rows }: Grid, seed: number): Pattern {
  const rand = mulberry32(seed);
  const nodes = Array.from({ length: 6 }, (_, i) => ({
    x: 4 + ((i % 3) + rand() * 0.5) * ((cols - 10) / 2.6),
    y: 2 + (Math.floor(i / 3) + rand() * 0.4) * ((rows - 5) / 1.4),
  }));
  const edges: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [1, 3]];
  return (put, t) => {
    edges.forEach(([a, b], i) => {
      const A = nodes[a];
      const B = nodes[b];
      const steps = Math.ceil(Math.max(Math.abs(B.x - A.x), Math.abs(B.y - A.y) * 1.8)) * 2;
      const pulse = (t * 0.45 + i * 0.37) % 1;
      for (let s = 0; s <= steps; s++) {
        const f = s / steps;
        const c = Math.round(A.x + (B.x - A.x) * f);
        const r = Math.round(A.y + (B.y - A.y) * f);
        const near = Math.abs(f - pulse) < 1.5 / steps + 0.02;
        put(c, r, near ? GLYPH.at : GLYPH.colon, near ? 1 : 0);
      }
    });
    nodes.forEach((n) => {
      const c = Math.round(n.x);
      const r = Math.round(n.y);
      for (let dc = -2; dc <= 2; dc++) put(c + dc, r, GLYPH.hash, 0);
      put(c, r, GLYPH.at, 1);
    });
  };
}

/** Lines of text being scanned, with sections redacted behind the scan. */
function document_({ cols, rows }: Grid, seed: number): Pattern {
  const rand = mulberry32(seed);
  const lines = Array.from({ length: rows }, () => ({
    len: Math.floor(cols * (0.4 + rand() * 0.55)),
    redactStart: Math.floor(cols * rand() * 0.5),
    redactLen: 4 + Math.floor(rand() * 10),
    redact: rand() > 0.45,
  }));
  return (put, t) => {
    const scan = Math.floor((t * 3) % (rows + 2));
    for (let r = 0; r < rows; r += 2) {
      const line = lines[r];
      for (let c = 0; c < line.len; c++) {
        const redacted = r < scan && line.redact && c >= line.redactStart && c < line.redactStart + line.redactLen;
        put(c, r, redacted ? GLYPH.at : GLYPH.dash, 0);
      }
    }
    for (let c = 0; c < cols; c++) put(c, Math.min(scan, rows - 1), GLYPH.plus, 1);
  };
}

function noiseField({ cols, rows }: Grid, seed: number): Pattern {
  const off = (seed % 1000) / 10;
  return (put, t) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = Math.max(0, (fbm(c * 0.12 + off, r * 0.2 + off, t * 0.5) - 0.3) * 2.2);
        put(c, r, Math.min(GLYPH.at, Math.floor(v * 11)), v > 0.8 ? 1 : 0);
      }
    }
  };
}

/** Each project gets its own deterministic, animated pattern. */
export function createPattern(id: string, grid: Grid): Pattern {
  const seed = hashString(id);
  switch (id) {
    case "work3":
      return road(grid);
    case "work4":
      return agentGraph(grid, seed);
    case "per5":
      return document_(grid, seed);
    default:
      return noiseField(grid, seed);
  }
}
