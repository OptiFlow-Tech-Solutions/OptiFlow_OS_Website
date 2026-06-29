/* ═══════════════════════════════════════════
   OptiFlow OS — Shared JavaScript
   Single source of truth for all marketing pages
   ═══════════════════════════════════════════ */

(function() {
  /* ─── Theme Toggle ─── */
  const html = document.documentElement;
  const stored = localStorage.getItem('optiflow-theme');
  if (stored === 'dark') {
    html.dataset.theme = 'dark';
  } else if (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.dataset.theme = 'dark';
  }

  function swapTheme() {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('optiflow-theme', next);
  }

  document.querySelectorAll('.theme-toggle').forEach(function(btn) {
    btn.addEventListener('click', swapTheme);
  });

  /* ─── Nav Scroll ─── */
  const nav = document.querySelector('.topnav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ─── Mobile Drawer ─── */
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    hamburger.classList.add('open');
    drawer.classList.add('open');
    overlay.classList.add('active');
  }

  function closeDrawer() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    overlay.classList.remove('active');
  }

  if (hamburger && drawer && overlay) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    overlay.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', closeDrawer);
    });
  }

  /* ─── Scroll Reveal ─── */
  const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
  });

  /* ─── Unified Motion (replaces per-page stagger duplicates) ─── */
  document.querySelectorAll('[class*="stagger-"]').forEach(function(parent) {
    var match = parent.className.match(/stagger-(\d+)/);
    if (!match) return;
    var count = parseInt(match[1]);
    var baseDelay = 80;
    var children = parent.querySelectorAll(':scope > .reveal, :scope > *');
    children.forEach(function(child, i) {
      if (i >= count * 2) return;
      child.style.transitionDelay = (i * baseDelay) + 'ms';
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, [class*="stagger-"] > *').forEach(function(el) {
      el.style.transition = 'none';
      el.style.transitionDelay = '0ms';
      el.classList.add('visible');
    });
  }

  /* ─── Counter Animation ─── */
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function countUp(el) {
    const t = parseInt(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const fmt = el.dataset.fmt || 'number';
    const duration = parseInt(el.dataset.duration) || 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const val = Math.floor(eased * t);

      if (fmt === 'currency') {
        el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
      } else {
        el.textContent = prefix + val.toLocaleString('en-IN') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + t.toLocaleString('en-IN') + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        countUp(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(function(el) {
    counterObserver.observe(el);
  });

  /* ─── FAQ Accordion ─── */
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function() {
      const item = btn.parentElement;
      const open = item.classList.contains('open');
      item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ─── Sticky CTA Visibility ─── */
  const stickyCta = document.querySelector('.sticky-cta');
  if (stickyCta) {
    const hero = document.querySelector('.hero');
    const heroH = hero ? hero.offsetHeight * 0.7 : 500;
    window.addEventListener('scroll', function() {
      stickyCta.classList.toggle('visible', window.scrollY > heroH);
    }, { passive: true });
  }

  /* ─── Scroll-to-Top Visibility ─── */
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    window.addEventListener('scroll', function() {
      scrollTop.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
  }
})();
