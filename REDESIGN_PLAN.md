# Portfolio redesign: implementation plan

Audience: the agent implementing this. Everything you need is in this file plus `src/data/portfolio.ts`. Ignore the old `DESIGN.md` and the old components; they are being thrown away.

## 0. Goal in one paragraph

Amol Vyas is a Software Development Engineer who is also into AI applications (LinkedIn SDE intern building a LangGraph helpdesk agent, founding engineer of Namma Pothole, AI Lawyer, etc.). The site should feel creative, fast, and developer-flavoured without being a fake terminal. It is monospace throughout, full of deliberate motion (loader, scroll scenes, transitions, hover micro-interactions), has a dark/light toggle, and has one memorable centrepiece: a live ASCII glyph field behind the hero.

Reference vibe (viewed): nahiyan.codes/work (mono type, big titles, grain, bottom nav, hover previews), mikewilcockdesign.com (loader counter, giant name, per-letter motion, menu pill), curtisdesignr.me (loader with percent, hairline guide lines, HUD-style micro copy, clip-path menu). Take the energy, not the layouts or assets.

## 1. Decisions already made (do not relitigate)

| Topic | Decision | Why |
| --- | --- | --- |
| Framework | **Vite + React 19 + TypeScript**, keep as is. Do not move to Next.js. | The site is a single-page static site deployed with `gh-pages`. Next would add a static-export step and no benefit. All requested libs work identically in React. |
| Styling | Tailwind CSS v4, CSS-first (`@theme` in `src/index.css`). Delete `tailwind.config.js`. | Already installed (`@tailwindcss/vite`). |
| Animation | **Framer Motion** (package `motion`, import from `motion/react`; this is Framer Motion's current name) + **GSAP 3.13** (ScrollTrigger, SplitText, all free now) + **Lenis** for smooth scroll. | See the responsibility split in section 6. |
| Routing | None. One page with anchor sections plus a menu overlay. | Avoids the gh-pages SPA 404 problem. "Page transitions" are delivered by the loader, menu overlay, theme wipe, and scroll scenes. |
| Data | All content comes from `src/data/portfolio.ts`. Never hardcode names, bios, projects, or links in components. Only additive changes to that file's interfaces. | Single source of truth. |
| Theme | Dark and light, first visit follows `prefers-color-scheme`, toggle persists in `localStorage`. | Requested. |

## 2. Branch and repo setup

The user wants a clean slate. Do this on a new orphan branch (do not touch `main`, do not commit unless asked):

```sh
git checkout --orphan redesign
git rm -rf --cached .
# Delete everything in the working tree EXCEPT:
#   src/data/portfolio.ts
#   REDESIGN_PLAN.md
#   .gitignore
#   public/favicon.ico   (replaced later, see 9)
# Then scaffold:
npm create vite@latest . -- --template react-ts   # accept "ignore files and continue"
```

Then:

- Reuse the old `package.json` name (`portfolio-website`) and keep the `predeploy` / `deploy` scripts (`gh-pages -d dist`).
- Install: `tailwindcss @tailwindcss/vite motion gsap @gsap/react lenis @fontsource-variable/martian-mono @fontsource-variable/jetbrains-mono clsx tailwind-merge`. Optional: `lucide-react` for UI icons and `react-icons` (import from `react-icons/si` only, for brand glyphs).
- Do **not** install: `framer-motion` (duplicate of `motion`), Radix, `class-variance-authority`, `culori`, `tw-animate-css`, shadcn. The old `components.json` goes away.
- Keep the `@` alias to `src`.
- `vite.config.ts`: the old `base` was the absolute URL `https://amolvyas-6.github.io/Portfolio`. Replace it with `"/Portfolio/"` for the GitHub Pages path, or `"/"` if the site is served from the custom domain `amolvyas.is-a.dev`. **Ask the user which one is live** before changing deploy config.
- If a font package name fails to install, fall back to the static `@fontsource/martian-mono` and `@fontsource/jetbrains-mono`.

## 3. Design system

### 3.1 Concept

"Signal and alert." A developer/hacker feel built from a **blackish-green base, a muted phosphor-green signal colour, and a small amount of red used as an interrupt colour**. The site is deliberately **not** tied to any city or place; it is generic developer culture (build logs, diffs, commit graphs, ASCII), not a theme park version of a terminal.

The structural motif is a **dashed trace line** (like a git commit graph or a signal trace) that acts as the experience timeline spine, section divider, loader progress bar, and scroll-progress indicator. The one loud thing is the **ASCII glyph field** in the hero and loader. Everything else stays quiet and disciplined.

**Contrast is intentionally soft.** No pure `#000`, no pure `#fff`, no neon. Dark mode text is a desaturated green-grey (about 8:1 on the background, not 18:1), and the green is a muted phosphor, not `#00ff00`. Still must meet WCAG AA (4.5:1) for all text. Do not use glow/`text-shadow` bloom, Matrix digital rain, or CRT scanline overlays.

Red usage is strictly limited (it only works if it is rare): (1) the leading edge of the cursor ripple in the ASCII field, which fades to green behind it; (2) the "now/ongoing" recording-style blinking dot on present-day experience entries; (3) a brief chromatic glitch offset on display text hover and on theme toggle; (4) `::selection` background; (5) error or failed-copy state. Never use red for body text, links, or large fills.

Rejected on purpose: cream + serif + terracotta; purple gradients (reads as generic AI); city-specific or road/transit imagery; all-caps tracked eyebrow labels above every heading; numbered 01/02/03 markers on things that are not a sequence; a boxed terminal window, `$` prompts, or blinking-cursor-as-logo.

### 3.2 Colour tokens (CSS variables, swapped by `.dark` / `.light` class on `<html>`)

| Token | Light ("paper") | Dark ("blackout") | Use |
| --- | --- | --- | --- |
| `--bg` | `#E4EAE4` (pale green-grey) | `#0B0F0C` (blackish green) | page |
| `--surface` | `#EEF2EE` | `#121813` | raised panels, chips |
| `--ink` | `#28372D` (deep green-grey, not black) | `#9FB5A4` (soft green-grey, not white) | primary text, ASCII glyphs |
| `--muted` | `#5A6B5F` | `#74887A` | secondary text |
| `--rule` | `#C3CEC4` | `#1F2A22` | hairlines, dashed trace line base |
| `--accent` | `#2E9E5B` | `#46C37B` | green fills, trace line progress, highlights, focus ring |
| `--accent-ink` | `#0E1510` | `#0B0F0C` | text on top of `--accent` fills |
| `--accent-text` | `#1B6E3E` | `#46C37B` | green used as **text** and link colour (the light `--accent` fails contrast as text, so never use `--accent` for light-mode text) |
| `--alert` | `#B53433` | `#E06C6A` | red, restricted uses only (see 3.1); text-safe on its theme's background |

There is no blue or other hue. Links are `--accent-text` with an animated underline.

Contrast rule: body and muted text must pass WCAG AA (4.5:1) in both themes, but should stay well below maximum contrast (aim for roughly 7 to 10:1 for body text). The values above were chosen with that in mind; verify with a script or devtools before finishing and nudge lightness (not hue) if anything fails, including text on `--surface` and on `--accent` fills.

The "flip scene" (section 5.4) redefines these variables to the opposite theme's values inside a section.

Add a subtle static texture overlay: a tiny tiled SVG dot-grid/dither pattern at ~3 to 4% opacity in `--ink`, `pointer-events: none`. No animated grain and no scanlines; both cost frames and push toward a CRT cliche.

### 3.3 Typography

Everything is monospace, two clearly different families:

- **Display: Martian Mono** (variable: weight 100 to 800, width 75 to 112). Used for the hero name, section titles, project titles, loader counter. Tight tracking (`-0.04em`) at large sizes, narrow width (`wdth 75`) at display sizes so long words fit.
- **Text: JetBrains Mono** (variable). Body 15 to 16px, line-height 1.65, **max line length 68ch**. Chips and meta 13px. Never below 13px.
- Sentence case everywhere. No all-caps labels. Meta text is lowercase or sentence case, not tracked-out caps.
- Fluid scale (use `clamp`): hero name `clamp(4rem, 15vw, 14rem)`; section title `clamp(2.5rem, 8vw, 7rem)`; project title `clamp(1.75rem, 5vw, 4.5rem)`; body 1rem; meta 0.8125rem.
- Preload the Martian Mono latin variable file (`<link rel="preload" as="font" crossorigin>`), `font-display: swap`, and set a metric-matched monospace fallback to avoid layout shift.
- Weight axis is layout-stable in a monospace face (advances do not change), so animate **weight** on hover and cursor proximity. Animate **width** only during the intro, not continuously.

### 3.4 Shape and spacing

- 12-column grid, 24px gutters on desktop, 16px on mobile, page padding `clamp(16px, 4vw, 48px)`.
- Mostly square corners with hairline borders (1px `--rule`). Interactive pills (menu button, theme toggle, copy button) are fully rounded. Do not give everything the same radius or shadow; no drop shadows, use borders and surface colour.
- **Left-aligned** text everywhere. The hero name is left-aligned with the second line indented to create the stagger. Nothing is centre-aligned except the loader counter.

### 3.5 Content voice

Plain and specific. Use the real data. Labels say what they are: "Experience", "Work", "Education", "Contact". Buttons say what happens: "Copy email", "Open site", "View source", "Switch to light theme". No "Let's build something amazing" filler. After copying the email, the button text changes to "Copied" and an `aria-live="polite"` region announces it.

## 4. Information architecture and layout

Single page, sections in this order, ids used for anchors and the menu:

```
#top         Hero
#about       About + skills
#experience  Experience (trace-line timeline) + Education (compact)
#work        Projects (flip scene)
#contact     Contact + footer (flip scene continues)
```

Persistent chrome:

```
┌──────────────────────────────────────────────────────────────┐
│ A. Vyas (logo)      Bangalore 14:32 IST        [theme] [menu]│  fixed top bar, hides on scroll down, shows on scroll up
└──────────────────────────────────────────────────────────────┘
left edge: thin vertical dashed trace line = page scroll progress (desktop only)
```

### 4.1 Hero (`#top`)

```
(ASCII glyph field fills the section, low contrast, reacts to cursor)

Software Development Engineer          Bangalore, India
who also builds AI applications

AMOL
      VYAS                              (giant, Martian Mono, staggered)

short bio line (first sentence of bio)        scroll indicator (animated dashed line)
```

- H1 is "AMOL" / "VYAS" from `personalDetails.name`, split per letter. Letters ripple in weight (300 to 800) based on cursor distance (desktop) or a slow idle wave (touch).
- A rotating role line uses scramble text (see 5.3). Phrases: `personalDetails.role`, then three static ones: "building AI agents", "shipping FastAPI backends", "making things people use". Cycle every 3.5s, pause when tab hidden or reduced motion.
- Headline from `personalDetails.headline` goes in the document as visually-hidden or small text so SEO content matches.
- Hero must be readable with the ASCII field fully disabled.

### 4.2 About + skills (`#about`)

- Left column: `personalDetails.bio`, rendered with SplitText line reveal. Age (computed from `dob`) and location as plain sentences, not a spec table.
- Right column (or below on mobile): `keySkills` as an infinite horizontal marquee of two rows moving in opposite directions (GSAP, speed tied to scroll velocity via Lenis, slowed on hover). Each skill is a chip: brand glyph (from `icon` key via a small map, falling back to a monospace `{ }` glyph when there is no icon) plus the name. Pause on `prefers-reduced-motion` and render as a static wrapped list.

### 4.3 Experience (`#experience`)

Source: `timeline` filtered by `type === "experience"`, newest first (sort by `startDate` descending; do not rely on array order). Education below from `type === "education"` as a quieter two-column compact list.

```
 :   2026        LinkedIn                     SDE Summer Intern
 :   May to Jul  - bullet                     LangGraph  Agentic AI  Jira ...
 ●   11 weeks    - bullet
 :
 :   2025        Namma Pothole  [live]        Founding Engineer
 ●   Sep to now  ...
```

- The `:` column is the **dashed trace line**, styled like a git commit graph: an SVG/CSS dashed vertical line with a node per entry. A green progress overlay is scrubbed with ScrollTrigger as the section scrolls, and each node fills when passed. Optionally show a decorative 7-character pseudo-hash beside each node, derived deterministically from the entry `id` (`aria-hidden`; purely visual).
- Entries with `endDate === null` show a small blinking red recording-style dot and the word "now" (also `Namma Pothole` shows its `url` as a link).
- Date formatting helper handles both `yyyy-mm` and `yyyy-mm-dd`; shows "May 2026 to Jul 2026" (use the word "to", not an arrow) and a computed duration ("11 weeks", "7 months").
- Description bullets reveal line by line as they enter (SplitText lines, `once: true`).
- Tags as outlined chips. Keep the chip list visually quiet.
- Do not show a `location` line when `location` is undefined (the LinkedIn entry has none).

### 4.4 Work (`#work`) as a flip scene

Source: `projects`. Filter control with three options: "All", "Work", "Personal" (with counts), implemented with Framer Motion `layout` so rows reflow smoothly. Default sort: `featured` first, then data order.

```
All 9   Work 4   Personal 5

Namma Pothole                              work   FastAPI MongoDB Redis
─────────────────────────────────────────────────────────────────────
LinkedIn Helpdesk Agent                    work   LangGraph ...
─────────────────────────────────────────────────────────────────────
AI Lawyer                                  personal ...
```

- Each row is a big title. Hover (desktop, `pointer: fine`): the title's weight rises, tech chips fade in, and a **floating ASCII thumbnail** follows the cursor (GSAP `quickTo`, slight rotation based on velocity). No screenshots exist, so thumbnails are procedural (see 5.2).
- Click or tap or Enter toggles an accordion (`button` with `aria-expanded`): description, full tech list, and links. `demoUrl` shows "Open site", `repoUrl` shows "View source". Namma Pothole shows a small green live dot. Only one row open at a time, animated with Framer Motion `AnimatePresence` + height auto.
- On touch devices there is no floating thumbnail; the thumbnail renders inline at the top of the expanded content.
- The LinkedIn project has no link; do not render empty link slots. Do not invent URLs.

### 4.5 Contact (`#contact`) and footer

- Giant email (`personalDetails.email`) as the main element, magnetic hover (Framer Motion springs), click copies. Secondary: `socialLinks` as text links with an animated underline. Website from `personalDetails.website`.
- Footer line: live IST clock (`Intl.DateTimeFormat` with `timeZone: "Asia/Kolkata"`, updates every second only while visible), "Back to top" button (smooth scroll), copyright year computed at runtime.
- Footer easter egg (optional, last priority): a large ASCII-art wordmark of the name that glitches (brief red/green channel offset, scramble) on hover or tap. Must not affect layout or a11y (`aria-hidden`, real name present as text elsewhere).

## 5. Motion spec

Principle: one orchestrated entrance (loader into hero), a few strong scroll scenes, and responsive micro-interactions. **Do not** add a generic fade-up to every block or hover transforms on every card.

### 5.1 Loader (first visit per session only)

Duration 1.8 to 2.4s total, never longer. Real content is already rendered underneath so LCP is not blocked.

1. Full-screen `--bg` layer. Center: percent counter `000` to `100` in Martian Mono (tabular), tied to real progress (fonts ready + first paint) with a minimum floor so it never flashes.
2. Behind it, glyphs from the ASCII ramp fill the viewport randomly, then ease into the shape of the name "AMOL VYAS" (sample a text mask from an offscreen canvas) as the counter nears 100.
3. A dashed trace line along the bottom acts as the progress bar (green fill).
4. Exit: GSAP timeline splits the layer into two halves that slide off (`yPercent -100` / `+100`) with `expo.inOut`, while the hero H1 letters rise in from a mask and the ASCII field fades in. Total exit 0.7s.
5. Skip rules: `sessionStorage` flag after first play; press any key or click to skip; `prefers-reduced-motion` shows a 300ms fade at most; lock scroll while active, release on complete.

### 5.2 ASCII art pieces (all canvas, no libraries)

Shared glyph ramp: `" .·:-=+*#%@"`, rendered through a **pre-built glyph atlas** (one offscreen canvas per theme colour/opacity step), then `drawImage` per cell. Never call `fillText` per cell per frame.

- **`AsciiField` (hero and loader):** grid cell about 10x18px (mono aspect). Per frame: value = fractal noise(x, y, t) + cursor ripple (radial falloff, decays over about 600ms) mapped to a ramp index. Cells within the cursor radius use `--accent`, with the very leading edge of the ripple briefly `--alert` (red) before fading to green; the rest use `--ink` at 6 to 30% alpha (keep the idle field subtle). Cap at about 6,000 cells (increase cell size on large or mobile viewports), DPR capped at 2, 30fps on mobile. Pause when off-screen (IntersectionObserver), when `document.hidden`, or when reduced motion is on (draw one static frame). Re-read colours on theme change.
- **`AsciiThumb` (project previews):** deterministic seeded pattern per project id, so each project has its own look. Suggested mapping, by id: `work3` Namma Pothole = a dotted road with a crater that breathes (this is project-specific art, not a site theme); `work4` LinkedIn agent = a small node graph with a pulse travelling along edges; `per5` AI Lawyer = rows of "text lines" scanning and redacting (some bars turn into `█`); others fall back to a seeded noise pattern. Animate only while hovered or expanded.
- **Footer wordmark glitch:** see 4.5.

### 5.3 Text effects

- `ScrambleText`: characters resolve left to right from random glyphs of the ramp. Used for the role line, menu items on hover, and section titles on first reveal. Always render the final string in `aria-label` (or visually hidden text) and mark the scrambling spans `aria-hidden`.
- `SplitText` line reveals for paragraphs and bullets (mask + `yPercent`), `once: true`.
- Section titles: characters rise through a mask on enter, then weight-ripple on hover.

### 5.4 Scroll scenes (GSAP ScrollTrigger + Lenis)

- **Lenis** smooth scroll, synced to GSAP: `lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t * 1000))`, `gsap.ticker.lagSmoothing(0)`. Disabled under reduced motion. Anchor links use `lenis.scrollTo`.
- **Hero exit:** as you scroll out, H1 lines drift apart horizontally (scrubbed, opposite directions) and the ASCII field dims.
- **Flip scene:** the `#work` section enters as an inset rounded panel (`inset 5vw`, radius 28px) that scrubs to full-bleed, while its CSS variables flip to the opposite theme (light page gets a dark work section, dark page gets a light one). Implement by redefining the colour tokens under `[data-scene="flip"]`. Contact stays flipped, so the page ends in the same scene as the work section.
- **Trace line:** experience progress scrub (4.3) plus the thin left-edge page progress line.
- **Marquee velocity:** skills marquee speed is boosted by scroll velocity and eases back.
- Keep every ScrollTrigger inside `useGSAP` / `gsap.context` with proper cleanup so React StrictMode and HMR do not leak triggers.

### 5.5 Theme toggle transition

Pill toggle with a sun/moon morph (Framer Motion). On click: use the **View Transitions API** with a circular `clip-path` expanding from the toggle's position (`document.startViewTransition`), applying the class change inside the callback. Fallback when unsupported or reduced motion: instant swap with a 150ms colour transition. The canvas pieces re-read colours on the theme event.

Theme init: inline script in `index.html` `<head>` sets the class on `<html>` before first paint (no flash). Update `<meta name="theme-color">` on change. Set `color-scheme` in CSS.

### 5.6 Menu overlay

Pill "Menu" button opens a full-screen overlay: `clip-path` circle wipe from the button (GSAP), then links stagger in with scramble-on-hover, each with a small description pulled from data (e.g. experience count). Also shows email, socials, and the theme toggle. Focus trap, `Esc` closes, `aria-expanded` on the button, body scroll locked, focus returned on close.

### 5.7 Cursor and micro-interactions (desktop only, `pointer: fine`)

- Custom cursor: small dot + trailing ring (GSAP `quickTo`), grows and shows a short label ("open", "copy", "view") over interactive targets. Native cursor is **not** hidden over text inputs or if the user prefers reduced motion. Never required for any interaction.
- Magnetic effect only on the primary contact element, menu button, and theme toggle.

## 6. Framer Motion vs GSAP responsibilities

Never animate the same property on the same element with both.

| Framer Motion (`motion/react`) | GSAP |
| --- | --- |
| React-state-driven UI: menu open state, accordion, filter `layout` reflow, theme toggle icon, magnetic springs, copy button state, `AnimatePresence` | Loader timeline, ScrollTrigger scenes, SplitText, Lenis sync, marquee, floating thumbnail follow, cursor, menu clip-path wipe |

## 7. Component and file structure (suggested)

```
index.html                      theme init script, font preload, meta tags
src/
  main.tsx                      mounts <App/>, imports fonts + index.css
  App.tsx                       providers + sections + chrome
  index.css                     @import "tailwindcss"; @theme tokens; .light/.dark vars; [data-scene=flip]; grain
  data/portfolio.ts             (already updated: do not hardcode content elsewhere)
  lib/
    gsap.ts                     registers ScrollTrigger + SplitText once
    dates.ts                    formatRange(), duration(), age()
    cn.ts
  hooks/
    useReducedMotion.ts         wraps motion's hook + gsap.matchMedia
    useTheme.ts                 state, persistence, view transition
    useFinePointer.ts
    useIstClock.ts
    useInView.ts
  components/
    chrome/  TopBar, MenuOverlay, ThemeToggle, Cursor, ScrollProgress, SkipLink, Grain
    loader/  Loader
    ascii/   AsciiField, AsciiThumb, glyphAtlas.ts, noise.ts, seeded.ts, AsciiWordmark
    text/    ScrambleText, SplitReveal, SectionTitle
    sections/ Hero, About, SkillsMarquee, Experience, Education, Work, ProjectRow, Contact, Footer
    ui/      Chip, LinkText, MagneticButton, TraceLine
```

Keep components small and typed. Add an `icons.ts` that maps `KeySkills.icon` keys (`typescript`, `react`, `tailwind`, `python`, `fastapi`, `langgraph`, `langchain`, `mongodb`, `redis`, `nodejs`, `docker`, `pytorch`, `git`, `c`) to a brand glyph; unknown keys must fall back gracefully (`langgraph` has no common brand icon).

## 8. Data notes for the implementer

- `TimelineItem` gained an optional `url`. Render it as a link on the entry title when present (Namma Pothole).
- Dates are `yyyy-mm` or `yyyy-mm-dd`; `endDate: null` means present. Samsung PRISM and Namma Pothole are currently "present".
- `ProjectItem.type` is `"work" | "personal"`. Work includes the new LinkedIn agent and Namma Pothole. AI Lawyer is personal. `repoUrl` for AI Lawyer points at a branch URL (`tree/merge-rag-into-test1`); keep as given.
- The wallet project and the Bhatiyani experience still mention embedded hardware. That is historical experience and stays; the **site's positioning** (headline, role, hero, meta tags) is SDE + AI applications, with no "embedded engineer" framing anywhere in the UI copy you write.
- No `location` for the LinkedIn entry (not provided). Do not fabricate one.

## 9. SEO, meta, assets

- `<title>`: "Amol Vyas | Software Development Engineer". Meta description built from `headline` + location. Open Graph and Twitter tags, canonical URL from `personalDetails.website`.
- JSON-LD `Person` (name, jobTitle, url, sameAs from `socialLinks`).
- Favicon: SVG with a green glyph (for example a `>_`-free abstract mark or the letter A in Martian Mono) on `--bg`, with a light variant via `prefers-color-scheme` inside the SVG. Replace `public/favicon.ico` (keep an `.ico` fallback).
- OG image 1200x630: generate a static PNG (screenshot of the ASCII hero in dark mode) and put it in `public/`.
- `public/robots.txt`. Semantic landmarks: `header`, `main`, `section[aria-labelledby]`, `footer`. Single `h1`.

## 10. Performance, accessibility, and quality bars

Performance
- Initial JS under ~200KB gzipped. Lazy-load below-the-fold sections that need GSAP SplitText/ScrollTrigger only if the budget is exceeded; the hero and loader load eagerly.
- Lighthouse mobile: Performance 90+, Accessibility 100, Best Practices 100, SEO 100. CLS 0. LCP under 2.5s on throttled 4G.
- Only animate `transform`, `opacity`, `clip-path`, and font-variation weight on short strings. Avoid layout-thrashing properties. Use `will-change` sparingly and only during animations.
- One shared `requestAnimationFrame` loop (the GSAP ticker) for canvases and cursor; do not spawn independent rAF loops.
- Pause everything when the tab is hidden.

Accessibility
- `prefers-reduced-motion: reduce`: no loader animation (instant), no Lenis, no ASCII animation (single static frame), no marquee movement, no scramble (show final text), no scroll-scrubbed motion; keep colour/opacity state changes only.
- Visible `:focus-visible` ring (2px `--accent` outline with 2px offset; verify contrast against both backgrounds).
- Skip-to-content link, keyboard-reachable menu, accordion, theme toggle, filter, and copy button. All icon-only buttons have `aria-label`s that state the action (for example "Switch to light theme").
- Touch targets at least 44px. Hover-only information must also be reachable by tap/focus.
- Decorative canvases and the ASCII wordmark are `aria-hidden`. The blinking red "now" dot must also be conveyed in text ("now") and must stop blinking under reduced motion.

Responsive
- Test at 360, 768, 1024, 1440, and 1920 widths. On mobile: no custom cursor, no floating thumbnail, reduced ASCII density, top bar condensed, the experience trace line stays but narrower.

## 11. Build order (milestones with acceptance checks)

1. **Scaffold and tokens.** Orphan branch, deps, Tailwind v4 tokens, fonts, theme init script and toggle without animation. Check: both themes render, no flash on reload, `npm run build` and `npm run lint` pass.
2. **Static layout of all sections** from the data file, no motion. Check: all data (incl. the two new experiences and three new projects) renders correctly; responsive at all widths; keyboard navigation works.
3. **Motion foundation.** `lib/gsap.ts`, Lenis sync, `useReducedMotion`, SplitReveal, ScrambleText, section title reveals. Check: no leaked ScrollTriggers under StrictMode, reduced motion verified.
4. **ASCII.** Glyph atlas, `AsciiField` in the hero, then `Loader`, then `AsciiThumb`. Check: 60fps on desktop, 30fps cap on mobile, paused when off-screen.
5. **Scenes.** Hero exit, trace line, flip scene, marquee, accordion, filter `layout`. Check: no layout jumps; scenes reverse cleanly on scroll up.
6. **Chrome.** Top bar, menu overlay, theme view-transition wipe, cursor, magnetic elements. Check: focus trap, Esc, focus return, fallback paths.
7. **Polish.** Footer easter egg (optional), meta tags, favicon, OG image, JSON-LD.
8. **QA.** Playwright screenshots at 3 widths in both themes; reduced-motion emulation; Lighthouse; contrast audit; verify no console errors; `npm run build` then `npm run preview` smoke test. Fix, then report results honestly, including anything not met.

## 12. Out of scope

Blog, CMS, i18n, analytics, backend, contact form. Do not add them unless the user asks.

## 13. Open questions to confirm with the user before or during build

1. Which URL is live (GitHub Pages path or `amolvyas.is-a.dev`)? Affects `vite.config.ts` `base`.
2. Is Samsung PRISM still ongoing? Its `endDate` is `null` (present) in the data.
3. Any photo or headshot to include? The plan does not use one.
4. Location for the LinkedIn internship, if they want it shown.
