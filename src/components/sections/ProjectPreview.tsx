import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "motion/react";
import { useFinePointer } from "@/hooks/useFinePointer";
import { gsap } from "@/lib/gsap";
import { AsciiThumb } from "@/components/ascii/AsciiThumb";

/** ASCII thumbnail that trails the cursor while a project row is hovered (desktop only). */
export function ProjectPreview({ id }: { id: string | null }) {
  const box = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const [shown, setShown] = useState<string | null>(id);
  if (id && id !== shown) setShown(id);

  useEffect(() => {
    const el = box.current;
    if (!enabled || !el) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.5, ease: "power3" });
    const onMove = (e: PointerEvent) => {
      xTo(e.clientX + 28);
      yTo(e.clientY - 90);
      rTo(gsap.utils.clamp(-8, 8, e.movementX * 0.4));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !box.current) return;
    gsap.to(box.current, {
      autoAlpha: id ? 1 : 0,
      scale: id ? 1 : 0.85,
      duration: 0.3,
      ease: "power3.out",
    });
  }, [id, enabled]);

  if (!enabled) return null;
  return createPortal(
    <div
      ref={box}
      aria-hidden
      className="pointer-events-none invisible fixed top-0 left-0 z-[90] h-44 w-72 overflow-hidden border border-rule bg-surface"
    >
      {shown && <AsciiThumb key={shown} id={shown} active={!!id} />}
    </div>,
    document.body,
  );
}
