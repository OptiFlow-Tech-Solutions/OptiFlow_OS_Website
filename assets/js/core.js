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

  /* ─── Keyboard: Escape closes drawer ─── */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* ─── Visibility change: pause animations ─── */
  document.addEventListener('visibilitychange', function() {
    document.documentElement.classList.toggle('page-hidden', document.hidden);
  });

  /* ─── UTM Capture ─── */
  function getUTMParams() {
    var params = new URLSearchParams(window.location.search);
    var utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function(key) {
      if (params.has(key)) utm[key] = params.get(key);
    });
    return utm;
  }

  /* ─── Form Data Collector ─── */
  function collectFormData(form) {
    var data = {};
    form.querySelectorAll('input, select, textarea').forEach(function(el) {
      if (!el.name) return;
      if ((el.type === 'radio' || el.type === 'checkbox') && !el.checked) return;
      data[el.name] = el.value;
    });
    var utm = getUTMParams();
    Object.keys(utm).forEach(function(k) { data[k] = utm[k]; });
    return data;
  }

  /* ─── Honey-Pot Injection ─── */
  function ensureHoneyPot(form) {
    if (form.querySelector('input[name="_hp"]')) return;
    var hp = document.createElement('input');
    hp.type = 'text';
    hp.name = '_hp';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    hp.setAttribute('aria-hidden', 'true');
    form.appendChild(hp);
  }

  /* ─── Shared Form Submission ─── */
  function submitForm(form) {
    if (!form) return;
    form.classList.remove('form-error');
    form.classList.add('form-submitting');

    ensureHoneyPot(form);

    var isNetlify = form.hasAttribute('data-netlify');
    var endpoint = form.getAttribute('data-endpoint');

    if (!isNetlify && !endpoint) endpoint = '/api/form-submit';

    var data = collectFormData(form);
    var honeyPotVal = data._hp || '';
    delete data._hp;

    if (form.dataset.selectedDate) data.selected_date = form.dataset.selectedDate;
    if (form.dataset.selectedSlot) data.selected_slot = form.dataset.selectedSlot;

    var options = { method: 'POST' };

    if (isNetlify) {
      var body = new URLSearchParams();
      Object.keys(data).forEach(function(k) { body.append(k, data[k]); });
      body.append('_hp', honeyPotVal);
      body.append('form-name', form.getAttribute('name') || '');
      options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
      options.body = body.toString();
    } else {
      var utm = getUTMParams();
      var payload = {
        formName: form.getAttribute('name') || '',
        fields: data,
        honeyPot: honeyPotVal,
        utm: Object.keys(utm).length > 0 ? utm : {}
      };
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(payload);
    }

    fetch(endpoint, options)
      .then(function(res) {
        return res.json().then(function(json) {
          if (res.ok && json.success === true) {
            form.classList.remove('form-submitting');
            form.classList.add('form-success');
          } else {
            throw new Error(json.error || 'Submission failed. Please try again.');
          }
        });
      })
      .catch(function(err) {
        form.classList.remove('form-submitting');
        form.classList.add('form-error');
        var msgEl = form.querySelector('.form-error-msg');
        if (msgEl) msgEl.textContent = err.message || 'Network error. Please check your connection and try again.';
      });
  }

  /* ─── Global form submission binding ─── */
  document.querySelectorAll('form[data-endpoint], form[data-netlify], form.form-capture').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (typeof window.validateForm === 'function') {
        if (!window.validateForm(this)) return;
      }
      submitForm(this);
    });
  });

  /* ─── Form retry button handler ─── */
  document.addEventListener('click', function(e) {
    if (e.target.closest('.form-error-retry')) {
      var form = e.target.closest('form');
      if (form) submitForm(form);
    }
  });

  /* ─── Admin Authentication ─── */
  if (window.location.pathname.startsWith('/admin')) {
    const TOKEN_KEY = 'optiflow-admin-token';
    const loginEl = document.getElementById('adminLogin');
    const dashEl = document.getElementById('adminDashboard');
    const errorEl = document.getElementById('adminError');

    function showError(msg) {
      if (errorEl) { errorEl.textContent = msg; errorEl.classList.add('visible'); }
    }
    function hideError() {
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }
    }

    async function verifyToken() {
      var token = localStorage.getItem(TOKEN_KEY);
      if (!token) return false;
      try {
        var res = await fetch('/api/admin/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: token }) });
        var data = await res.json();
        return data.valid === true;
      } catch (e) { return false; }
    }

    window.adminLogin = async function() {
      hideError();
      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;
      if (!username || !password) { showError('Please enter both username and password.'); return; }
      try {
        var res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: username, password: password }) });
        var data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem(TOKEN_KEY, data.token);
          showDashboard();
        } else {
          showError(data.error || 'Invalid credentials.');
        }
      } catch (e) { showError('Network error. Please try again.'); }
    };

    window.adminLogout = function() {
      localStorage.removeItem(TOKEN_KEY);
      if (loginEl) loginEl.classList.add('visible');
      if (dashEl) dashEl.classList.remove('visible');
    };

    async function loadSubmissions() {
      var token = localStorage.getItem(TOKEN_KEY);
      var listEl = document.getElementById('submissionList');
      if (!listEl) return;
      try {
        var res = await fetch('/api/admin/submissions', { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json();
        if (data.success && data.submissions) {
          if (data.submissions.length === 0) {
            listEl.innerHTML = '<div class="admin-empty">No submissions yet.</div>';
            return;
          }
          listEl.innerHTML = data.submissions.map(function(s) {
            var fieldsHtml = Object.entries(s.fields || {}).map(function(e) { return e[0] + ': ' + e[1]; }).join(' | ');
            return '<div class="admin-submission-item"><div class="sub-header"><span class="sub-form">' + (s.formName || 'Unknown') + '</span><span class="sub-date">' + (s.timestamp || '') + '</span></div><div class="sub-fields">' + (fieldsHtml || 'No field data') + '</div></div>';
          }).join('');
        } else {
          listEl.innerHTML = '<div class="admin-empty">Unable to load submissions.</div>';
        }
      } catch (e) {
        listEl.innerHTML = '<div class="admin-empty">Error loading submissions.</div>';
      }
    }

    async function showDashboard() {
      if (loginEl) loginEl.classList.remove('visible');
      if (dashEl) dashEl.classList.add('visible');
      await loadSubmissions();
    }

    verifyToken().then(function(valid) {
      if (valid) { showDashboard(); }
      else if (loginEl) { loginEl.classList.add('visible'); }
    });
  }

  /* ─── Smooth scroll for hash links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
