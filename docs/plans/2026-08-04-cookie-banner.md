# Cookie Banner & Cookie Policy Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a site-wide Accept/Reject cookie banner (consent stored for future analytics) and a boilerplate cookie policy page.

**Architecture:** Inject the banner from `js/main.js` so markup is not duplicated across pages. Add `cookie-policy.html` mirroring `terms-privacy.html`. Style the banner in `css/style.css`. Persist choice in `localStorage` under `embark_cookie_consent`. Update footers, privacy §8, sitemap, and SRI hashes for CSS/JS.

**Tech Stack:** Static HTML, vanilla JS (IIFE in `main.js`), existing CSS design tokens. No analytics library yet.

**Design doc:** `docs/plans/2026-08-04-cookie-banner-design.md`

---

### Task 1: Cookie policy page

**Files:**
- Create: `cookie-policy.html`
- Modify: `sitemap.xml` (add URL entry)

**Step 1: Create `cookie-policy.html`**

Copy structure from `terms-privacy.html` (shared header, page-header, prose section, footer, mobile-bar, `main.js` script). Replace title/meta/canonical/og tags and main content with:

- Title: `Cookie Policy | Embark Dog Walking`
- Canonical: `https://www.embarkdogwalking.co.uk/cookie-policy.html`
- H1: `Cookie Policy`
- Lead: `How this website uses cookies. Last updated: 4 August 2026.`

Prose body (boilerplate):

```html
<p>This cookie policy explains how Embark Dog Walking (“I”, “me”, “my”) uses cookies and similar technologies on <a href="https://www.embarkdogwalking.co.uk">www.embarkdogwalking.co.uk</a>. For wider privacy practices, see my <a href="/terms-privacy.html#privacy">Privacy Policy</a>. Questions: <a href="mailto:info@embarkdogwalking.co.uk">info@embarkdogwalking.co.uk</a> or <a href="tel:07583399561">07583 399561</a>.</p>

<h2>1. What are cookies?</h2>
<p>Cookies are small text files stored on your device when you visit a website. They are widely used to make sites work, remember preferences, or understand how visitors use a site. Similar technologies (for example local storage) may be used for the same kinds of purposes.</p>

<h2>2. How I use cookies</h2>
<p>I use cookies and similar technologies in these categories:</p>
<ul>
 <li><strong>Essential</strong> — needed for the site to function (for example remembering your cookie consent choice). These do not require consent.</li>
 <li><strong>Analytics</strong> — help me understand how visitors use the site (for example pages viewed). These are only used if you Accept analytics cookies via the cookie banner.</li>
</ul>

<h2>3. What I use today</h2>
<p>Today I use:</p>
<ul>
 <li>Essential local storage to remember whether you have accepted or rejected analytics cookies (`embark_cookie_consent`).</li>
</ul>
<p>I do not currently load third-party analytics scripts. If I introduce analytics (for example Google Analytics), they will only run after you have Accepted analytics cookies. I will update this page when that happens.</p>

<h2>4. Managing your preferences</h2>
<p>When you first visit, a banner lets you Accept or Reject analytics cookies. Your choice is stored in your browser. To change it later, clear this site’s data in your browser settings (or contact me and I can advise). After clearing, the banner will appear again on your next visit.</p>

<h2>5. Third parties</h2>
<p>No third-party analytics cookies are set at present. If that changes, this policy will list the provider and link to their information where available.</p>

<h2>6. Updates</h2>
<p>I may update this cookie policy from time to time. The “Last updated” date at the top of this page will change when I do.</p>

<p><em>This page is a general boilerplate for a small UK service business and is not legal advice. You may wish to have it reviewed for your specific circumstances.</em></p>
```

Keep footer Cookie Policy link pointing to `/cookie-policy.html` (see Task 4 for footer pattern). Use the same `style.css` and `main.js` references as other pages (update integrity hashes in Task 5 after CSS/JS change).

**Step 2: Add sitemap entry**

In `sitemap.xml`, after the `terms-privacy.html` entry, add:

```xml
  <url>
    <loc>https://www.embarkdogwalking.co.uk/cookie-policy.html</loc>
    <lastmod>2026-08-04</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
```

**Step 3: Commit**

