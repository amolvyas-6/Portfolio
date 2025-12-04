import React from "react";
import { Button } from "@/components/ui/button";
import type { PersonalDetails, KeySkills, SocialLink } from "@/data/portfolio";
import {
  Github,
  Linkedin,
  Mail,
  Globe,
  Code2,
  Atom,
  Wind,
  Server,
  Box,
  Flame,
  GitBranch,
  FileCode,
  Database,
  Cpu,
  Braces,
  Terminal,
  Layers,
  Cog,
} from "lucide-react";

interface HeroSectionProps {
  details: PersonalDetails;
  techStack: KeySkills[];
  socialLinks: SocialLink[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  details,
  techStack,
  socialLinks,
}) => {
  const getIcon = (iconName?: string, size: "sm" | "md" = "md") => {
    const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    switch (iconName) {
      // Social icons
      case "github":
        return <Github className={sizeClass} />;
      case "linkedin":
        return <Linkedin className={sizeClass} />;
      // Language icons
      case "typescript":
        return <Braces className={sizeClass} />;
      case "python":
        return <Terminal className={sizeClass} />;
      case "c":
        return <FileCode className={sizeClass} />;
      // Framework icons
      case "react":
        return <Atom className={sizeClass} />;
      case "nodejs":
        return <Server className={sizeClass} />;
      case "pytorch":
        return <Flame className={sizeClass} />;
      // Tool icons
      case "tailwind":
        return <Wind className={sizeClass} />;
      case "docker":
        return <Box className={sizeClass} />;
      case "git":
        return <GitBranch className={sizeClass} />;
      // Generic fallbacks
      case "database":
        return <Database className={sizeClass} />;
      case "cpu":
        return <Cpu className={sizeClass} />;
      case "layers":
        return <Layers className={sizeClass} />;
      case "cog":
        return <Cog className={sizeClass} />;
      case "code":
        return <Code2 className={sizeClass} />;
      default:
        return <Globe className={sizeClass} />;
    }
  };

  return (
    <section className="py-12 md:pt-20 space-y-8 animate-in fade-in duration-700">
      <div className="space-y-4">
        <h1 className="font-sans text-4xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {details.name}
        </h1>
        <p className="font-mono text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
          {details.headline}
        </p>
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-500 max-w-xl leading-relaxed">
          {details.bio}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {socialLinks.map((link) => (
          <Button key={link.id} variant="outline" size="icon" asChild>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.platform}
            >
              {getIcon(link.icon)}
            </a>
          </Button>
        ))}
        {details.email && (
          <Button variant="outline" size="icon" asChild>
            <a href={`mailto:${details.email}`} aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-sans text-lg font-semibold">Key Skills</h3>
        <div className="flex flex-wrap gap-3">
          {techStack.map((tech) => (
            <Button
              key={tech.id}
              variant="secondary"
              size="lg"
              className="font-mono cursor-default pointer-events-none"
            >
              {getIcon(tech.icon, "sm")}
              <span>{tech.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
