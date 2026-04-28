import { HeroSection } from "./components/HeroSection";
import { TimelineSection } from "./components/TimelineSection";
import { ProjectSection } from "./components/ProjectSection";
import { ContactSection } from "./components/ContactSection";
import { Navigation } from "./components/Navigation";
import {
  personalDetails,
  keySkills,
  socialLinks,
  timeline,
  projects,
} from "./data/portfolio";
import { Separator } from "@/components/ui/separator";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent/20 relative">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(120,120,120,0.08)_1px,transparent_0)] [background-size:22px_22px]" />

      <Navigation />

      <main className="container mx-auto px-4 md:px-8 max-w-[1200px] relative z-10 pt-24 md:pt-28">
        <HeroSection
          details={personalDetails}
          techStack={keySkills}
          socialLinks={socialLinks}
        />

        <Separator className="my-16 md:my-24 opacity-50" />

        <TimelineSection data={timeline} />

        <Separator className="my-16 md:my-24 opacity-50" />

        <ProjectSection projects={projects} />

        <Separator className="my-16 md:my-24 opacity-50" />

        <ContactSection details={personalDetails} socialLinks={socialLinks} />
      </main>
    </div>
  );
}

export default App;