```bash
git add cookie-policy.html sitemap.xml
git commit -m "$(cat <<'EOF'
Add boilerplate cookie policy page and sitemap entry.

EOF
)"
```

---

### Task 2: Banner styles

**Files:**
- Modify: `css/style.css` (append cookie banner styles near the end, before or after mobile-bar utilities)

**Step 1: Add CSS**

```css
/* Cookie consent banner */
.cookie-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  padding: var(--space-1) var(--gutter);
  padding-bottom: calc(var(--space-1) + 4.5rem); /* clear mobile-bar on small screens */
  background: var(--charcoal);
  color: var(--cream);
  box-shadow: 0 -4px 20px rgba(30, 29, 27, 0.15);
}

.cookie-banner__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-1);
}

.cookie-banner__text {
  flex: 1 1 16rem;
  margin: 0;
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--cream);
}

.cookie-banner__text a {
  color: var(--cream);
  text-decoration: underline;
}

.cookie-banner__text a:hover,
.cookie-banner__text a:focus-visible {
  color: var(--white);
}

.cookie-banner__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-half);
  flex-shrink: 0;
}

.cookie-banner__actions .btn {
  min-height: 2.75rem;
}

.cookie-banner .btn--secondary {
  background: transparent;
  color: var(--cream);
  border: 1px solid rgba(255, 241, 222, 0.45);
}

.cookie-banner .btn--secondary:hover,
.cookie-banner .btn--secondary:focus-visible {
  background: rgba(255, 241, 222, 0.1);
  color: var(--white);
  border-color: var(--cream);
}

@media (min-width: 900px) {
  .cookie-banner {
    padding-bottom: var(--space-1);
  }
}
```

If `.btn--secondary` styles conflict, keep the `.cookie-banner .btn--secondary` overrides above so Reject stays readable on charcoal.

**Step 2: Commit**

```bash
git add css/style.css
git commit -m "$(cat <<'EOF'
Style the fixed cookie consent banner.

EOF
)"
```

---

### Task 3: Banner logic in `main.js`

**Files:**
- Modify: `js/main.js`

**Step 1: Append consent module inside the existing IIFE** (before the closing `})();`)

```javascript
  // Cookie consent — stores preference for future analytics (none loaded yet)
  var COOKIE_CONSENT_KEY = 'embark_cookie_consent';

  function getCookieConsent() {
    try {
      return localStorage.getItem(COOKIE_CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function setCookieConsent(value) {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch (e) {
      /* ignore quota / private mode failures */
    }
  }

  /** Call before loading analytics: returns true only if user accepted. */
  function hasAnalyticsConsent() {
    return getCookieConsent() === 'accepted';
  }

  // Placeholder for future analytics — e.g. load GA only when hasAnalyticsConsent()
  function initAnalyticsIfAllowed() {
    if (!hasAnalyticsConsent()) return;
    // TODO: load analytics script here when Measurement ID is available
  }

  function hideCookieBanner(banner) {
    if (banner && banner.parentNode) {
      banner.parentNode.removeChild(banner);
    }
  }

  function showCookieBanner() {
    if (getCookieConsent()) {
      initAnalyticsIfAllowed();
      return;
    }

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
      '<p class="cookie-banner__text">I use essential cookies for this site to work. With your consent, I may also use analytics cookies to understand how the site is used. ' +
      '<a href="/cookie-policy.html">Cookie Policy</a>.</p>' +
      '<div class="cookie-banner__actions">' +
      '<button type="button" class="btn btn--primary" data-cookie-consent="accepted">Accept</button>' +
      '<button type="button" class="btn btn--secondary" data-cookie-consent="rejected">Reject</button>' +
      '</div></div>';

    document.body.appendChild(banner);

    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-cookie-consent]');
      if (!button) return;
      var choice = button.getAttribute('data-cookie-consent');
      setCookieConsent(choice);
      hideCookieBanner(banner);
      if (choice === 'accepted') initAnalyticsIfAllowed();
    });
  }

  showCookieBanner();
```

**Step 2: Manual check**

Open any page in a browser (or `npx serve` / Netlify draft). Confirm:

