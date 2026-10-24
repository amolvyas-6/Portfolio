import { LuArrowUpRight } from "react-icons/lu";
import { cn } from "@/lib/cn";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
  cursor?: string;
}

export function LinkText({ external = false, cursor, className, children, ...rest }: Props) {
  return (
    <a
      data-cursor={cursor ?? (external ? "open" : undefined)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn("link-underline inline-flex items-center gap-1 text-accent-text", className)}
      {...rest}
    >
      {children}
      {external && <LuArrowUpRight aria-hidden className="size-4 shrink-0" />}
    </a>
  );
}
