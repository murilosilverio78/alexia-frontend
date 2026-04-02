# Alexia Design System Master

> Source of truth for the Alexia frontend UI.
> Generated from the local `ui-ux-pro-max` skill for `Legal / SaaS / React + Tailwind`, then normalized for this project.
> All UI code must follow these tokens and rules unless a future page override explicitly states otherwise.

## Product

- Product: `Alexia - Legal Advisory AI Platform`
- Category: `Legal / SaaS`
- Stack: `React + Tailwind`
- Positioning: authoritative, trustworthy, precise, contemporary

## Visual Direction

- Pattern: `Hero-Centric + Trust`
- Tone: institutional but not cold
- Interaction style: restrained motion, clear affordances, explicit feedback
- Surfaces: light, layered, document-like cards over a neutral background
- Icons: `Lucide` only

## Anti-Patterns

- Do not use emoji as structural icons.
- Do not use playful gradients or neon accents.
- Do not rely on color alone to communicate status.
- Do not remove visible focus styles.
- Do not exceed `300ms` for hover and state transitions.
- Do not add decorative animation that competes with legal content.

## Color Tokens

### Core

- `--color-primary-700`: `#1E3A8A`
- `--color-primary-600`: `#1E40AF`
- `--color-primary-500`: `#2563EB`
- `--color-accent-600`: `#B45309`
- `--color-accent-500`: `#D97706`
- `--color-bg`: `#F8FAFC`
- `--color-surface`: `#FFFFFF`
- `--color-surface-soft`: `#F1F5F9`
- `--color-border`: `#CBD5E1`
- `--color-text`: `#0F172A`
- `--color-text-muted`: `#475569`

### Semantic

- `--color-success-bg`: `#DCFCE7`
- `--color-success-fg`: `#166534`
- `--color-warning-bg`: `#FEF3C7`
- `--color-warning-fg`: `#92400E`
- `--color-danger-bg`: `#FEE2E2`
- `--color-danger-fg`: `#B91C1C`
- `--color-info-bg`: `#DBEAFE`
- `--color-info-fg`: `#1E3A8A`

### Usage Rules

- Primary actions use navy.
- Secondary highlights and active navigation can use blue.
- Legal confidence and premium accents use trust gold sparingly.
- Alerts and lacunas use semantic warning/danger tokens, never raw hex in components.

## Typography

- Heading font: `EB Garamond`
- Body font: `Lato`
- UI fallback sans: `ui-sans-serif, system-ui, sans-serif`
- UI fallback serif: `ui-serif, Georgia, serif`

### Type Scale

- `display`: `clamp(2.25rem, 5vw, 3.5rem)` / `1.05`
- `h1`: `2.5rem` / `1.1`
- `h2`: `2rem` / `1.15`
- `h3`: `1.5rem` / `1.2`
- `title`: `1.125rem` / `1.35`
- `body`: `1rem` / `1.7`
- `small`: `0.875rem` / `1.6`
- `caption`: `0.75rem` / `1.4`

### Weight Rules

- Display and headings: `600` to `700`
- Labels and nav: `600`
- Body text: `400`
- Metadata and helper text: `400` or `500`

## Spacing

- Base rhythm: `8px`
- Tight: `4px`, `8px`, `12px`
- Default: `16px`, `24px`, `32px`
- Section spacing: `40px`, `56px`, `72px`
- Component radius:
- `pill`: `9999px`
- `control`: `14px`
- `card`: `24px`
- `panel`: `28px`

## Surfaces, Borders, Effects

- Main background: soft neutral with subtle radial wash from top-left
- Panel border: `1px solid #CBD5E1`
- Card background: `rgba(255,255,255,0.92)`
- Main shadow: `0 20px 60px -28px rgba(15, 23, 42, 0.22)`
- Hover shadow: `0 24px 70px -28px rgba(15, 23, 42, 0.28)`
- Focus ring: `0 0 0 4px rgba(37, 99, 235, 0.18)`

## Motion

- Hover and focus transitions: `200ms`
- Loader rotation: `1000ms linear infinite`
- Indeterminate progress shimmer: `1500ms linear infinite`
- Respect `prefers-reduced-motion: reduce` by disabling spin, shimmer, and transform-based hover lift

## Interaction Rules

- All clickable elements must include `cursor-pointer`
- All focusable controls must have visible keyboard focus
- Minimum touch target: `44px`
- Use disabled opacity reductions only with semantic disabled state
- Use `Lucide` icons only for controls, feedback, and branding marks

## Responsive Rules

- Validate at `375px`, `768px`, `1024px`, `1440px`
- Header remains usable without horizontal scroll
- Main content container: `max-w-4xl`
- Long text stays within readable measure
- Cards stack vertically on mobile

## Component Rules

### Layout

- Fixed header with brand left and nav right
- Active navigation uses primary navy background and white text
- Content container: `max-w-4xl mx-auto px-4 py-8`
- Footer copy stays muted and legible

### ConfiancaBadge

- Format: `dot + label`
- `Alta`: success semantic
- `Média`: warning semantic
- `Baixa`: danger semantic

### ParecerCard

- Use prose for parecer body
- Keep metadata block above content
- Show legal foundation and lacunas as clearly separated sections
- Email sent banner uses success styling

### StatusProcessando

- Spinner + subtext + indeterminate progress bar
- Should feel active but calm
- Reduced motion disables animation and preserves informative layout

### ErrorBoundary

- Neutral panel with explicit recovery CTA
- Reload button uses primary action styles

## Delivery Checklist

- [ ] No emojis as icons
- [ ] `cursor-pointer` on clickable elements
- [ ] Hover states with `150ms–300ms` transitions
- [ ] Text contrast at least `4.5:1`
- [ ] Visible keyboard focus states
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive behavior checked at `375px`, `768px`, `1024px`, `1440px`
