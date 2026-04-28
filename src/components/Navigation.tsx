import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { id: "hero", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.25, 0.5, 0.75] },
    );

    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    window.scrollTo({
      top: element.offsetTop - 88,
      behavior: "smooth",
    });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed left-1/2 top-4 z-50 hidden w-[min(920px,calc(100%-2rem))] -translate-x-1/2 items-center justify-between rounded-full border border-border/60 bg-background/85 px-3 py-2 backdrop-blur-xl md:flex"
      >
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="inline-flex h-11 items-center rounded-full border border-border/60 bg-primary px-5 text-sm font-bold tracking-[0.28em] text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90"
        >
          AV
        </button>

        <div className="relative flex items-center gap-1 rounded-full bg-secondary/70 p-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  "relative inline-flex h-10 items-center rounded-full px-4 text-xs font-medium uppercase tracking-[0.18em] transition-colors",
                  isActive
                    ? "text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        <ThemeToggle />
      </motion.nav>

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed left-4 right-4 top-3 z-50 rounded-2xl border border-border/60 bg-background/90 px-3 py-2 backdrop-blur-xl md:hidden"
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollTo("hero")}
            className="inline-flex h-11 items-center rounded-full border border-border/60 bg-primary px-4 text-[0.78rem] font-bold uppercase tracking-[0.3em] text-primary-foreground shadow-sm transition-all"
          >
            AV
          </button>

          <div className="flex items-center gap-2">
            <ThemeToggle compact />
            <button
              type="button"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-secondary/70 text-foreground"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: mobileOpen ? "auto" : 0,
            opacity: mobileOpen ? 1 : 0,
            marginTop: mobileOpen ? 10 : 0,
          }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="rounded-2xl border border-border/60 bg-card/95 p-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "flex h-11 w-full items-center justify-between rounded-xl px-4 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                  )}
                >
                  <span>{item.label}</span>
                  <span className="text-xs uppercase tracking-[0.16em] opacity-70">
                    {item.id}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      <nav className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1 rounded-full border border-border/60 bg-background/88 p-1 backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={cn(
                "relative inline-flex h-11 min-w-11 items-center justify-center rounded-full px-3 text-muted-foreground transition-colors",
                isActive && "text-accent-foreground",
              )}
              aria-label={item.label}
            >
              {isActive && (
                <motion.span
                  layoutId="active-mobile-nav"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 280, damping: 28 }}
                />
              )}
              <span className="relative z-10 text-[0.72rem] font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/35 backdrop-blur-[1px] transition-opacity md:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div className="sr-only" aria-live="polite">
        {navItems.find((item) => item.id === activeSection)?.label}
      </div>
    </>
  );
};