- Banner appears when `localStorage` has no `embark_cookie_consent`
- Accept stores `accepted` and removes banner
- Reject stores `rejected` and removes banner
- Reload after choice: banner stays hidden
- Clear `localStorage` key → banner returns

**Step 3: Commit**

```bash
git add js/main.js
git commit -m "$(cat <<'EOF'
Inject Accept/Reject cookie banner from main.js.

EOF
)"
```

---

### Task 4: Footer links + privacy §8

**Files:**
- Modify: every HTML page’s footer-bottom line (19 pages listed below)
- Modify: `terms-privacy.html` privacy section 8
- Modify: `cookie-policy.html` footer (if not already done in Task 1)

**Pages with footer to update** (replace Terms-only line):

`index.html`, `about.html`, `contact.html`, `dog-walking.html`, `faq.html`, `reviews.html`, `terms-privacy.html`, `where-we-walk.html`, `404.html`, `areas/index.html`, `areas/southborough.html`, `areas/rusthall.html`, `areas/langton-green.html`, `areas/hawkenbury.html`, `areas/pembury.html`, `areas/high-brooms.html`, `blog/index.html`, `blog/best-dog-walks-tunbridge-wells.html`, `blog/preparing-your-dog-for-group-walks.html`, plus `cookie-policy.html`.

**Step 1: Update footer-bottom on all pages**

Find:

```html
<p>&copy; 2026 Embark Dog Walking. All rights reserved. · <a href="/terms-privacy.html">Terms &amp; Privacy</a></p>
```

Replace with:

```html
<p>&copy; 2026 Embark Dog Walking. All rights reserved. · <a href="/terms-privacy.html">Terms &amp; Privacy</a> · <a href="/cookie-policy.html">Cookie Policy</a></p>
```

**Step 2: Update privacy §8 in `terms-privacy.html`**

Replace the cookies paragraph with:

```html
 <h3>8. Cookies and similar technologies</h3>
 <p>My site uses essential cookies or similar technologies required for the site to work, including remembering your cookie preferences. Analytics cookies are only used if you Accept them via the cookie banner. For details, see my <a href="/cookie-policy.html">Cookie Policy</a>.</p>
```

**Step 3: Commit**

```bash
git add *.html areas/*.html blog/*.html
git commit -m "$(cat <<'EOF'
Link Cookie Policy from footers and privacy section.

EOF
)"
```

---

### Task 5: Refresh SRI hashes for CSS and JS

**Files:**
- Modify: all HTML pages that reference `/css/style.css` and `/js/main.js` (same set as Task 4, including `cookie-policy.html`)

**Step 1: Compute new hashes**

```bash
openssl dgst -sha384 -binary css/style.css | openssl base64 -A
openssl dgst -sha384 -binary js/main.js | openssl base64 -A
```

**Step 2: Update every stylesheet and script tag**

```html
<link rel="stylesheet" href="/css/style.css?v=11" integrity="sha384-<NEW_CSS_HASH>" crossorigin="anonymous">
```

```html
<script src="/js/main.js" integrity="sha384-<NEW_JS_HASH>" crossorigin="anonymous" defer></script>
```

Bump `?v=` on CSS (currently `v=10` → `v=11`) so caches refresh. For nested pages (`areas/`, `blog/`), paths stay absolute (`/css/...`, `/js/...`).

**Step 3: Spot-check**

Open homepage and cookie policy; confirm banner styles load (no SRI console errors) and Accept/Reject still work.

**Step 4: Commit**

```bash
git add *.html areas/*.html blog/*.html
git commit -m "$(cat <<'EOF'
Update CSS/JS SRI hashes after cookie banner changes.

EOF
)"
```

---

### Task 6: Final verification

**Step 1: Checklist**

- [ ] `/cookie-policy.html` renders with shared header/footer
- [ ] Banner on homepage, an area page, and a blog page
- [ ] Accept / Reject persist across reload
- [ ] Footer Cookie Policy link works from nested paths
- [ ] Privacy §8 links to cookie policy
- [ ] Sitemap includes cookie policy
- [ ] No SRI integrity errors in browser console
- [ ] Banner sits above mobile bar on a narrow viewport

**Step 2: Done** — no further commit unless verification finds fixes.
