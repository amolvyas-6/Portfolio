import React from "react";
import { Button } from "@/components/ui/button";
import type { KeySkills, PersonalDetails, SocialLink } from "@/data/portfolio";
import { motion } from "framer-motion";
import {
  SiTypescript,
  SiReact,
  SiTailwindcss,
  SiPython,
  SiNodedotjs,
  SiDocker,
  SiPytorch,
  SiGit,
  SiC,
} from "react-icons/si";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { Mail, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  details: PersonalDetails;
  techStack: KeySkills[];
  socialLinks: SocialLink[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  typescript: SiTypescript,
  react: SiReact,
  tailwind: SiTailwindcss,
  python: SiPython,
  nodejs: SiNodedotjs,
  docker: SiDocker,
  pytorch: SiPytorch,
  git: SiGit,
  c: SiC,
};

const brandLabelMap: Record<string, string> = {
  c: "C",
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  details,
  techStack,
  socialLinks,
}) => {
  return (
    <section className="relative py-16 md:py-24 min-h-[82vh] flex flex-col justify-center" id="hero">
      <div className="pointer-events-none absolute inset-x-0 top-10 h-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,154,131,0.16),transparent_60%)] blur-3xl" />

      <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-8"
        >
          <div className="space-y-4 max-w-3xl">
            <p className="eyebrow">{details.location}</p>
            <h1 className="font-heading text-balance text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] font-bold">
              {details.name}
            </h1>
            <p className="max-w-2xl text-[clamp(1.25rem,2.4vw,2.2rem)] leading-[1.12] text-foreground/86">
              {details.headline}
            </p>
            <p className="section-lead max-w-xl">{details.bio}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <a href="#projects">
                View selected work
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            {details.email && (
              <Button variant="outline" size="lg" asChild>
                <a href={`mailto:${details.email}`}>
                  <Mail className="h-4 w-4" />
                  Email me
                </a>
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon === "github" ? FaGithub : FaLinkedin;

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 text-sm text-foreground/80 transition-all hover:border-accent/40 hover:bg-accent/5 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.platform}</span>
                </a>
              );
            })}
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="panel p-6 md:p-8"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="eyebrow">Focus</p>
              <p className="text-base leading-7 text-muted-foreground">
                AI, machine learning, embedded systems, and product-minded engineering.
              </p>
            </div>

            <div className="hairline" />

            <div className="space-y-3">
              <p className="eyebrow">Core tools</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {techStack.map((tech) => {
                    const Icon = iconMap[tech.icon ?? ""];

                  return (
                    <div
                      key={tech.id}
                      className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 px-3 py-2 text-sm text-foreground/85 transition-colors hover:border-accent/25 hover:bg-accent/5"
                    >
                      {Icon ? (
                        <Icon className="h-4 w-4 shrink-0 text-accent/75" />
                      ) : (
                        <span className="h-4 w-4 shrink-0 rounded-full bg-foreground/15" />
                      )}
                      <span className="truncate">{brandLabelMap[tech.icon ?? ""] ?? tech.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
};
