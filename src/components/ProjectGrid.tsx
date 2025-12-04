import type { ProjectItem } from "@/data/portfolio";
import { ProjectCard } from "./ProjectCard";

export const ProjectGrid = ({ items }: { items: ProjectItem[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {items.map((project) => (
      <ProjectCard key={project.id} project={project} />
    ))}
  </div>
);
