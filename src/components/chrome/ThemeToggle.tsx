import { AnimatePresence, motion } from "motion/react";
import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "@/lib/themeContext";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      data-cursor="theme"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      className="relative grid size-11 place-items-center overflow-hidden rounded-full border border-rule text-ink transition-colors hover:border-accent hover:text-accent-text"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid place-items-center"
        >
          {theme === "dark" ? <LuMoon aria-hidden className="size-5" /> : <LuSun aria-hidden className="size-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
