import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, motionOk, SplitText, useGSAP } from "@/lib/gsap";

interface Props {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Line-by-line mask reveal the first time the text scrolls into view. */
export function RevealText({ as: Tag = "p", className, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      motionOk(() => {
        const el = ref.current;
        if (!el) return;
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              duration: 0.9,
              stagger: 0.08,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            }),
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
