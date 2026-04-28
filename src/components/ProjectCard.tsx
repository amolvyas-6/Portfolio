import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Sparkles } from "lucide-react";
import type { ProjectItem } from "@/data/portfolio";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const isFeatured = Boolean(project.featured);
  const projectNumber = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="h-full"
    >
      <Card
        className={cn(
          "flex h-full flex-col relative group overflow-hidden min-h-[440px]",
          isFeatured
            ? "border-accent/25 shadow-[0_22px_70px_rgba(124,154,131,0.08)]"
            : "",
        )}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -right-16 top-10 h-40 w-40 rounded-full bg-accent/8 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <CardHeader className="relative z-10 pb-0">
          <div className="flex items-start justify-between gap-3">
            <span className="font-heading text-[0.78rem] font-bold tracking-[0.3em] text-muted-foreground/70">
              {projectNumber}
            </span>
            {isFeatured && (
              <Badge
                variant="outline"
                className="border-accent/30 bg-accent/10 text-accent normal-case tracking-normal font-medium text-[10px] px-2.5 py-1"
              >
                <Sparkles className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
          </div>
          <CardTitle className="font-heading text-[1.9rem] md:text-[2rem] font-bold tracking-[-0.04em] leading-[0.98] text-balance max-w-[20ch]">
            {project.title}
          </CardTitle>
          <div className="h-px w-16 bg-gradient-to-r from-accent/65 to-transparent" />
        </CardHeader>

        <CardContent className="relative z-10 flex flex-1 flex-col pt-5 md:pt-6">
          <CardDescription className="text-[0.98rem] mb-5 text-muted-foreground leading-7 max-w-[58ch]">
            {project.description}
          </CardDescription>

          <div className="mt-auto mb-5 rounded-2xl border border-border/60 bg-background/45 p-3 md:p-4">
            <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <Badge
                  key={tech}
                  variant="outline"
                  className="text-xs bg-background/60 backdrop-blur-sm border-border/50 normal-case tracking-normal font-medium"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        {(project.demoUrl || project.repoUrl) && (
          <CardFooter className="relative z-10 mt-auto flex flex-col gap-2 border-t border-border/10 pt-4">
            {project.demoUrl && (
              <Button
                variant="default"
                size="sm"
                className="w-full justify-center font-medium"
                asChild
              >
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live preview
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center font-medium border-border/50"
                asChild
              >
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                  Source code
                </a>
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};
