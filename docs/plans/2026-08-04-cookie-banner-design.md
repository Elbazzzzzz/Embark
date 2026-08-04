# Cookie Banner & Cookie Policy — Design

**Date:** 2026-08-04  
**Status:** Approved

## Goal

Add a site-wide boilerplate cookie consent banner for future basic analytics, plus a dedicated cookie policy page.

## Decisions (confirmed)

| Topic | Choice |
|-------|--------|
| Analytics | Placeholder only — store consent now; no tracking script yet |
| Banner actions | Accept / Reject |
| Implementation | Banner injected via `main.js`; dedicated `cookie-policy.html` |
| Consent storage | `localStorage` key `embark_cookie_consent` (`accepted` / `rejected`) |

## Architecture

- New page: `/cookie-policy.html` (same header/footer/prose layout as Terms & Privacy)
- Banner: created and shown by `js/main.js` on every page that loads it
- Styles: `css/style.css` using existing brand tokens
- Footer link on all pages: Cookie Policy next to Terms & Privacy
- Privacy §8 on `terms-privacy.html` updated to describe the banner and link to the cookie policy
- Sitemap entry for the new page
- After Accept/Reject, banner hides and does not reappear until storage is cleared
- Analytics hook: comment / helper that later scripts can check before loading GA

## Banner UI

- Fixed bottom bar, sitting above the mobile call/book bar on small screens
- Short copy + link to Cookie Policy
- Accept = primary button; Reject = secondary
- `role="dialog"`, labelled, keyboard-focusable
- Cream / terracotta / charcoal tokens — match existing site chrome

## Cookie policy content

Boilerplate UK-style sections covering: what cookies are, essential vs analytics, current use (essential only; analytics planned but not active), managing preferences, third parties (none yet), updates, and a “not legal advice” disclaimer matching Terms & Privacy tone.
