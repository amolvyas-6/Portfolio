import { useRef } from "react";
import { gsap, motionOk, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";

interface Props {
  id: string;
  children: string;
  className?: string;
}

/** Section heading whose characters rise through a mask on first view. */
export function SectionTitle({ id, children, className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      return motionOk(() => {
        const el = ref.current;
        if (!el) return;
        const split = SplitText.create(el, {
          type: "chars",
          mask: "chars",
          onSplit: (self) =>
            gsap.fromTo(
              self.chars,
              { yPercent: 110 },
              {
                yPercent: 0,
                duration: 0.9,
                stagger: 0.04,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              },
            ),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <h2
      ref={ref}
      id={id}
      className={cn("font-display text-section font-extrabold tracking-tighter", className)}
    >
      {children}
    </h2>
  );
}
