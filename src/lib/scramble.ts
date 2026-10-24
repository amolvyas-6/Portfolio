const CHARS = "01#%*+=:<>/|[]{}";
const isSpace = (ch: string) => ch === " " || ch === "\n" || ch === "\t";
const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export const scrambled = (text: string) =>
  Array.from(text, (ch) => (isSpace(ch) ? ch : randomChar())).join("");

/** Resolves `el` to `final` from random glyphs, left to right. Returns a cancel function. */
export function scrambleTo(el: HTMLElement, final: string, duration = 0.7): () => void {
  const chars = Array.from(final);
  const delays = chars.map((_, i) => (i / chars.length) * 0.6 + Math.random() * 0.25);
  const end = Math.max(...delays, 0) + 0.15;
  const start = performance.now();
  let raf = 0;

  const render = (now: number) => {
    const p = (now - start) / 1000 / duration;
    if (p >= end) {
      el.textContent = final;
      return;
    }
    el.textContent = chars
      .map((ch, i) => (isSpace(ch) || p >= delays[i] + 0.15 ? ch : randomChar()))
      .join("");
    raf = requestAnimationFrame(render);
  };
  render(start);

  return () => {
    cancelAnimationFrame(raf);
    el.textContent = final;
  };
}
