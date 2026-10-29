import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { personalDetails } from "@/data/portfolio";
import { useFinePointer } from "@/hooks/useFinePointer";
import { gsap, motionOk, useGSAP } from "@/lib/gsap";
import { scrollToId } from "@/lib/scroll";
import { AsciiField } from "@/components/ascii/AsciiField";
import { ScrambleText } from "@/components/text/ScrambleText";

const nameLines = personalDetails.name.toUpperCase().split(" ");
const intro = `${personalDetails.bio.split(". ")[0].replace(/\.$/, "")}.`;
const phrases = [
  personalDetails.role ?? "Software Development Engineer",
  "building AI agents",
  "shipping FastAPI backends",
  "making things people use",
];

function RoleCycle() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % phrases.length);
    }, 3500);
    return () => clearInterval(id);
  }, [reduced]);

  return <ScrambleText text={phrases[index]} className="text-accent-text" />;
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const fine = useFinePointer();

  // Entrance: runs once the loader curtain opens (or immediately when there is no loader).
  useGSAP(
    () => {
      return motionOk(() => {
        const letters = gsap.utils.toArray<HTMLElement>("[data-letter]");
        const fades = gsap.utils.toArray<HTMLElement>("[data-fade]");
        if (!ready) {
          gsap.set(letters, { yPercent: 110 });
          gsap.set(fades, { opacity: 0 });
          return;
        }
        gsap.fromTo(
          letters,
          { yPercent: 110 },
          { yPercent: 0, duration: 1.1, stagger: 0.07, ease: "expo.out", delay: 0.1, overwrite: "auto" },
        );
        gsap.fromTo(
          fades,
          { opacity: 0 },
          { opacity: 1, duration: 0.9, delay: 0.7, stagger: 0.1, overwrite: "auto" },
        );
      });
    },
    { scope: root, dependencies: [ready] },
  );

  // Letters swell in weight near the cursor (fine pointers) or breathe on their own (touch).
  useGSAP(
    () => {
      motionOk(() => {
        const letters = gsap.utils.toArray<HTMLElement>("[data-letter]");
        if (!fine) {
          gsap.fromTo(
            letters,
            { fontWeight: 350 },
            { fontWeight: 800, duration: 2.4, repeat: -1, yoyo: true, stagger: 0.25, ease: "sine.inOut" },
          );
          return;
        }
        const setWeight = letters.map((l) => gsap.quickTo(l, "fontWeight", { duration: 0.5, ease: "power3" }));
        const onMove = (e: PointerEvent) => {
          letters.forEach((l, i) => {
            const r = l.getBoundingClientRect();
            const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
            setWeight[i](350 + 450 * Math.max(0, 1 - d / 400));
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root, dependencies: [fine] },
  );

  // Scroll exit: name lines drift apart and the field dims.
  useGSAP(
    () => {
      motionOk(() => {
        const trigger = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-line='0']", { xPercent: -14, ease: "none", scrollTrigger: trigger });
        gsap.to("[data-line='1']", { xPercent: 14, ease: "none", scrollTrigger: trigger });
        gsap.to("[data-field]", { opacity: 0.15, ease: "none", scrollTrigger: trigger });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className="relative min-h-svh overflow-hidden">
      <div data-field className="absolute inset-0">
        <AsciiField interactive />
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh max-w-[1600px] flex-col page-x pt-28 pb-8">
        <p className="sr-only">{personalDetails.headline}</p>
        <div data-fade className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 text-muted">
          <p aria-live="off">
            <RoleCycle />
          </p>
          <p>{personalDetails.location}</p>
        </div>

        <h1
          aria-label={personalDetails.name}
          className="mt-auto font-display text-hero tracking-normal text-ink"
        >
          {nameLines.map((word, li) => (
            <span
              key={word}
              aria-hidden
              className="block overflow-y-clip leading-[0.9]"
              style={{ paddingLeft: li === 1 ? "clamp(1rem, 8vw, 9rem)" : undefined }}
            >
              <span data-line={li} className="block">
                {Array.from(word).map((ch, i) => (
                  <span key={i} data-letter className="inline-block font-[350]">
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex items-end justify-between gap-8">
          <p data-fade className="prose-w max-w-[44ch] text-ink">
            {intro}
          </p>
          <button
            type="button"
            data-fade
            data-cursor="scroll"
            onClick={() => scrollToId("about")}
            className="flex items-center gap-3 text-muted transition-colors hover:text-accent-text"
          >
            Scroll
            <span aria-hidden className="relative block h-12 w-px overflow-hidden">
              <span className="trace-v absolute inset-0 [--c:var(--rule)]" />
              <span className="absolute inset-x-0 top-0 h-4 animate-[scroll-hint_1.8s_ease-in-out_infinite] bg-accent" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
