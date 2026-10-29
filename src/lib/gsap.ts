import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const NO_REDUCED = "(prefers-reduced-motion: no-preference)";

/** Runs `fn` only when the user has not asked for reduced motion. Call inside useGSAP. */
export function motionOk(fn: () => void | (() => void)) {
  const mm = gsap.matchMedia();
  mm.add(NO_REDUCED, fn);
  return () => mm.revert();
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
