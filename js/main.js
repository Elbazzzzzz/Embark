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

})();
