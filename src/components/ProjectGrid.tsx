import type { ProjectItem } from "@/data/portfolio";
import { ProjectCard } from "./ProjectCard";

export const ProjectGrid = ({ items }: { items: ProjectItem[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
    {items.map((project, index) => (
      <ProjectCard key={project.id} project={project} index={index} />
    ))}
  </div>
);
