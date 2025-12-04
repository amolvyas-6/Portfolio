import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProjectItem } from "@/data/portfolio";
import { ProjectGrid } from "./ProjectGrid";

interface ProjectSectionProps {
  projects: ProjectItem[];
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({ projects }) => {
  const workProjects = projects.filter((p) => p.type === "work");
  const personalProjects = projects.filter((p) => p.type === "personal");

  return (
    <section className="py-12">
      <h2 className="font-sans text-3xl font-bold mb-8">Projects</h2>

      <Tabs defaultValue="work" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="work" className="font-mono">
            Work
          </TabsTrigger>
          <TabsTrigger value="personal" className="font-mono">
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
    </section>
  );
};
