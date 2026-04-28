import { Badge } from "@/components/ui/badge";
import type { TimelineItem } from "@/data/portfolio";
import { motion } from "framer-motion";

export const TimelineList = ({ items }: { items: TimelineItem[] }) => (
  <div className="space-y-10 pl-3 md:pl-4">
    {items.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true, margin: "-50px" }}
        className="relative border-l-2 border-border/50 pl-7 pb-4 last:pb-0 group"
      >
        <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-background border-2 border-muted-foreground/70 group-hover:border-accent transition-all duration-300 z-10" />
        <div className="absolute -left-[2px] top-5 bottom-0 w-[2px] bg-gradient-to-b from-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h3 className="font-heading text-xl font-bold tracking-[-0.02em] text-foreground">
            {item.title}
          </h3>
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50 backdrop-blur-sm whitespace-nowrap">
            {item.startDate} — {item.endDate || "Present"}
          </span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="font-medium text-lg text-foreground">
            {item.organization}
          </span>
          {item.location && (
            <span className="text-muted-foreground text-sm flex items-center">
              <span className="w-1 h-1 rounded-full bg-muted-foreground mx-2" />
              {item.location}
            </span>
          )}
        </div>

        {item.description && (
          <ul className="space-y-3 mb-6 text-muted-foreground text-base leading-relaxed">
            {item.description.map((desc, i) => (
              <li key={i} className="flex items-baseline gap-3">
                <span className="text-accent shrink-0 text-lg leading-none opacity-70">▹</span>
                <span className="leading-7">{desc}</span>
              </li>
            ))}
          </ul>
        )}

        {item.tags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[11px] normal-case tracking-normal hover:bg-accent/10 hover:text-foreground hover:border-accent/40 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </motion.div>
    ))}
  </div>
);
