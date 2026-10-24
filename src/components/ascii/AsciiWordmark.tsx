import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { personalDetails } from "@/data/portfolio";
import { scrambleTo } from "@/lib/scramble";


const FONT: Record<string, string[]> = {
  A: [" ███ ", "█   █", "█████", "█   █", "█   █"],
  M: ["█   █", "██ ██", "█ █ █", "█   █", "█   █"],
  O: [" ███ ", "█   █", "█   █", "█   █", " ███ "],
  L: ["█    ", "█    ", "█    ", "█    ", "█████"],
  V: ["█   █", "█   █", "█   █", " █ █ ", "  █  "],
  Y: ["█   █", " █ █ ", "  █  ", "  █  ", "  █  "],
  S: [" ████", "█    ", " ███ ", "    █", "████ "],
};
const FALLBACK = ["█████", "█   █", "█   █", "█   █", "█████"];

function render(text: string): string {
  const rows = ["", "", "", "", ""];
  for (const ch of text.toUpperCase()) {
    const glyph = ch === " " ? Array(5).fill("   ") : (FONT[ch] ?? FALLBACK);
    glyph.forEach((line, i) => (rows[i] += line + " "));
  }
  return rows.map((r) => r.trimEnd()).join("\n")
}

const ART = render(personalDetails.name);

/** Decorative ASCII wordmark that glitches on hover or tap. */
export function AsciiWordmark() {
  const ref = useRef<HTMLPreElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (ref.current) ref.current.textContent = ART;
  }, []);

  const glitch = () => {
    const el = ref.current;
    if (!el || reduced) return;
    el.classList.remove("glitch");
    void el.offsetWidth;
    el.classList.add("glitch");
    scrambleTo(el, ART, 0.5);
  };

  return (
    <pre
      ref={ref}
      aria-hidden
      onPointerEnter={glitch}
      onPointerDown={glitch}
      className="overflow-hidden text-[clamp(0.45rem,2.7vw,2.2rem)] leading-none text-muted transition-colors select-none hover:text-accent-text"
    />
  );
}
