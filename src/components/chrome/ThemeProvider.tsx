import { useCallback, useMemo, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ThemeContext, type Theme } from "@/lib/themeContext";

const META_COLOR: Record<Theme, string> = { dark: "#0B0F0C", light: "#E4EAE4" };

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("light") ? "light" : "dark",
  );

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === "dark" ? "light" : "dark";
      const root = document.documentElement;
      const apply = () => {
        root.className = next;
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META_COLOR[next]);
        try {
          localStorage.setItem("theme", next);
        } catch {
          /* storage unavailable */
        }
        flushSync(() => setTheme(next));
      };

      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return apply();
      if (!document.startViewTransition) {
        root.classList.add("theme-fade");
        apply();
        setTimeout(() => root.classList.remove("theme-fade"), 200);
        return;
      }

      const x = origin?.x ?? innerWidth / 2;
      const y = origin?.y ?? innerHeight / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      void document.startViewTransition(apply).ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      });
    },
    [theme],
  );

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
