# Column Layout Recipes — Design

**Date:** 2026-08-03  
**Status:** Approved  
**Builds on:** `2026-07-29-12-column-grid-design.md`

## Goal

Make every section share the same column rhythm so content edges, gutters, and reading measures line up sitewide — without redesigning visuals or inventing new layout APIs.

## Decision

**Approach 1 — Documented layout recipes:** Keep `.container` / `.grid` / `.col-*`. Enforce a small set of column patterns in HTML. Remove one-off text `max-width`s that fight the grid, except intentional CTA and promo exceptions.

## Recipes

| Recipe | Columns | Used for |
|--------|---------|----------|
| **Full** | `col-12` | Page headers, section titles, trust bar, footer shell |
| **Prose** | `col-12 col-md-8 col-start-md-3` | Articles, area copy, dog-walking body, about story, FAQ, terms |
| **Split** | `col-12 col-md-6` × 2 | Hero, about intro, contact, service intro |
| **Cards** | `col-12 col-sm-6 col-lg-4` | Area cards and similar card grids |
| **Pair** | `col-12 col-md-6` | Reviews / testimonials, blog cards |
| **Steps** | `col-12 col-md-4` | How-it-works (3 equal columns) |

Footer remains `6 + 3 + 3` at `md` (existing pattern).

## Markup rules

- Content sections use: `section` → `.container` → `.grid` → recipe columns.
- Prefer nested `<div class="container"><div class="grid">` over combined `container grid`.
- Section titles are full width (`col-12` or direct container children with no extra max-width).

## CSS changes

**Remove `max-width` from:**
- `.hero__lead`
- `.page-header__lead`

**Keep as exceptions:**
- `.promo__inner` (`max-width: 44rem`)
- `.cta-band p` (`max-width: 36rem`)

No new layout utility classes.

## Notable content remaps

- FAQ: `col-md-10 col-start-md-2` → **Prose** (`col-md-8 col-start-md-3`)
- Gallery strip: keep horizontal scroll breakout; intro text stays container-aligned like other titles

## Out of scope

Visual redesign, copy changes, nav behaviour, Wix dump files (`dog image 1*`), new CSS layout wrappers.

## Done when

- Desktop content edges align across stacked sections
- Prose pages share the same 8-col centered measure
- Mobile still stacks to full width
- CTA / promo keep centered narrower copy
- Spot-check: home, FAQ, one area page, one blog post, contact at ~375px and ~1200px
