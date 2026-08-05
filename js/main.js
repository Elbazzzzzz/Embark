/**
 * Embark Dog Walking - minimal enhancements only.
 * Site works fully with JavaScript disabled.
 */

(function () {
  'use strict';

  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('is-open', !expanded);
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
        var dropdown = link.closest('.nav-dropdown__details');
        if (dropdown) dropdown.removeAttribute('open');
      });
    });
  }

  document.querySelectorAll('.nav-dropdown__details').forEach(function (details) {
    details.addEventListener('toggle', function () {
      if (!details.open) return;
      document.querySelectorAll('.nav-dropdown__details[open]').forEach(function (other) {
        if (other !== details) other.removeAttribute('open');
      });
    });
  });

  document.addEventListener('click', function (event) {
    document.querySelectorAll('.nav-dropdown__details[open]').forEach(function (details) {
      if (!details.contains(event.target)) {
        details.removeAttribute('open');
      }
    });
  });

  document.querySelectorAll('.reviews-component[data-reviews-visible]').forEach(function (component) {
    var visibleCount = parseInt(component.getAttribute('data-reviews-visible'), 10) || 4;
    var items = component.querySelectorAll('.reviews-component__grid .testimonial');
    var toggle = component.querySelector('.reviews-component__toggle');

    if (items.length <= visibleCount) {
      if (toggle) toggle.hidden = true;
      return;
    }

    items.forEach(function (item, index) {
      if (index >= visibleCount) item.hidden = true;
    });

    if (!toggle) return;

    toggle.hidden = false;
    toggle.addEventListener('click', function () {
      items.forEach(function (item) {
        item.hidden = false;
      });
      component.classList.add('is-expanded');
      toggle.setAttribute('aria-expanded', 'true');
    });
  });

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

  function hasAnalyticsConsent() {
    return getCookieConsent() === 'accepted';
  }

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

})();
