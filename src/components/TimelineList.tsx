import { Badge } from "@/components/ui/badge";
import type { TimelineItem } from "@/data/portfolio";

export const TimelineList = ({ items }: { items: TimelineItem[] }) => (
  <div className="space-y-8 pl-2">
    {items.map((item) => (
      <div
        key={item.id}
        className="relative border-l-2 border-zinc-200 dark:border-zinc-800 pl-6 pb-2 last:pb-0"
      >
        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-900 border-2 border-zinc-400 dark:border-zinc-600" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h3 className="font-sans text-lg font-bold">{item.title}</h3>
          <span className="font-mono text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
            {item.startDate} to {item.endDate || "Present"}
          </span>
        </div>

        <div className="mb-2">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {item.organization}
          </span>
          {item.location && (
            <span className="text-zinc-500 text-sm"> • {item.location}</span>
          )}
        </div>

        {item.description && (
          <ul className="list-disc list-inside space-y-1 mb-3 text-zinc-600 dark:text-zinc-400 font-mono text-sm">
            {item.description.map((desc, i) => (
              <li key={i}>{desc}</li>
            ))}
          </ul>
        )}

        {item.tags && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] font-mono"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);
