import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TimelineItem } from "@/data/portfolio";
import { TimelineList } from "./TimelineList";
import { motion } from "framer-motion";

interface TimelineSectionProps {
  data: TimelineItem[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ data }) => {
  const experience = data.filter((item) => item.type === "experience");
  const education = data.filter((item) => item.type === "education");

  return (
    <section className="py-16 md:py-24 relative" id="journey">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="section-title mb-5">
          My <span className="text-accent/85">journey</span>
        </h2>
        <p className="section-lead mb-10">Education and work, arranged in order of what shaped how I build.</p>

        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="grid w-full max-w-[420px] grid-cols-2 mb-10 p-1 bg-secondary/60 backdrop-blur-sm border border-border/50 rounded-full">
            <TabsTrigger value="experience" className="rounded-full font-medium data-[state=active]:bg-background data-[state=active]:text-foreground transition-all">
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="rounded-full font-medium data-[state=active]:bg-background data-[state=active]:text-foreground transition-all">
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
      </motion.div>
    </section>
  );
};
