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

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function(el) {
    revealObserver.observe(el);
  });

  /* ─── Unified Motion (replaces per-page stagger duplicates) ─── */
  document.querySelectorAll('[class*="stagger-"]').forEach(function(parent) {
    var match = parent.className.match(/stagger-(\d+)/);
    if (!match) return;
    var count = parseInt(match[1]);
    var baseDelay = 80;
    var children = parent.querySelectorAll(':scope > .reveal, :scope > .reveal-left, :scope > .reveal-right, :scope > .reveal-scale, :scope > *');
    children.forEach(function(child, i) {
      if (i >= count * 2) return;
      child.style.transitionDelay = (i * baseDelay) + 'ms';
    });
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, [class*="stagger-"] > *').forEach(function(el) {
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

  /* ═══ SKELETON LOADING UTILITY ═══
     ponytail: inject/remove skeleton placeholders during async loads.
     Types: 'text', 'card', 'list', 'table-row'. */
  window.showSkeleton = function(container, type, count) {
    if (!container) return;
    count = count || 5;
    var html = '';
    for (var i = 0; i < count; i++) {
      if (type === 'card') {
        html += '<div class="skeleton skeleton-card"><div class="skeleton-card-inner"><div class="skeleton skeleton-heading"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text sm"></div></div></div>';
      } else if (type === 'list' || type === 'table-row') {
        html += '<div class="skeleton skeleton-row"><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text sm"></div><div class="skeleton skeleton-text xs"></div></div>';
      } else {
        html += '<div class="skeleton skeleton-text" style="width:' + (i === count - 1 ? 40 : 90) + '%"></div>';
      }
    }
    container.dataset.origHtml = container.innerHTML;
    container.innerHTML = html;
  };
  window.hideSkeleton = function(container) {
    if (!container) return;
    container.innerHTML = container.dataset.origHtml || '';
    delete container.dataset.origHtml;
  };

  /* ─── Empty State Helper ─── */
  var emptyIconSvg = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>';
  window.emptyState = function(title, desc, iconSvg) {
    iconSvg = iconSvg || emptyIconSvg;
    var descHtml = desc ? '<p>' + desc + '</p>' : '';
    return '<div class="empty-state"><div class="empty-state-icon">' + iconSvg + '</div><h3>' + title + '</h3>' + descHtml + '</div>';
  };

  /* ═══ TOAST NOTIFICATIONS ═══
     ponytail: global showToast() — create container lazily, auto-dismiss,
     manual close, accessible (role=alert). */
  var ICONS = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  var CLOSE_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var toastContainer = null;
  function ensureToastContainer() {
    if (toastContainer) return toastContainer;
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(toastContainer);
    return toastContainer;
  }

  /**
   * showToast(message, type, duration)
   * type: 'success' | 'error' | 'warning' | 'info' (default: 'info')
   * duration: ms (default: 5000, 0 = no auto-dismiss)
   */
  window.showToast = function(message, type, duration) {
    type = type || 'info';
    duration = duration !== undefined ? duration : 5000;
    var container = ensureToastContainer();

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'alert');

    var icon = ICONS[type] || ICONS.info;
    toast.innerHTML = icon + '<div class="toast-body"><div class="toast-message">' + message + '</div></div><button class="toast-close" aria-label="Dismiss notification">' + CLOSE_ICON + '</button>';

    var closeBtn = toast.querySelector('.toast-close');
    var removed = false;

    function removeToast() {
      if (removed) return;
      removed = true;
      toast.classList.add('toast-removing');
      setTimeout(function() {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 260);
    }

    closeBtn.addEventListener('click', removeToast);

    if (duration > 0) {
      setTimeout(removeToast, duration);
    }

    container.appendChild(toast);
    return toast;
  };

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

    var allSubmissions = [];
    var currentPage = 1;
    var totalPages = 1;
    var perPage = 20;
    var auditPage = 1;
    var auditTotalPages = 1;
    var emailPage = 1;
    var emailTotalPages = 1;
    var refreshInterval = null;
    var activeTab = 'submissions';

    window.switchTab = function(tab) {
      activeTab = tab;
      document.querySelectorAll('.admin-tab').forEach(function(t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.admin-tab-panel').forEach(function(p) { p.classList.remove('active'); });
      var tabBtn = document.querySelector('.admin-tab[data-tab="' + tab + '"]');
      if (tabBtn) { tabBtn.classList.add('active'); tabBtn.setAttribute('aria-selected', 'true'); }
      var panel = document.getElementById('tab-' + tab);
      if (panel) panel.classList.add('active');
      if (tab === 'audit') loadAuditLog();
      if (tab === 'email') loadEmailLog();
    };

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
      if (refreshInterval) { clearInterval(refreshInterval); refreshInterval = null; }
      activeTab = 'submissions';
      auditPage = 1;
      emailPage = 1;
      if (loginEl) loginEl.classList.add('visible');
      if (dashEl) dashEl.classList.remove('visible');
    };

    async function loadStats() {
      var token = localStorage.getItem(TOKEN_KEY);
      try {
        var res = await fetch('/api/admin/stats', { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json();
        if (data.success && data.stats) {
          var s = data.stats;
          document.getElementById('statTotal').textContent = s.total || 0;
          document.getElementById('statToday').textContent = s.today || 0;
          document.getElementById('statContact').textContent = (s.byForm && s.byForm.contact) || 0;
          document.getElementById('statDemo').textContent = (s.byForm && s.byForm['demo-booking']) || 0;
          document.getElementById('statNewsletter').textContent = (s.byForm && s.byForm.newsletter) || 0;
          document.getElementById('statSubscribers').textContent = s.subscribers || 0;
          document.getElementById('statEmailsSent').textContent = s.emailsSent || 0;
          document.getElementById('statEmailsFailed').textContent = s.emailsFailed || 0;
          document.getElementById('statRateLimited').textContent = s.rateLimited || 0;
        }
      } catch (e) { /* stats optional, ignore errors */ }
    }

    function filterSubmissions() {
      var search = (document.getElementById('submissionSearch').value || '').toLowerCase();
      var items = document.querySelectorAll('.admin-submission-item');
      items.forEach(function(item) {
        var text = (item.textContent || '').toLowerCase();
        item.style.display = (!search || text.indexOf(search) !== -1) ? '' : 'none';
      });
    }

    function onFormFilterChange() {
      currentPage = 1;
      loadSubmissions();
    }

    window.goToPage = function(dir) {
      if (dir === 'prev' && currentPage > 1) { currentPage--; loadSubmissions(); }
      if (dir === 'next' && currentPage < totalPages) { currentPage++; loadSubmissions(); }
    };

    window.exportSubmissions = async function(format) {
      var token = localStorage.getItem(TOKEN_KEY);
      var formFilter = document.getElementById('formTypeFilter').value;
      var url = '/api/admin/submissions/export?format=' + format;
      if (formFilter) url += '&formName=' + encodeURIComponent(formFilter);
      try {
        var res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
        if (!res.ok) { alert('Export failed: ' + res.status); return; }
        var blob = await res.blob();
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'optiflow-submissions.' + format;
        a.click();
        URL.revokeObjectURL(a.href);
      } catch (e) { alert('Export failed'); }
    };

    async function loadSubmissions() {
      var token = localStorage.getItem(TOKEN_KEY);
      var listEl = document.getElementById('submissionList');
      if (!listEl) return;
      showSkeleton(listEl, 'card', 5);
      try {
        var formFilter = document.getElementById('formTypeFilter').value;
        var url = '/api/admin/submissions?page=' + currentPage + '&per_page=' + perPage;
        if (formFilter) url += '&formName=' + encodeURIComponent(formFilter);
        var res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json();
        if (data.success && data.submissions) {
          allSubmissions = data.submissions;
          var pag = data.pagination || {};
          totalPages = pag.pages || 1;
          document.getElementById('pageInfo').textContent = 'Page ' + (pag.page || 1) + ' of ' + totalPages + ' (' + (pag.total || 0) + ' total)';
          document.getElementById('btnPrev').disabled = currentPage <= 1;
          document.getElementById('btnNext').disabled = currentPage >= totalPages;
          if (totalPages > 1) {
            document.getElementById('adminPagination').style.display = 'flex';
          } else {
            document.getElementById('adminPagination').style.display = 'none';
          }
          if (data.submissions.length === 0) {
            listEl.innerHTML = emptyState('No submissions yet.', 'New submissions will appear here.');
            return;
          }
          listEl.innerHTML = data.submissions.map(function(s) {
            var fieldsHtml = Object.entries(s.fields || {}).map(function(e) { return '<div class="sub-field-row"><strong>' + e[0] + ':</strong> ' + e[1] + '</div>'; }).join('');
            return '<div class="admin-submission-item" data-form-name="' + (s.formName || '') + '" onclick="this.classList.toggle(\'expanded\')"><div class="sub-header"><span class="sub-toggle sub-form">' + (s.formName || 'Unknown') + '</span><span class="sub-date">' + (s.timestamp || '') + '</span></div><div class="sub-fields">' + (fieldsHtml || 'No field data') + '</div></div>';
          }).join('');
        } else {
          listEl.innerHTML = emptyState('Unable to load', 'Please check your connection and try again.');
        }
      } catch (e) {
        listEl.innerHTML = emptyState('Error loading submissions', 'A network or server error occurred. Try again later.');
      }
    }

    window.goToAuditPage = function(dir) {
      if (dir === 'prev' && auditPage > 1) { auditPage--; loadAuditLog(); }
      if (dir === 'next' && auditPage < auditTotalPages) { auditPage++; loadAuditLog(); }
    };

    window.goToEmailPage = function(dir) {
      if (dir === 'prev' && emailPage > 1) { emailPage--; loadEmailLog(); }
      if (dir === 'next' && emailPage < emailTotalPages) { emailPage++; loadEmailLog(); }
    };

    async function loadAuditLog() {
      var token = localStorage.getItem(TOKEN_KEY);
      var listEl = document.getElementById('auditList');
      if (!listEl) return;
      showSkeleton(listEl, 'list', 6);
      try {
        var res = await fetch('/api/admin/audit?page=' + auditPage + '&per_page=20', { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json();
        if (data.success) {
          var pag = data.pagination || {};
          auditTotalPages = pag.pages || 1;
          document.getElementById('auditPageInfo').textContent = 'Page ' + (pag.page || 1) + ' of ' + auditTotalPages + ' (' + (pag.total || 0) + ' total)';
          document.getElementById('auditBtnPrev').disabled = auditPage <= 1;
          document.getElementById('auditBtnNext').disabled = auditPage >= auditTotalPages;
          document.getElementById('auditPagination').style.display = auditTotalPages > 1 ? 'flex' : 'none';
          var entries = data.entries || [];
          if (entries.length === 0) {
            listEl.innerHTML = emptyState('No audit entries yet.', 'Activity log entries will appear here.');
            return;
          }
          listEl.innerHTML = entries.map(function(e) {
            var cls = e.action === 'admin_login_failed' ? ' admin-audit-fail' : (e.action === 'admin_login' ? ' admin-audit-success' : '');
            var label = (e.action || '').replace(/_/g, ' ');
            var detail = '';
            if (e.detail) {
              var detailKeys = Object.keys(e.detail).filter(function(k) { return e.detail[k]; });
              detail = detailKeys.map(function(k) { return k + ': ' + e.detail[k]; }).join(', ');
            }
            if (!detail && e.resource) detail = e.resource;
            return '<div class="admin-audit-row"><span class="admin-audit-action' + cls + '">' + label + '</span><span class="admin-audit-detail">' + (detail || '') + '</span><span class="admin-audit-time">' + (e.timestamp || '') + '</span></div>';
          }).join('');
        } else {
          listEl.innerHTML = emptyState('Unable to load', 'Please check your connection and try again.');
        }
      } catch (e) {
        listEl.innerHTML = emptyState('Error loading audit log', 'A network or server error occurred. Try again later.');
      }
    }

    async function loadEmailLog() {
      var token = localStorage.getItem(TOKEN_KEY);
      var listEl = document.getElementById('emailList');
      if (!listEl) return;
      showSkeleton(listEl, 'list', 6);
      try {
        var res = await fetch('/api/admin/submissions?page=' + emailPage + '&per_page=20', { headers: { 'Authorization': 'Bearer ' + token } });
        var data = await res.json();

        var sentW = 0;
        var failedW = 0;
        var emailEntries = [];
        try {
          var statsRes = await fetch('/api/admin/stats', { headers: { 'Authorization': 'Bearer ' + token } });
          var statsData = await statsRes.json();
          if (statsData.success && statsData.stats) {
            sentW = statsData.stats.emailsSent || 0;
            failedW = statsData.stats.emailsFailed || 0;
          }
        } catch (e) { /* ignore */ }

        document.getElementById('emailSentCount').textContent = sentW;
        document.getElementById('emailFailedCount').textContent = failedW;

        if (data.success && data.submissions) {
          emailEntries = data.submissions.map(function(s) {
            return {
              timestamp: s.timestamp,
              type: s.formName || 'unknown',
              to: (s.fields && s.fields.email) || 'n/a',
              success: s.emailSent,
            };
          });
        }

        var pag = data.pagination || {};
        emailTotalPages = pag.pages || 1;
        document.getElementById('emailPageInfo').textContent = 'Page ' + (pag.page || 1) + ' of ' + emailTotalPages + ' (' + (pag.total || 0) + ' total)';
        document.getElementById('emailBtnPrev').disabled = emailPage <= 1;
        document.getElementById('emailBtnNext').disabled = emailPage >= emailTotalPages;
        document.getElementById('emailPagination').style.display = emailTotalPages > 1 ? 'flex' : 'none';

        if (emailEntries.length === 0) {
          listEl.innerHTML = emptyState('No email logs yet.', 'Email delivery records will appear here.');
          return;
        }

        listEl.innerHTML = emailEntries.map(function(e) {
          var typeLabel = e.type.charAt(0).toUpperCase() + e.type.slice(1).replace('-', ' ');
          var statusCls = e.success ? 'success' : 'fail';
          var statusLabel = e.success ? 'Sent' : 'Failed';
          return '<div class="admin-email-row"><span class="admin-email-type">' + typeLabel + '</span><span class="admin-email-to">' + e.to + '</span><span class="admin-email-status ' + statusCls + '">' + statusLabel + '</span><span class="admin-email-time">' + (e.timestamp || '') + '</span></div>';
        }).join('');
      } catch (e) {
        listEl.innerHTML = emptyState('Error loading email logs', 'A network or server error occurred. Try again later.');
      }
    }

    async function showDashboard() {
      if (loginEl) loginEl.classList.remove('visible');
      if (dashEl) dashEl.classList.add('visible');
      await loadStats();
      await loadSubmissions();
      if (refreshInterval) clearInterval(refreshInterval);
      refreshInterval = setInterval(function() { loadSubmissions(); }, 30000);
    }

    document.getElementById('submissionSearch').addEventListener('input', filterSubmissions);
    document.getElementById('formTypeFilter').addEventListener('change', onFormFilterChange);

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

  /* ─── Cookie Consent ─── */
  (function() {
    var STORAGE_KEY = 'optiflow-cookie-consent';
    var banner = document.getElementById('cookieConsentBanner');
    var modalOverlay = document.getElementById('cookieModalOverlay');
    if (!banner) return;

    var consent = null;
    try { consent = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (_) { /* ignore */ }

    if (!consent) {
      setTimeout(function() { banner.classList.add('visible'); }, 600);
    }

    window.openCookieModal = function() {
      if (!modalOverlay) return;
      var current = null;
      try { current = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (_) { /* ignore */ }
      if (current) {
        var analyticsEl = document.getElementById('cookieAnalytics');
        var prefsEl = document.getElementById('cookiePreferences');
        if (analyticsEl) analyticsEl.checked = !!current.analytics;
        if (prefsEl) prefsEl.checked = !!current.preferences;
      }
      modalOverlay.classList.add('visible');
      document.body.style.overflow = 'hidden';
    };

    window.closeCookieModal = function() {
      if (!modalOverlay) return;
      modalOverlay.classList.remove('visible');
      document.body.style.overflow = '';
    };

    window.acceptAllCookies = function() {
      var data = { essential: true, analytics: true, preferences: true, acceptedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (banner) banner.classList.remove('visible');
      closeCookieModal();
    };

    window.rejectNonEssential = function() {
      var data = { essential: true, analytics: false, preferences: false, acceptedAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (banner) banner.classList.remove('visible');
    };

    window.saveCookiePreferences = function() {
      var analyticsEl = document.getElementById('cookieAnalytics');
      var prefsEl = document.getElementById('cookiePreferences');
      var data = {
        essential: true,
        analytics: analyticsEl ? analyticsEl.checked : false,
        preferences: prefsEl ? prefsEl.checked : false,
        acceptedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      if (banner) banner.classList.remove('visible');
      closeCookieModal();
    };

    if (modalOverlay) {
      modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) closeCookieModal();
      });
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('visible')) {
          closeCookieModal();
        }
      });
    }

    /* "Cookie Settings" footer link triggers */
    document.addEventListener('click', function(e) {
      var link = e.target.closest('.cookie-settings-link');
      if (link) {
        e.preventDefault();
        openCookieModal();
      }
    });
  })();

  /* ─── Page Transitions ───
     ponytail: fade-in on load, fade-out on internal-link click.
     Skips if reduced-motion, external links, hash-only, downloads, new-tab, mailto/tel.
     Graceful: if JS fails, default navigation still works. */
  (function() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Enter: add class after DOM ready so browser paints the enter animation */
    if (!prefersReduced) {
      document.documentElement.classList.add('page-enter-active');
    }

    function isInternalLink(a) {
      if (!a.href || a.protocol === 'mailto:' || a.protocol === 'tel:') return false;
      if (a.target === '_blank' || a.hasAttribute('download')) return false;
      if (a.getAttribute('href') === '#') return false;
      if (a.getAttribute('href') && a.getAttribute('href').startsWith('#')) return false;
      try { return new URL(a.href).origin === window.location.origin; }
      catch (_) { return false; }
    }

    /* Exit: intercept internal link clicks, play exit animation, then navigate */
    document.addEventListener('click', function(e) {
      var a = e.target.closest('a');
      if (!a || !isInternalLink(a)) return;
      if (prefersReduced) return; /* let default navigation proceed */
      e.preventDefault();
      var href = a.href;
      document.documentElement.classList.add('page-exit-active');
      setTimeout(function() { window.location = href; }, 280);
    });
  })();
})();
