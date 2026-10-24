import { useRef, type ReactNode } from "react";
import { gsap, motionOk, useGSAP } from "@/lib/gsap";

const FROM = "inset(6vw 5vw 0vw 5vw round 28px 28px 0px 0px)";
const TO = "inset(0vw 0vw 0vw 0vw round 0px 0px 0px 0px)";

/**
 * Wraps the closing sections in a panel that grows to full-bleed on scroll.
 * Inside, `data-scene="flip"` swaps the palette to the opposite theme.
 */
export function FlipScene({ children }: { children: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      motionOk(() => {
        gsap.fromTo(
          panel.current,
          { clipPath: FROM },
          {
            clipPath: TO,
            ease: "none",
            scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "top 15%", scrub: true },
          },
        );
      });
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className="bg-bg">
      <div ref={panel} data-scene="flip" className="bg-bg text-ink">
        {children}
      </div>
    </div>
  );
}
