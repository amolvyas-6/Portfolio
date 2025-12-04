import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TimelineItem } from "@/data/portfolio";
import { TimelineList } from "./TimelineList";

interface TimelineSectionProps {
  data: TimelineItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ data }) => {
  const experience = data.filter((item) => item.type === "experience");
  const education = data.filter((item) => item.type === "education");

  return (
    <section className="py-12">
      <h2 className="font-sans text-3xl font-bold mb-8">Journey</h2>

      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="experience" className="font-mono">
            Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="font-mono">
            Education
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="experience"
          className="animate-in slide-in-from-bottom-4 duration-500"
        >
          <TimelineList items={experience} />
        </TabsContent>

        <TabsContent
          value="education"
          className="animate-in slide-in-from-bottom-4 duration-500"
        >
          <TimelineList items={education} />
        </TabsContent>
      </Tabs>
    </section>
  );
};
