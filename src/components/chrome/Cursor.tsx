import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "@/lib/gsap";
import { useFinePointer } from "@/hooks/useFinePointer";
import { cn } from "@/lib/cn";

/** Dot + trailing ring that grows and labels itself over `[data-cursor]` targets. Desktop only. */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50 });
    gsap.set(ring.current, { scale: 0.55 });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.05 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.05 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.35, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.35, ease: "power3" });
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.2 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(target?.dataset.cursor ?? "");
    };
    const onLeave = () => {
      shown = false;
      gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !ring.current) return;
    gsap.to(ring.current, { scale: label ? 1 : 0.55, duration: 0.3, ease: "power3.out" });
  }, [label, enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[110]">
      <div ref={dot} className="invisible absolute top-0 left-0 size-1.5 rounded-full bg-accent" />
      <div
        ref={ring}
        className={cn(
          "invisible absolute top-0 left-0 grid size-20 place-items-center rounded-full border border-accent text-meta transition-[background-color,color] duration-200",
          label ? "bg-accent text-accent-ink" : "bg-transparent",
        )}
      >
        {label}
      </div>
    </div>
  );
}
