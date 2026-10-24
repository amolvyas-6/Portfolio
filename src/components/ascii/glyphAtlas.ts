export const RAMP = " .·:-=+*#%@";
export const MAX_GLYPH = RAMP.length - 1;

/** 0 = ink (quiet), 1 = accent (green), 2 = alert (red). */
export type Kind = 0 | 1 | 2;

export interface AtlasColors {
  ink: string;
  accent: string;
  alert: string;
}

export function readColors(el: Element): AtlasColors {
  const s = getComputedStyle(el);
  const get = (name: string) => s.getPropertyValue(name).trim();
  return { ink: get("--ink"), accent: get("--accent"), alert: get("--alert") };
}

/**
 * Pre-renders every glyph in every colour once so frames only need drawImage.
 * Layout: columns = ramp glyphs, rows = kinds.
 */
export function buildAtlas(cw: number, ch: number, fontPx: number, colors: AtlasColors) {
  const atlas = document.createElement("canvas");
  atlas.width = RAMP.length * cw;
  atlas.height = 3 * ch;
  const ctx = atlas.getContext("2d");
  if (!ctx) return atlas;
  ctx.font = `${fontPx}px "JetBrains Mono Variable", ui-monospace, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const rows: [string, number, number][] = [
    [colors.ink, 0.05, 0.22],
    [colors.accent, 0.3, 1],
    [colors.alert, 0.5, 1],
  ];
  rows.forEach(([color, min, max], k) => {
    ctx.fillStyle = color;
    for (let g = 1; g < RAMP.length; g++) {
      ctx.globalAlpha = min + (max - min) * (g / MAX_GLYPH);
      ctx.fillText(RAMP[g], g * cw + cw / 2, k * ch + ch / 2);
    }
  });
  return atlas;
}
