import { cn } from "@/lib/cn";

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-rule px-2 py-0.5 text-meta text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
