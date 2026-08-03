# Gallery Strip & Full-Width Image Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a manual horizontal gallery strip after How It Works and a full-bleed image band before the footer on the homepage, using the newly supplied photos.

**Architecture:** Static HTML sections with BEM-style classes in `css/style.css`. The strip uses native overflow + CSS scroll-snap; `js/main.js` only wires arrow buttons. Full-width image is a simple edge-to-edge `<img>` band. Assets live in `/images/`.

**Tech Stack:** HTML, CSS (scroll-snap), vanilla JS (IIFE in `main.js`), Netlify-served static site

**Design doc:** `docs/plans/2026-08-03-gallery-fullwidth-design.md`

---

### Task 1: Copy and name image assets

**Files:**
- Create: `images/gallery-strip-01.jpg` … `images/gallery-strip-13.jpg` (or `.png` if not converting)
- Create: `images/full-width-forest-path.jpg` (or `.png`)
- Source: Cursor assets under `~/.cursor/projects/.../assets/` (the 14 user-provided PNGs)

**Step 1: Map sources to destinations**

| Dest | Source subject (pick matching asset file) |
|------|-------------------------------------------|
| `full-width-forest-path` | Three dogs walking away on sunlit forest dirt path (best landscape) |
| `gallery-strip-01` … `13` | Remaining 13 photos |

**Step 2: Copy files into `images/`**

```bash
# From repo root — adjust SOURCE paths to the exact asset filenames
mkdir -p images
# Example pattern:
# cp "/path/to/asset-forest-path.png" "images/full-width-forest-path.png"
# cp remaining → images/gallery-strip-01.png … gallery-strip-13.png
```

Prefer converting to JPEG for size if tooling is available (`sips` on macOS); otherwise ship PNG and note follow-up compression.

**Step 3: Verify files exist**

```bash
ls images/gallery-strip-*.png images/gallery-strip-*.jpg images/full-width-forest-path.* 2>/dev/null
```

Expected: 13 strip images + 1 full-width image.

**Step 4: Commit**

```bash
git add images/gallery-strip-* images/full-width-forest-path.*
git commit -m "$(cat <<'EOF'
Add homepage gallery and full-width photo assets.

EOF
)"
```

---

### Task 2: Add gallery-strip and full-width-image CSS

**Files:**
- Modify: `css/style.css` (after existing `.gallery-grid` block ~988–1000)
- Modify: bump `?v=` on stylesheet links if the project already cache-busts (`index.html` currently `style.css?v=7` → `v=8`)

**Step 1: Append component styles**

Add after `.gallery-grid` / `.content-image`:

```css
/* Gallery strip — horizontal manual scroller */
.gallery-strip {
  position: relative;
}

.gallery-strip__intro {
  margin-bottom: var(--space-2);
}

.gallery-strip__track {
  display: flex;
  gap: var(--space-1);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding-block: var(--space-half);
  /* edge-to-edge feel while page still has body padding elsewhere */
  margin-inline: calc(-1 * var(--gutter));
  padding-inline: var(--gutter);
}

.gallery-strip__track:focus {
  outline: 2px solid var(--focus-ring);
  outline-offset: 4px;
}

.gallery-strip__item {
  flex: 0 0 auto;
  scroll-snap-align: start;
  width: min(72vw, 20rem);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.gallery-strip__item img {
  display: block;
  width: 100%;
  height: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.gallery-strip__controls {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-1);
  margin-top: var(--space-2);
}

.gallery-strip__btn {
  /* reuse button look; square-ish icon buttons */
  min-width: 2.75rem;
  padding-inline: var(--space-1);
}

/* Full-width image band */
.full-width-image {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  line-height: 0;
}

.full-width-image img {
  display: block;
  width: 100%;
  height: clamp(14rem, 42vw, 28rem);
  object-fit: cover;
  object-position: center;
}
```

Tune height / item width to match site spacing tokens if needed; do not invent new colour themes.

**Step 2: Bump CSS cache query on homepage (and optionally shared pages later)**

In `index.html` head: `style.css?v=7` → `style.css?v=8`.

**Step 3: Visual check**

Open homepage locally (or Netlify preview) and confirm classes don’t break existing layout when empty markup isn’t present yet — CSS alone is safe.

**Step 4: Commit**

```bash
git add css/style.css index.html
git commit -m "$(cat <<'EOF'
Add gallery-strip and full-width-image styles.

EOF
)"
```

