import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { lockScroll } from "@/lib/scroll";
import { personalDetails } from "@/data/portfolio";
import { AsciiField } from "@/components/ascii/AsciiField";

interface Props {
  /** Fires as the curtain starts to open, so the page can begin its entrance. */
  onReveal: () => void;
  /** Fires once the loader can be unmounted. */
  onDone: () => void;
}

const lines = personalDetails.name.toUpperCase().split(" ");
const FONT_WAIT_MS = 1500;

/** First-visit intro: ASCII glyphs resolve into the name while a counter runs to 100. */
export function Loader({ onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const trace = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const callbacks = useRef({ onReveal, onDone });

  useEffect(() => {
    callbacks.current = { onReveal, onDone };
  });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    lockScroll(true);
    const state = { v: 0 };
    let exiting = false;

    const render = () => {
      progress.current = state.v / 100;
      if (counter.current) counter.current.textContent = String(Math.round(state.v)).padStart(3, "0");
      if (trace.current) trace.current.style.clipPath = `inset(0 ${100 - state.v}% 0 0)`;
    };

    const exit = () => {
      if (exiting) return;
      exiting = true;
      gsap.killTweensOf(state);
      state.v = 100;
      render();
      gsap
        .timeline({
          onComplete: () => {
            sessionStorage.setItem("intro-done", "1");
            lockScroll(false);
            callbacks.current.onDone();
          },
        })
        .to(el.querySelector("[data-content]"), { opacity: 0, duration: 0.25, delay: 0.15 })
        .add(() => callbacks.current.onReveal())
        .to(el.querySelector("[data-top]"), { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "<")
        .to(el.querySelector("[data-bottom]"), { yPercent: 100, duration: 0.8, ease: "expo.inOut" }, "<");
    };

    const tween = gsap.to(state, {
      v: 90,
      duration: 1.2,
      ease: "power2.out",
      onUpdate: render,
      onComplete: async () => {
        await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, FONT_WAIT_MS))]);
        if (exiting) return;
        gsap.to(state, { v: 100, duration: 0.45, ease: "power1.inOut", onUpdate: render, onComplete: exit });
      },
    });

    const skip = () => exit();
    window.addEventListener("keydown", skip);
    el.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      el.removeEventListener("pointerdown", skip);
      tween.kill();
      gsap.killTweensOf(state);
      lockScroll(false);
    };
  }, []);

  return (
    <div ref={root} role="status" aria-label="Loading" className="fixed inset-0 z-[100]">
      <div data-top className="absolute inset-x-0 top-0 h-1/2 bg-bg" />
      <div data-bottom className="absolute inset-x-0 bottom-0 h-1/2 bg-bg" />
      <div data-content className="absolute inset-0">
        <AsciiField maskLines={lines} progress={progress} className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 page-x pb-8">
          <p className="mb-4 text-center font-display text-[clamp(2.5rem,8vw,6rem)] leading-none font-extrabold tracking-tighter text-ink tabular-nums">
            <span ref={counter}>000</span>
          </p>
          <div className="relative h-0.5">
            <div className="trace-h absolute inset-0 [--c:var(--rule)]" />
            <div
              ref={trace}
              className="trace-h absolute inset-0 [--c:var(--accent)]"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
