import { HeroSection } from "./components/HeroSection";
import { TimelineSection } from "./components/TimelineSection";
import { ProjectSection } from "./components/ProjectSection";
import { ThemeToggle } from "./components/ThemeToggle";
import {
  personalDetails,
  keySkills,
  socialLinks,
  timeline,
  projects,
} from "./data/portfolio";
import { Separator } from "@/components/ui/separator";
import DotGrid from "./components/DotGrid";
import { useCssVarHex } from "./lib/colorUtils";

function App() {
  // These will update automatically when theme changes
  const baseColor = useCssVarHex("--muted", "#5227FF");
  const activeColor = useCssVarHex("--muted-foreground", "#5227FF");

  return (
    <div className="min-h-screen bg-background text-foreground font-mono selection:bg-zinc-200 dark:selection:bg-zinc-800">
      <div className="fixed inset-0 z-10 opacity-20 dark:opacity-15">
        <DotGrid dotSize={8} baseColor={baseColor} activeColor={activeColor} />
      </div>

      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        <HeroSection
          details={personalDetails}
          techStack={keySkills}
          socialLinks={socialLinks}
        />

        <Separator className="my-2" />

        <TimelineSection data={timeline} />

        <Separator className="my-2" />

        <ProjectSection projects={projects} />

        <Separator className="my-2" />
      </main>
    </div>
  );
}

export default App;
