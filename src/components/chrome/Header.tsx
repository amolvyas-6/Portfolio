import { useCallback, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { personalDetails } from "@/data/portfolio";
import { useClock } from "@/hooks/useClock";
import { scrollToId } from "@/lib/scroll";
import { MenuOverlay } from "./MenuOverlay";
import { ThemeToggle } from "./ThemeToggle";

const city = personalDetails.location.split(",")[0];

export function Header() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const time = useClock("Asia/Kolkata");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 120);
  });

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.65, 0, 0.35, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-bg/80 backdrop-blur-md"
      >
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 page-x">
          <a
            href="#top"
            data-cursor="top"
            onClick={(e) => {
              e.preventDefault();
              close();
              scrollToId("top");
            }}
            className="font-display text-lg font-extrabold tracking-tighter"
          >
            {personalDetails.displayName ?? personalDetails.name}
          </a>

          <p className="hidden text-meta text-muted md:block" aria-label={`Local time in ${city}`}>
            {city} <span className="tabular-nums">{time}</span> IST
          </p>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls="menu"
              data-cursor={open ? "close" : "menu"}
              onClick={() => setOpen((v) => !v)}
              className="h-11 min-w-24 rounded-full border border-rule px-5 text-ink transition-colors hover:border-accent hover:text-accent-text"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </motion.header>
      <MenuOverlay open={open} onClose={close} buttonRef={buttonRef} />
    </>
  );
}
