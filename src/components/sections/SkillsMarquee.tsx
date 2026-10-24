import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { keySkills, type KeySkills } from "@/data/portfolio";
import { gsap, motionOk, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SkillIcon } from "@/lib/icons";
import { Chip } from "@/components/ui/Chip";

function SkillChip({ skill }: { skill: KeySkills }) {
  return (
    <Chip className="gap-2 px-3 py-2 text-base text-ink">
      <SkillIcon name={skill.icon} className="size-4 text-accent-text" />
      {skill.name}
    </Chip>
  );
}

const rows: KeySkills[][] = [
  keySkills.filter((_, i) => i % 2 === 0),
  keySkills.filter((_, i) => i % 2 === 1),
];

/** Two opposing marquees whose speed reacts to scroll velocity and slows on hover. */
export function SkillsMarquee() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      motionOk(() => {
        const tracks = gsap.utils.toArray<HTMLElement>("[data-track]");
        const tweens = tracks.map((track, i) =>
          gsap.fromTo(
            track,
            { xPercent: i % 2 ? -50 : 0 },
            { xPercent: i % 2 ? 0 : -50, duration: 40, ease: "none", repeat: -1 },
          ),
        );
        let hovering = false;
        let boost = 0;
        let reset: gsap.core.Tween | undefined;
        const apply = () => {
          gsap.to(tweens, { timeScale: hovering ? 0.15 : 1 + boost, duration: 0.4, overwrite: true });
        };
        const trigger = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            boost = Math.min(Math.abs(self.getVelocity()) / 250, 6);
            apply();
            reset?.kill();
            reset = gsap.delayedCall(0.15, () => {
              boost = 0;
              apply();
            });
          },
        });
        const el = root.current;
        const enter = () => {
          hovering = true;
          apply();
        };
        const leave = () => {
          hovering = false;
          apply();
        };
        el?.addEventListener("pointerenter", enter);
        el?.addEventListener("pointerleave", leave);
        return () => {
          trigger.kill();
          reset?.kill();
          el?.removeEventListener("pointerenter", enter);
          el?.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  if (reduced) {
    return (
      <ul className="flex flex-wrap gap-3 page-x" aria-label="Skills">
        {keySkills.map((s) => (
          <li key={s.id}>
            <SkillChip skill={s} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div ref={root} className="flex flex-col gap-3 overflow-hidden" role="group" aria-label="Skills">
      {rows.map((row, i) => (
        <div key={i} className="flex w-max" data-track>
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 gap-3 pr-3" aria-hidden={copy === 1 ? true : undefined}>
              {row.map((s) => (
                <li key={s.id}>
                  <SkillChip skill={s} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      ))}
    </div>
  );
}
