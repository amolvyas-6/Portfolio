import { useRef } from "react";
import { gsap, motionOk, useGSAP } from "@/lib/gsap";

/** Thin dashed trace along the left edge that fills with page scroll (desktop). */
export function ScrollProgress() {
  const fill = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    motionOk(() => {
      gsap.to(fill.current, {
        clipPath: "inset(0% 0 0 0)",
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      });
    });
  });

  return (
    <div aria-hidden className="pointer-events-none fixed top-0 bottom-0 left-3 z-30 hidden w-0.5 lg:block">
      <div className="trace-v absolute inset-0 [--c:var(--rule)]" />
      <div
        ref={fill}
        className="trace-v absolute inset-0 [--c:var(--accent)]"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      />
    </div>
  );
}
