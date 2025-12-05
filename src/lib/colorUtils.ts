// colorUtils.ts
import { parse, formatHex } from "culori";
import { useState, useEffect } from "react";

/**
 * Converts a CSS color variable (OKLCH, RGB, etc.) to hex.
 * Returns null if the variable is missing or invalid.
 */
export function cssVarToHex(varName: `--${string}`): string | null {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();

  if (!value) return null;

  const color = parse(value);
  if (!color) return null;

  return formatHex(color);
}

/**
 * Hook that returns hex values for CSS variables and updates when theme changes.
 * Watches for changes to the `dark` class on the document element.
 */
export function useCssVarHex(varName: `--${string}`, fallback: string): string {
  const [hexColor, setHexColor] = useState<string>(() => {
    return cssVarToHex(varName) ?? fallback;
  });

  useEffect(() => {
    // Update color immediately
    const updateColor = () => {
      // Small delay to ensure CSS variables have updated
      requestAnimationFrame(() => {
        setHexColor(cssVarToHex(varName) ?? fallback);
      });
    };

    // Watch for class changes on <html> element (theme toggle adds/removes 'dark')
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "class") {
          updateColor();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Initial update
    updateColor();

    return () => observer.disconnect();
  }, [varName, fallback]);

  return hexColor;
}
