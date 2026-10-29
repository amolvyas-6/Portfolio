import type Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) {
    instance.start();
    instance.scrollTo(el, { duration: 1.3 });
  } else {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
}

export function lockScroll(lock: boolean) {
  document.documentElement.classList.toggle("scroll-locked", lock);
  if (lock) {
    instance?.stop();
  } else {
    instance?.start();
    ScrollTrigger.refresh();
  }
}

/** True when the intro loader should play (first visit this session, motion allowed). */
export const willPlayIntro =
  typeof window !== "undefined" &&
  !sessionStorage.getItem("intro-done") &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches;
