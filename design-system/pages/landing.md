# Landing Override

> Page-specific rules for the public landing page. These rules override MASTER.md only for `/`.

## Intent
- Public B2C acquisition page with high trust and clear legal credibility.
- Keep the legal tone from MASTER.md, but increase conversion energy through stronger section contrast and more assertive CTA rhythm.

## Layout
- Wide landing container: `max-w-7xl`.
- Section spacing: 72px desktop, 56px tablet, 40px mobile.
- Sticky header starts transparent and becomes solid white with blur after scroll.

## Hero
- Use the master navy as primary CTA.
- Use trust-gold sparingly for highlights and proof points.
- Keep headline within 10-12 words per line on desktop.

## Cards
- Feature cards use white surface, subtle border, soft shadow, and 24px radius.
- Hover can slightly elevate shadow; avoid playful transforms.

## FAQ
- Accordion uses strong border separation and explicit chevron rotation.
- Only one item needs to be open at a time.

## Motion
- Use IntersectionObserver reveal on sections with 200ms-300ms fade/translate.
- Respect `prefers-reduced-motion` by rendering sections immediately.
