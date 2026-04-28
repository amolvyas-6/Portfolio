import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectItem } from "@/data/portfolio";
import { ProjectGrid } from "./ProjectGrid";
import { motion } from "framer-motion";

interface ProjectSectionProps {
  projects: ProjectItem[];
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({ projects }) => {
  const sortFeaturedFirst = (items: ProjectItem[]) =>
    [...items].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));

  const workProjects = sortFeaturedFirst(projects.filter((p) => p.type === "work"));
  const personalProjects = sortFeaturedFirst(projects.filter((p) => p.type === "personal"));

  return (
    <section className="py-16 md:py-24 relative" id="projects">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title mb-5">
          Selected <span className="text-accent/85">works</span>
        </h2>
        <p className="section-lead mb-10">A mix of hardware, ML, and product experiments. Focused on useful outcomes, not decoration.</p>

        <Tabs defaultValue="work" className="w-full">
          <TabsList className="grid w-full max-w-[420px] grid-cols-2 mb-10 p-1 bg-secondary/60 backdrop-blur-sm border border-border/50 rounded-full">
            <TabsTrigger value="work" className="rounded-full font-medium data-[state=active]:bg-background data-[state=active]:text-foreground transition-all">
              Professional
            </TabsTrigger>
            <TabsTrigger value="personal" className="rounded-full font-medium data-[state=active]:bg-background data-[state=active]:text-foreground transition-all">
              Personal
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="work"
            className="animate-in slide-in-from-bottom-4 duration-500"
          >
            <ProjectGrid items={workProjects} />
          </TabsContent>

          <TabsContent
            value="personal"
            className="animate-in slide-in-from-bottom-4 duration-500"
          >
            <ProjectGrid items={personalProjects} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </section>
  );
};
