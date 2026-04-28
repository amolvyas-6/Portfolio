import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  compact?: boolean;
}

export function ThemeToggle({ compact }: ThemeToggleProps) {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // First check localStorage
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") {
        return stored;
      }
      // Fall back to system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  // Apply theme class to document and persist to localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Button
      variant="ghost"
      size={compact ? "sm" : "icon"}
      onClick={toggleTheme}
      className={cn("rounded-full transition-all duration-300 hover:bg-accent/10 hover:text-accent", compact ? "h-9 w-9 p-0" : "h-11 w-11")}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className={compact ? "h-4 w-4" : "h-5 w-5"} />
      ) : (
        <Sun className={compact ? "h-4 w-4" : "h-5 w-5"} />
      )}
    </Button>
  );
}
