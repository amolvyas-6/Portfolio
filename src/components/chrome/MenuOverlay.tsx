import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "@/lib/gsap";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { NAV } from "@/lib/nav";
import { personalDetails, projects, socialLinks, timeline, keySkills } from "@/data/portfolio";
import { ScrambleText } from "@/components/text/ScrambleText";
import { LinkText } from "@/components/ui/LinkText";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  open: boolean;
  onClose: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}

const HINTS: Record<(typeof NAV)[number]["id"], string> = {
  about: `${keySkills.length} skills`,
  experience: `${timeline.filter((t) => t.type === "experience").length} roles`,
  work: `${projects.length} projects`,
  contact: personalDetails.email ?? "",
};

const circle = (x: number, y: number, r: number) => `circle(${r}px at ${x}px ${y}px)`;

export function MenuOverlay({ open, onClose, buttonRef }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = root.current;
    const button = buttonRef.current;
    if (!el || !button) return;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const full = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const items = el.querySelectorAll("[data-menu-item]");
    gsap.killTweensOf([el, items]);

    if (open) {
      lockScroll(true);
      if (reduced) {
        gsap.set(el, { autoAlpha: 1, clipPath: "none" });
      } else {
        gsap
          .timeline()
          .set(el, { autoAlpha: 1 })
          .fromTo(el, { clipPath: circle(x, y, 0) }, { clipPath: circle(x, y, full), duration: 0.7, ease: "expo.inOut" })
          .fromTo(
            items,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: "expo.out" },
            "-=0.4",
          );
      }
      el.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else if (wasOpen.current) {
      const done = () => {
        gsap.set(el, { autoAlpha: 0, clearProps: "clipPath" });
        lockScroll(false);
      };
      if (reduced) done();
      else gsap.to(el, { clipPath: circle(x, y, 0), duration: 0.5, ease: "expo.inOut", onComplete: done });
      button.focus({ preventScroll: true });
    }
    wasOpen.current = open;
  }, [open, reduced, buttonRef]);

  useEffect(() => () => lockScroll(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !root.current) return;
      const focusables = [
        ...root.current.querySelectorAll<HTMLElement>("a[href], button"),
        ...(buttonRef.current ? [buttonRef.current] : []),
      ];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, buttonRef]);

  return (
    <div
      ref={root}
      id="menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
      className="invisible fixed inset-0 z-[45] overflow-y-auto bg-bg page-x pt-28 pb-10"
    >
      <div className="mx-auto grid min-h-full max-w-[1600px] content-between gap-12 lg:grid-cols-12">
        <nav aria-label="Sections" className="lg:col-span-8">
          <ul>
            {NAV.map(({ id, label }) => (
              <li key={id} className="overflow-hidden border-b border-rule">
                <a
                  href={`#${id}`}
                  data-menu-item
                  data-cursor="go"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    scrollToId(id);
                  }}
                  className="flex items-baseline justify-between gap-4 py-3 hover:text-accent-text focus-visible:text-accent-text"
                >
                  <ScrambleText hover text={label} className="font-display text-[clamp(2.5rem,9vw,7rem)] leading-none font-extrabold tracking-tighter" />
                  <span className="hidden text-meta text-muted sm:block">{HINTS[id]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col justify-end gap-6 lg:col-span-4">
          <div data-menu-item className="flex items-center justify-between border-b border-rule pb-4">
            <span className="text-muted">Theme</span>
            <ThemeToggle />
          </div>
          <div data-menu-item className="sm:hidden">
            <ResumeButton className="w-full" />
          </div>
          <ul data-menu-item className="flex flex-col gap-2">
            {personalDetails.email && (
              <li>
                <LinkText href={`mailto:${personalDetails.email}`}>{personalDetails.email}</LinkText>
              </li>
            )}
            {socialLinks.map((s) => (
              <li key={s.id}>
                <LinkText external href={s.url}>
                  {s.platform}
                </LinkText>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
