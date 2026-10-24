import type { IconType } from "react-icons";
import {
  SiC,
  SiDocker,
  SiFastapi,
  SiGit,
  SiLangchain,
  SiMongodb,
  SiNodedotjs,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

const ICONS: Record<string, IconType> = {
  typescript: SiTypescript,
  react: SiReact,
  tailwind: SiTailwindcss,
  python: SiPython,
  fastapi: SiFastapi,
  langchain: SiLangchain,
  mongodb: SiMongodb,
  redis: SiRedis,
  nodejs: SiNodedotjs,
  docker: SiDocker,
  pytorch: SiPytorch,
  git: SiGit,
  c: SiC,
};

export function SkillIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = name ? ICONS[name] : undefined;
  if (!Icon) {
    return (
      <span aria-hidden className={`${className ?? ""} whitespace-nowrap`}>
        {"{ }"}
      </span>
    );
  }
  return <Icon aria-hidden className={className} />;
}
