import { useRef } from "react";
import { cn } from "@/lib/cn";
import { createPattern, type Pattern } from "./patterns";
import { useAsciiCanvas } from "./useAsciiCanvas";

interface Props {
  id: string;
  /** Animates only while active; otherwise holds its last frame. */
  active: boolean;
  className?: string;
}

export function AsciiThumb({ id, active, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pattern = useRef<Pattern | null>(null);

  useAsciiCanvas(canvasRef, {
    cellW: 8,
    cellH: 14,
    maxCells: 1200,
    fps: 30,
    active,
    onGrid: (grid) => {
      pattern.current = createPattern(id, grid);
    },
    onFrame: ({ t, put }) => pattern.current?.(put, t),
  });

  return <canvas ref={canvasRef} aria-hidden className={cn("size-full", className)} />;
}
