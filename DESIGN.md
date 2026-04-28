## 1. Objective

Redesign the existing portfolio website to achieve:

- Strong visual identity (memorable, not generic SaaS look)
- Clean, modern typography with clear hierarchy
- Custom-styled components (override default shadcn look)
- Cohesive color system based on proper color theory
- Fully responsive, mobile-first experience
- Subtle but meaningful animations

This is **not a minor polish task**. The design should feel like a **premium personal brand site**, not a template.

---

## 2. Design Philosophy

- Prioritize **clarity + personality**
- Avoid default UI library aesthetics
- Use **contrast, whitespace, and rhythm** intentionally
- Every section should feel **designed, not assembled**
- Optimize for **scannability + impact**

---

## 3. Typography System

### Goals

- Establish strong hierarchy
- Improve readability across devices
- Create a distinct visual voice

### Rules

- Use **max 2 font families**
  - 1 for headings (expressive)
  - 1 for body (high readability)

- Define clear scale:

```
H1: 48–64px (desktop), 32–40px (mobile)
H2: 32–40px
H3: 24–28px
Body: 16–18px
Caption: 12–14px
```

- Line height:
  - Headings: tight (1.1–1.2)
  - Body: relaxed (1.5–1.7)

- Apply:
  - Letter spacing for headings
  - Font weight contrast (300 / 400 / 600 / 700)

### Enhancements

- Use **gradient text, highlight spans, or accent colors** sparingly
- Avoid pure black (#000) → use soft dark tones

---

## 4. Color System (Color Theory Driven)

### Requirements

- Define:
  - Primary color
  - Secondary color
  - Accent color
  - Background(s)
  - Text colors
  - Muted UI colors

### Rules

- Use **60–30–10 rule**
- Maintain WCAG contrast
- Avoid random Tailwind defaults

### Style Direction (choose ONE and apply consistently)

- Dark premium (e.g., charcoal + neon accent)
- Minimal light (off-white + muted tones)
- Creative gradient-based identity
- Monochrome + single accent pop

### Additions

- Use gradients for:
  - Hero sections
  - Buttons (subtle)
  - Hover states

---

## 5. Component Redesign (Override shadcn)

### Critical Rule:

Do NOT use default shadcn styling. Every component must be customized.

### Buttons

- Add:
  - Unique hover effects (glow, lift, gradient shift)
  - Rounded styles (not default radius)
  - Motion (scale, shadow)

### Cards

- Avoid plain bordered boxes
- Use:
  - Depth (shadow or layered look)
  - Hover transitions
  - Slight tilt or transform

### Navbar

- Sticky with blur (backdrop-filter)
- Smooth scroll interactions
- Highlight active section

### Sections

Each section should feel distinct:

- Hero → bold, expressive
- Projects → interactive, visual-heavy
- About → clean + readable
- Contact → minimal + focused

---

## 6. Layout & Spacing

- Use consistent spacing scale (8px or 4px system)
- Max width: 1100–1300px
- Avoid cramped layouts

### Rules

- More whitespace than you think you need
- Align content to a grid
- Use asymmetry where it adds creativity

---

## 7. Motion & Interactions

### Add:

- Smooth hover transitions (200–300ms)
- Scroll-based animations (fade, slide, reveal)
- Microinteractions:
  - Button hover
  - Card hover
  - Link underline animations

### Avoid:

- Over-animation
- Janky or slow transitions

---

## 8. Mobile Optimization (Mobile-First)

### Mandatory

- Design for mobile first, then scale up
- Ensure:
  - Tap targets ≥ 44px
  - No text overflow
  - Proper spacing

### Navigation

- Use:
  - Collapsible menu or bottom nav

- Keep interactions simple

### Layout Adjustments

- Stack content vertically
- Reduce font sizes proportionally
- Optimize images and assets

---

## 9. Performance Considerations

- Minimize heavy animations
- Avoid large images
- Use system fonts if needed
- Lazy load assets

---

## 10. Creativity Layer (IMPORTANT)

This is a **portfolio**, not a dashboard.

Add at least 2–3 unique elements:

- Custom cursor or hover effects
- Creative section transitions
- Non-linear layouts (but still usable)
- Subtle 3D / parallax effects

---

## 11. Deliverables

The AI agent must:

1. Refactor styles (CSS / Tailwind config)
2. Override all default component styles
3. Improve typography system globally
4. Redesign layout and spacing
5. Ensure full responsiveness
6. Maintain clean, modular code

---

## 12. What to Avoid

- Generic Tailwind UI look
- Default shadcn styles
- Overuse of bright colors
- Inconsistent spacing
- Poor mobile experience

---

## 13. Success Criteria

- Looks like a **designed portfolio**, not a template
- Strong first impression in <3 seconds
- Smooth on mobile
- Visually consistent across all sections