---

### Task 3: Wire arrow controls in `main.js`

**Files:**
- Modify: `js/main.js`

**Step 1: Append gallery-strip controller inside the existing IIFE**

```javascript
  document.querySelectorAll('.gallery-strip').forEach(function (strip) {
    var track = strip.querySelector('.gallery-strip__track');
    var prev = strip.querySelector('.gallery-strip__btn--prev');
    var next = strip.querySelector('.gallery-strip__btn--next');
    if (!track) return;

    function scrollByPage(direction) {
      var amount = Math.max(track.clientWidth * 0.85, 200);
      track.scrollBy({ left: direction * amount, behavior: 'smooth' });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        scrollByPage(-1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        scrollByPage(1);
      });
    }
  });
```

**Step 2: Sanity-check**

Site must still work with JS disabled (track remains scrollable). With JS, buttons move the track.

**Step 3: Commit**

```bash
git add js/main.js
git commit -m "$(cat <<'EOF'
Add gallery-strip prev/next scroll controls.

EOF
)"
```

---

### Task 4: Insert gallery strip on homepage after How It Works

**Files:**
- Modify: `index.html` (after How It Works `</section>` ~line 152, before More Than Just a Walk)

**Step 1: Insert markup**

```html
 <section class="section section--white gallery-strip" aria-labelledby="gallery-strip-heading">
 <div class="container">
 <div class="gallery-strip__intro text-center">
 <h2 id="gallery-strip-heading">Life on an Embark walk</h2>
 <svg class="squiggle" viewBox="0 0 200 20" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
 <path d="M0 10 Q25 0 50 10 T100 10 T150 10 T200 10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
 </svg>
 <p class="page-header__lead">Muddy paws, woodland paths, and a happy pack — moments from our Tunbridge Wells group walks.</p>
 </div>
 <div class="gallery-strip__track" tabindex="0" role="region" aria-label="Photo gallery of Embark dog walks">
 <!-- Repeat for gallery-strip-01 … 13; use real alt text per photo -->
 <figure class="gallery-strip__item">
 <img src="/images/gallery-strip-01.jpg" alt="..." width="640" height="480" loading="lazy">
 </figure>
 <!-- … -->
 </div>
 <div class="gallery-strip__controls">
 <button type="button" class="btn btn--secondary gallery-strip__btn gallery-strip__btn--prev" aria-label="Scroll gallery left">‹</button>
 <button type="button" class="btn btn--secondary gallery-strip__btn gallery-strip__btn--next" aria-label="Scroll gallery right">›</button>
 </div>
 </div>
 </section>
```

Use correct file extensions from Task 1. Write accurate alts from each photo (man + dog, pack on trail, snowy walk, etc.).

**Step 2: Manual verify**

- Gallery appears after How It Works and before More Than Just a Walk
- Horizontal scroll works with trackpad/touch
- Arrows scroll when JS loads
- Mobile: images readable, controls reachable

**Step 3: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Add homepage gallery strip after How It Works.

EOF
)"
```

---

### Task 5: Insert full-width image before footer

**Files:**
- Modify: `index.html` (after CTA `</section>`, before `</main>` / immediately before footer)

**Step 1: Insert markup**

Place after the final CTA section, still inside `<main>` (preferred) or between `</main>` and `<footer>` — prefer inside `<main>` for landmark semantics:

```html
 <figure class="full-width-image">
 <img
 src="/images/full-width-forest-path.jpg"
 alt="Three dogs walking ahead down a sun-dappled woodland path near Tunbridge Wells"
 width="1600"
 height="900"
 loading="lazy"
 >
 </figure>
```

**Step 2: Manual verify**

- Image is edge-to-edge before footer
- No overlay text
- CTA still sits above it; footer below

**Step 3: Commit**

```bash
git add index.html
git commit -m "$(cat <<'EOF'
Add full-width walk photo before homepage footer.

EOF
)"
```

---

### Task 6: Final pass

**Step 1:** Resize browser — strip scroll + full-width crop look correct on mobile and desktop  
**Step 2:** Confirm `?v=8` stylesheet loads  
**Step 3:** Confirm no broken image paths  
**Step 4:** Optional commit for alt/copy tweaks only if needed

---

## Out of scope

Lightbox, autoplay, replacing Where we walk `.gallery-grid`, editing Wix dump files.
