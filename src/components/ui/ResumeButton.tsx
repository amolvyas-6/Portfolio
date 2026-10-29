import { LuDownload } from "react-icons/lu";
import { personalDetails } from "@/data/portfolio";
import { cn } from "@/lib/cn";

interface Props {
  className?: string;
  size?: "sm" | "lg";
}

/** Pill link that downloads the resume PDF. Renders nothing if no resume is configured. */
export function ResumeButton({ className, size = "sm" }: Props) {
  const resume = personalDetails.resume;
  if (!resume) return null;

  return (
    <a
      href={`${import.meta.env.BASE_URL}${resume.path}`}
      download={resume.filename}
      data-cursor="download"
      aria-label={`Download resume (PDF)`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-rule text-ink transition-colors hover:border-accent hover:text-accent-text",
        size === "sm" ? "h-11 px-5" : "h-14 px-8 text-lg",
        className,
      )}
    >
      <LuDownload aria-hidden className="size-4 shrink-0" />
      Resume
    </a>
  );
}
