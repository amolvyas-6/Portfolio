import { useLayoutEffect, useRef, type ElementType } from "react";
import { useReducedMotion } from "motion/react";
import { scrambled, scrambleTo } from "@/lib/scramble";
import { cn } from "@/lib/cn";

interface Props {
  text: string;
  className?: string;
  as?: ElementType;
  /** Scramble when the pointer enters or focus lands on the nearest interactive parent. */
  hover?: boolean;
  /** Start scrambled and resolve the first time it scrolls into view. */
  reveal?: boolean;
}

/** Text that resolves from random glyphs. The real string stays available to screen readers. */
export function ScrambleText({ text, className, as: Tag = "span", hover = false, reveal = false }: Props) {
  const visible = useRef<HTMLSpanElement>(null);
  const cancel = useRef<(() => void) | null>(null);
  const first = useRef(true);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = visible.current;
    if (!el) return;
    el.textContent = text;
    if (reduced) return;
    const isFirst = first.current;
    first.current = false;

    let io: IntersectionObserver | undefined;
    if (reveal && isFirst) {
      el.textContent = scrambled(text);
      io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        io?.disconnect();
        cancel.current = scrambleTo(el, text, 1);
      });
      io.observe(el);
    } else if (!isFirst) {
      cancel.current = scrambleTo(el, text);
    }

    const host = hover ? (el.closest("a, button") ?? el.parentElement) : null;
    const run = () => {
      cancel.current?.();
      cancel.current = scrambleTo(el, text, 0.5);
    };
    host?.addEventListener("pointerenter", run);
    host?.addEventListener("focus", run);
    return () => {
      io?.disconnect();
      cancel.current?.();
      host?.removeEventListener("pointerenter", run);
      host?.removeEventListener("focus", run);
    };
  }, [text, reduced, hover, reveal]);

  return (
    <Tag className={cn(className)}>
      <span className="sr-only">{text}</span>
      <span ref={visible} aria-hidden />
    </Tag>
  );
}
