import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import type { ProjectItem } from "@/data/portfolio";

interface ProjectCardProps {
  project: ProjectItem;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
      <CardHeader>
        <CardTitle className="font-sans text-2xl">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="grow">
        <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tech.map((tech) => (
            <Badge key={tech} variant="secondary" className="font-mono text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      {(project.demoUrl || project.repoUrl) && (
        <CardFooter className="flex gap-2 pt-2">
          {project.demoUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 font-mono text-xs"
              asChild
            >
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3 h-3 mr-2" />
                Live Demo
              </a>
            </Button>
          )}
          {project.repoUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 font-mono text-xs"
              asChild
            >
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-3 h-3 mr-2" />
                Source
              </a>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
