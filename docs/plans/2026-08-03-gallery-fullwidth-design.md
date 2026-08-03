# Homepage Gallery Strip & Full-Width Image — Design

**Date:** 2026-08-03  
**Status:** Approved

## Goal

Add a reusable horizontal photo strip and a full-bleed image band on the homepage, using the newly supplied walk photos.

## Decisions (confirmed)

| Topic | Choice |
|-------|--------|
| Gallery layout | Horizontal scrolling strip (not static grid) |
| Strip motion | Manual only — swipe / trackpad + prev/next arrows; no autoplay |
| Gallery placement | After **How It Works**, before **More Than Just a Walk** |
| Full-width placement | After the CTA band, immediately before the footer |
| Full-width photo | Strong landscape chosen from the new set (forest path with three dogs ahead) |

## Gallery strip component

- Section heading: “Life on an Embark walk”
- One short supporting sentence about group woodland walks
- Edge-to-edge horizontal scroller (break out of `.container` for the track; heading stays in container)
- Photos: all uploaded images except the one used for the full-width band
- Scroll-snap for clean stops; left/right buttons scroll roughly one viewport of the track
- Progressive enhancement: strip scrolls without JS; arrows wired in `js/main.js`
- Lazy-loaded images with descriptive alt text
- Reusable markup/CSS class names (e.g. `.gallery-strip`) so other pages can opt in later

## Full-width image component

- Class name e.g. `.full-width-image`
- Edge-to-edge, no side padding; fixed visual height band with `object-fit: cover`
- Decorative only — no overlay text, badges, or cards
- Meaningful `alt` text for accessibility

## Assets

- Copy new photos into `/images/` with clear names (`gallery-strip-01.jpg` … and `full-width-forest-path.jpg` or similar)
- Prefer compressed JPEG/WebP-friendly sources; keep source PNGs out of production paths if converted

## Out of scope

Lightbox, autoplay marquee, replacing the Where we walk static `.gallery-grid`, Wix dump files (`dog image 1*`).
