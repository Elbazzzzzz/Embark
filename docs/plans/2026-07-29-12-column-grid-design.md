# 12-Column Grid Layout System — Design

**Date:** 2026-07-29  
**Status:** Approved

## Goal

Replace ad-hoc layout CSS with an explicit 12-column grid used across every major section, fully responsive on mobile.

## Decision

**Approach A — Explicit span utilities:** `.grid` + `.col-*` / `.col-{sm|md|lg}-*` (and optional start offsets). Header remains flex for nav UX.

## Grid foundation

- `.container` — max width + horizontal gutters (unchanged role)
- `.grid` — `display: grid; grid-template-columns: repeat(12, minmax(0, 1fr));` with `--grid-gap`
- Children default to full width (`grid-column: 1 / -1`) with `min-width: 0`
- Remove unused `.grid-16`

## Breakpoints (mobile-first)

| Token | Min width |
|-------|-----------|
| (base) | 0 |
| `sm` | 480px |
| `md` | 768px |
| `lg` | 900px |

## Span API

- `.col-1` … `.col-12`
- `.col-sm-*`, `.col-md-*`, `.col-lg-*`
- `.col-start-*`, `.col-start-sm-*`, `.col-start-md-*`, `.col-start-lg-*`

## Section mappings

| Pattern | Mobile | Tablet+ |
|---------|--------|---------|
| Hero | 12 / 12 | 6 + 6 |
| Two-col | 12 / 12 | 6 + 6 |
| Steps ×3 | 12 | 4 + 4 + 4 |
| Cards ×2 | 12 | 6 + 6 |
| Cards ×3 | 12 → 6 (`sm`) → 4 (`lg`) |
| Credentials ×2 | 12 | 6 + 6 |
| Footer | 12 | 6 + 3 + 3 |
| Narrow prose / article | 12 | `col-md-8` + `col-start-md-3` |
| CTA / page headers | 12 | 12 |

## Out of scope

Visual redesign, content changes, nav breakpoint behaviour, Wix dump files.
