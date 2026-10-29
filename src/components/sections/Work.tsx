import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/data/portfolio";
import { SectionTitle } from "@/components/text/SectionTitle";
import { ProjectRow } from "./ProjectRow";

type Filter = "all" | "work" | "personal";

// Featured first; Array.prototype.sort is stable so data order is kept within each group.
const sorted = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

const FILTERS: { id: Filter; label: string; count: number }[] = [
  { id: "all", label: "All", count: projects.length },
  { id: "work", label: "Work", count: projects.filter((p) => p.type === "work").length },
  { id: "personal", label: "Personal", count: projects.filter((p) => p.type === "personal").length },
];

export function Work() {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const visible = sorted.filter((p) => filter === "all" || p.type === filter);

  return (
    <section id="work" aria-labelledby="work-title" className="section-y">
      <div className="mx-auto max-w-[1600px] page-x">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <SectionTitle id="work-title">Work</SectionTitle>
          <div role="group" aria-label="Filter projects" className="flex gap-6">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => {
                  setFilter(f.id);
                  setOpenId(null);
                  setHoverId(null);
                }}
                className="relative pb-1 text-muted transition-colors hover:text-ink aria-pressed:text-ink"
              >
                {f.label} <span className="text-meta">{f.count}</span>
                {filter === f.id && (
                  <motion.span
                    layoutId="filter-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
                    transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-12 border-t border-rule">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => (
              <ProjectRow
                key={p.id}
                project={p}
                open={openId === p.id}
                onToggle={() => setOpenId((cur) => (cur === p.id ? null : p.id))}
                onHover={setHoverId}
              />
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
      {/* <ProjectPreview id={hoverId} /> */}
    </section>
  );
}
