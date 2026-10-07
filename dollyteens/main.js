/* DollyTeens Kiddies College - interactions (vanilla, mobile-safe) */
(function () {
  'use strict';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile menu */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () { menu.classList.add('open'); });
    var close = document.getElementById('menuClose');
    if (close) close.addEventListener('click', function () { menu.classList.remove('open'); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('open'); });
    });
  }

  /* scroll reveals */
  var els = document.querySelectorAll('.reveal');
  if (REDUCED || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var d = en.target.getAttribute('data-delay');
          if (d) en.target.style.transitionDelay = d + 'ms';
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* faq accordion */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* gallery lightbox */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lb-cap');
    document.querySelectorAll('.gal-item').forEach(function (g) {
      g.addEventListener('click', function () {
        var im = g.querySelector('img');
        if (!im) return;
        lbImg.src = im.src;
        lbImg.alt = im.alt;
        lbCap.textContent = im.alt || '';
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    var closeLb = function () { lb.classList.remove('open'); document.body.style.overflow = ''; };
    lb.querySelector('.lb-x').addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

  /* back to top */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  }

  /* forms: demo validation + success note */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
        f.style.borderColor = bad ? '#EF5D7E' : '';
        if (bad) ok = false;
      });
      if (!ok) return;
      var note = form.parentElement.querySelector('.form-ok');
      if (note) { note.style.display = 'block'; note.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      form.reset();
    });
  });

  /* footer year */
  document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
