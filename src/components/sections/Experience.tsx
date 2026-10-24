import { useRef } from "react";
import { timeline, type TimelineItem } from "@/data/portfolio";
import { formatDuration, formatRange, startTime } from "@/lib/dates";
import { gsap, motionOk, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { shortHash } from "@/lib/seeded";
import { RevealText } from "@/components/text/RevealText";
import { SectionTitle } from "@/components/text/SectionTitle";
import { Chip } from "@/components/ui/Chip";
import { LinkText } from "@/components/ui/LinkText";

const byNewest = (a: TimelineItem, b: TimelineItem) => startTime(b.startDate) - startTime(a.startDate);
const experience = timeline.filter((t) => t.type === "experience").sort(byNewest);
const education = timeline.filter((t) => t.type === "education").sort(byNewest);

function Entry({ item }: { item: TimelineItem }) {
  const ongoing = item.endDate == null;
  return (
    <li className="relative grid gap-4 py-10 md:grid-cols-12 md:gap-8">
      <span
        aria-hidden
        data-node
        className="absolute top-12 -left-8 size-3.5 rounded-full border-2 border-accent bg-bg transition-colors duration-300 md:-left-12 [&.is-passed]:bg-accent"
      />

      <div className="md:col-span-3">
        <p className="text-ink">{formatRange(item.startDate, item.endDate)}</p>
        <p className="flex items-center gap-2 text-muted">
          {ongoing && (
            <span aria-hidden className="size-2 animate-[blink_1.4s_steps(1)_infinite] rounded-full bg-alert" />
          )}
          {formatDuration(item.startDate, item.endDate)}
        </p>
        <p aria-hidden className="mt-2 text-meta text-muted/70">
          {shortHash(item.id)}
        </p>
      </div>

      <div className="md:col-span-6">
        <h3 className="font-display text-project font-bold tracking-tighter">
          {item.url ? (
            <LinkText external href={item.url} className="inline text-ink">
              {item.organization}
            </LinkText>
          ) : (
            item.organization
          )}
        </h3>
        <p className="mt-1 text-accent-text">
          {item.title}
          {item.location ? <span className="text-muted">{`, ${item.location}`}</span> : null}
        </p>
        <ul className="prose-w mt-5 flex flex-col gap-3">
          {item.description?.map((line) => (
            <RevealText as="li" key={line} className="text-ink">
              {line}
            </RevealText>
          ))}
        </ul>
      </div>

      {item.tags && (
        <ul className="flex flex-wrap content-start gap-2 md:col-span-3" aria-label="Technologies">
          {item.tags.map((tag) => (
            <li key={tag}>
              <Chip>{tag}</Chip>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function Experience() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      motionOk(() => {
        gsap.to("[data-progress]", {
          clipPath: "inset(0 0 0% 0)",
          ease: "none",
          scrollTrigger: { trigger: "[data-trace]", start: "top 65%", end: "bottom 65%", scrub: 0.4 },
        });
        gsap.utils.toArray<HTMLElement>("[data-node]").forEach((node) => {
          ScrollTrigger.create({
            trigger: node,
            start: "top 65%",
            toggleClass: { targets: node, className: "is-passed" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="experience" aria-labelledby="experience-title" className="section-y">
      <div ref={root} className="mx-auto max-w-[1600px] page-x">
        <SectionTitle id="experience-title">Experience</SectionTitle>

        <div data-trace className="relative mt-12 pl-8 md:pl-12">
          <div aria-hidden className="absolute top-0 bottom-0 left-[6px] w-0.5">
            <div className="trace-v absolute inset-0 [--c:var(--rule)]" />
            <div
              data-progress
              className="trace-v absolute inset-0 [--c:var(--accent)]"
              style={{ clipPath: "inset(0 0 100% 0)" }}
            />
          </div>
          <ol className="divide-y divide-rule">
            {experience.map((item) => (
              <Entry key={item.id} item={item} />
            ))}
          </ol>
        </div>

        <div className="mt-24">
          <h3 className="font-display text-project font-bold tracking-tighter">Education</h3>
          <ul className="mt-8 grid gap-8 border-t border-rule pt-8 md:grid-cols-3">
            {education.map((item) => (
              <li key={item.id} className="flex flex-col gap-1">
                <p className="text-muted">{formatRange(item.startDate, item.endDate)}</p>
                <p className="text-lg text-ink">{item.organization}</p>
                <p className="text-accent-text">{item.title}</p>
                {item.description?.map((line) => (
                  <p key={line} className="text-muted">
                    {line}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
