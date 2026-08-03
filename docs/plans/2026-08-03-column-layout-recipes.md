# Column Layout Recipes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enforce shared 12-column layout recipes across all Embark pages so content edges and reading measures align, keeping CTA/promo as the only intentional max-width exceptions.

**Architecture:** Reuse existing `.container` / `.grid` / `.col-*`. Standardize HTML on documented recipes (Full, Prose, Split, Cards, Pair, Steps). Remove competing `max-width` on `.hero__lead` and `.page-header__lead`. Do not add new layout utility classes.

**Tech Stack:** Static HTML, `css/style.css` (no build step)

**Design:** `docs/plans/2026-08-03-column-layout-recipes-design.md`

---

### Task 1: CSS — remove competing text max-widths

**Files:**
- Modify: `css/style.css` (`.hero__lead`, `.page-header__lead`)

**Step 1: Edit `.hero__lead`**

Remove `max-width: 38rem;` from `.hero__lead`. Keep `font-size: 1.125rem;`.

```css
.hero__lead {
  font-size: 1.125rem;
}
```

**Step 2: Edit `.page-header__lead`**

Remove `max-width: 40rem;` and `margin-inline: auto;` from `.page-header__lead`. Keep font-size. (Page headers stay `text-align: center` via `.page-header`, so leads remain centered without a narrower box.)

```css
.page-header__lead {
  font-size: 1.125rem;
}
```

**Step 3: Verify exceptions remain**

Confirm these are unchanged:
- `.promo__inner` still has `max-width: 44rem`
- `.cta-band p` still has `max-width: 36rem`

**Step 4: Commit**

```bash
git add css/style.css
git commit -m "$(cat <<'EOF'
Align hero and page-header text to the column grid.

Remove one-off max-widths so reading measure comes from shared column recipes; keep CTA and promo exceptions.
EOF
)"
```

---

### Task 2: FAQ — switch to Prose recipe

**Files:**
- Modify: `faq.html`

**Step 1: Change FAQ column span**

Find the FAQ list wrapper (currently `col-12 col-md-10 col-start-md-2`) and change to Prose:

```html
<div class="col-12 col-md-8 col-start-md-3">
```

**Step 2: Normalize container/grid nesting**

If the section uses `<div class="container grid">`, split to:

```html
<div class="container">
 <div class="grid">
  <div class="col-12 col-md-8 col-start-md-3">
```

(and close with matching `</div></div></div>`).

**Step 3: Commit**

```bash
git add faq.html
git commit -m "$(cat <<'EOF'
Use the shared prose column recipe on the FAQ page.
EOF
)"
```

---

### Task 3: Normalize `container grid` → nested structure (prose pages)

**Files:**
- Modify: `about.html`
- Modify: `contact.html`
- Modify: `dog-walking.html`
- Modify: `where-we-walk.html`
- Modify: `terms-privacy.html`
- Modify: `areas/index.html`
- Modify: `areas/southborough.html`
- Modify: `areas/rusthall.html`
- Modify: `areas/langton-green.html`
- Modify: `areas/hawkenbury.html`
- Modify: `areas/pembury.html`
- Modify: `areas/high-brooms.html`
- Modify: `blog/best-dog-walks-tunbridge-wells.html`
- Modify: `blog/preparing-your-dog-for-group-walks.html`

**Step 1: Replace combined class**

Everywhere these pages use:

```html
<div class="container grid">
```

or

```html
<div class="container grid"><div class="col-12 col-md-8 col-start-md-3 …
```

change to nested:

```html
<div class="container">
 <div class="grid">
  <div class="col-12 col-md-8 col-start-md-3 …">
```

Preserve existing column recipes (Prose / Split / Full). Do not change copy.

**Step 2: Fix matching closing tags**

Ensure each opened `.container` and `.grid` has a correct close. Prefer one section at a time.

**Step 3: Spot-check recipes on these pages**

| Page | Expected recipes |
|------|------------------|
| about | Split (intro), credentials Pair, Prose (story) |
| contact | Split |
| dog-walking | Split + Prose sections |
| where-we-walk | Prose + gallery Cards/half cols |
| terms-privacy | Prose |
| areas/* | Prose (+ Cards on index) |
| blog posts | Prose (`article-content`) |

**Step 4: Commit**

```bash
git add about.html contact.html dog-walking.html where-we-walk.html terms-privacy.html areas/ blog/
git commit -m "$(cat <<'EOF'
Normalize section markup to nested container and grid.
EOF
)"
```

---

### Task 4: Homepage — nested grids where combined

**Files:**
- Modify: `index.html`

**Step 1: Find combined `container grid`**

The “More Than Just a Walk / Pricing” section uses `<div class="container grid">`. Split to nested container + grid. Keep Split recipe (`col-12 col-md-6` × 2).

**Step 2: Leave intentional exceptions**

Do not change:
- `.promo` / `.promo__inner` structure
- `.cta-band` structure
- Gallery strip track breakout

**Step 3: Ensure section titles / leads are full-width**

Section headings and any `page-header__lead` used under Areas stay inside `.container` (full measure). No extra wrapping max-width classes.

**Step 4: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Align homepage sections with nested container grid markup.
EOF
)"
```

---

### Task 5: Page headers — Full recipe (optional grid wrap)

**Files:**
- Modify any page whose `.page-header` content should explicitly sit on the grid

**Step 1: Apply Full recipe consistently**

For each `.page-header`, prefer:

```html
<header class="page-header">
 <div class="container">
  <div class="grid">
   <div class="col-12">
    <h1>…</h1>
    <p class="page-header__lead">…</p>
   </div>
  </div>
 </div>
</header>
```

If a page already has only `.container` > heading + lead and CSS max-width is gone (Task 1), that is acceptable Full behaviour — only add the grid wrap when editing that page anyway, or do a bulk pass for consistency.

**Pages with page headers:** about, contact, dog-walking, where-we-walk, faq, reviews, blog/index, blog posts, areas/index, all area detail pages, terms-privacy.

**Step 2: Commit**

```bash
git add about.html contact.html dog-walking.html where-we-walk.html faq.html reviews.html blog/ areas/ terms-privacy.html
git commit -m "$(cat <<'EOF'
Put page headers on the full-width column recipe.
EOF
)"
```

---

### Task 6: Visual verification

**Files:** none (browser / local server)

**Step 1: Serve the site**

```bash
# from repo root — use whatever local static server is available
python3 -m http.server 8080
```

**Step 2: Desktop (~1200px) checklist**

Open and confirm left/right edges align between stacked sections:
- `/` (hero Split, steps, reviews Pair, areas Cards, CTA exception)
- `/faq.html` (Prose 8-col, not 10)
- `/areas/southborough.html` (Prose)
- `/blog/best-dog-walks-tunbridge-wells.html` (Prose)
- `/contact.html` (Split)

Confirm CTA and promo copy remain narrower/centered.

**Step 3: Mobile (~375px) checklist**

Same URLs — all recipe columns stack to full width; header/footer/mobile bar intact; no horizontal overflow (gallery strip scroll OK).

**Step 4: Final commit only if verification prompted fixes**

If fixes were needed, commit them with a clear message; otherwise done.

---

## Out of scope reminder

- Do not edit `dog image 1.html` or `dog image 1_files/`
- Do not change colours, fonts, or copy
- Do not add `.layout-prose` / similar utilities
- Do not remove `.promo__inner` or `.cta-band p` max-widths
