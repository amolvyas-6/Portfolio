import { AnimatePresence, motion } from "motion/react";
import type { ProjectItem } from "@/data/portfolio";
import { useFinePointer } from "@/hooks/useFinePointer";
import { AsciiThumb } from "@/components/ascii/AsciiThumb";
import { Chip } from "@/components/ui/Chip";
import { LinkText } from "@/components/ui/LinkText";

interface Props {
  project: ProjectItem;
  open: boolean;
  onToggle: () => void;
  onHover: (id: string | null) => void;
}

const ease = [0.65, 0, 0.35, 1] as const;

export function ProjectRow({ project, open, onToggle, onHover }: Props) {
  const fine = useFinePointer();
  const panelId = `project-${project.id}`;

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease }}
      className="border-b border-rule"
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          data-cursor={open ? "close" : "view"}
          onClick={onToggle}
          onPointerEnter={(e) => e.pointerType === "mouse" && onHover(project.id)}
          onPointerLeave={() => onHover(null)}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span
            className={`font-display text-project [font-stretch:78%] tracking-tighter transition-[font-weight,color] duration-300 group-hover:font-bold group-hover:text-accent-text group-focus-visible:font-bold group-focus-visible:text-accent-text ${open ? "font-bold text-accent-text" : "font-light"}`}
          >
            {project.title}
          </span>
          <span className="flex shrink-0 items-center gap-4 text-muted">
            <span aria-hidden className="hidden gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 xl:flex">
              {project.tech.slice(0, 3).map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </span>
            {project.demoUrl && (
              <span aria-hidden className="relative grid size-2 place-items-center">
                <span className="absolute size-2 animate-[ping-dot_1.8s_ease-out_infinite] rounded-full bg-accent" />
                <span className="size-2 rounded-full bg-accent" />
              </span>
            )}
            <span>{project.type}</span>
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pb-10 lg:grid-cols-12">
              <div className="flex flex-col gap-5 lg:col-span-7">
                <p className="prose-w">{project.description}</p>
                <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                  {project.tech.map((t) => (
                    <li key={t}>
                      <Chip>{t}</Chip>
                    </li>
                  ))}
                </ul>
                {(project.demoUrl || project.repoUrl) && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {project.demoUrl && (
                      <LinkText external href={project.demoUrl}>
                        Open site
                      </LinkText>
                    )}
                    {project.repoUrl && (
                      <LinkText external href={project.repoUrl}>
                        View source
                      </LinkText>
                    )}
                  </div>
                )}
              </div>
              {!fine && (
                <div className="h-44 overflow-hidden border border-rule bg-surface lg:col-span-5">
                  <AsciiThumb id={project.id} active />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
