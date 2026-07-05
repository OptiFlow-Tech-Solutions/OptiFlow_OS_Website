/* ═══════════════════════════════════════════
   OptiFlow OS — Client-Side Site Search
   ═══════════════════════════════════════════ */
(function() {
  var index = [];
  var loaded = false;
  var loading = false;
  var modal = null;
  var input = null;
  var results = null;
  var selectedIdx = -1;

  function score(item, query) {
    var q = query.toLowerCase();
    var fields = [item.title, item.description, item.excerpt];
    var best = 0;
    var title = item.title.toLowerCase();
    var desc = item.description.toLowerCase();

    if (title === q) best = Math.max(best, 100);
    if (title.startsWith(q)) best = Math.max(best, 90);
    if (title.indexOf(q) !== -1) best = Math.max(best, 70);
    if (desc.indexOf(q) !== -1) best = Math.max(best, 40);

    for (var i = 0; i < fields.length; i++) {
      var f = fields[i].toLowerCase();
      var idx = f.indexOf(q);
      if (idx !== -1) {
        var s = 30 - Math.min(idx, 30);
        if (i === 0) s += 20;
        if (i === 1) s += 10;
        best = Math.max(best, s);
      }
    }
    return best;
  }

  function search(query) {
    if (!query || query.length < 2) return [];
    return index
      .map(function(item) { return { item: item, score: score(item, query) }; })
      .filter(function(r) { return r.score > 0; })
      .sort(function(a, b) { return b.score - a.score; })
      .slice(0, 8)
      .map(function(r) { return r.item; });
  }

  function highlight(text, query) {
    if (!query || !text) return text;
    var re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return text.replace(re, '<mark>$1</mark>');
  }

  function renderResults(items, query) {
    if (!results) return;
    results.innerHTML = '';
    selectedIdx = -1;

    if (items.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'search-empty';
      empty.textContent = 'No pages found. Try a different search term.';
      results.appendChild(empty);
      return;
    }

    items.forEach(function(item, i) {
      var a = document.createElement('a');
      a.href = item.url;
      a.className = 'search-result';
      a.setAttribute('data-idx', i);

      var t = document.createElement('span');
      t.className = 'search-result-title';
      t.innerHTML = highlight(item.title, query);

      var d = document.createElement('span');
      d.className = 'search-result-desc';
      d.innerHTML = highlight(item.description.slice(0, 120) + (item.description.length > 120 ? '...' : ''), query);

      a.appendChild(t);
      a.appendChild(d);
      a.addEventListener('click', closeModal);
      results.appendChild(a);
    });
  }

  function updateSelection() {
    var items = results.querySelectorAll('.search-result');
    items.forEach(function(el, i) {
      el.classList.toggle('selected', i === selectedIdx);
      if (i === selectedIdx) el.scrollIntoView({ block: 'nearest' });
    });
  }

  function loadIndex(cb) {
    if (loaded) { cb(); return; }
    if (loading) { setTimeout(function() { loadIndex(cb); }, 50); return; }
    loading = true;
    fetch('/search-index.json')
      .then(function(r) { return r.json(); })
      .then(function(data) { index = data; loaded = true; cb(); })
      .catch(function() { loaded = true; cb(); });
  }

  function openModal() {
    if (!modal) {
      modal = document.getElementById('searchModal');
      input = document.getElementById('searchInput');
      results = document.getElementById('searchResults');
    }
    if (!modal) return;

    loadIndex(function() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(function() { if (input) input.focus(); }, 150);
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (input) input.value = '';
      if (results) results.innerHTML = '';
      selectedIdx = -1;
    }
  }

  /* ─── Event bindings ─── */
  document.addEventListener('click', function(e) {
    var trigger = e.target.closest('.search-toggle');
    if (trigger) { e.preventDefault(); openModal(); return; }

    if (modal && modal.classList.contains('open')) {
      if (!modal.querySelector('.search-panel').contains(e.target)) {
        closeModal();
      }
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      openModal();
      return;
    }

    if (!modal || !modal.classList.contains('open')) return;

    if (e.key === 'Escape') { closeModal(); return; }
    if (!input || !results) return;

    var items = results.querySelectorAll('.search-result');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = Math.max(selectedIdx - 1, 0);
      updateSelection();
    } else if (e.key === 'Enter' && selectedIdx >= 0 && items[selectedIdx]) {
      e.preventDefault();
      items[selectedIdx].click();
    }
  });

  if (input) {
    input.addEventListener('input', function() {
      var q = input.value.trim();
      var items = search(q);
      renderResults(items, q);
    });
  }

  /* Re-bind input after DOM ready, since nav partial may not be parsed yet */
  document.addEventListener('DOMContentLoaded', function() {
    modal = document.getElementById('searchModal');
    input = document.getElementById('searchInput');
    results = document.getElementById('searchResults');
    if (input) {
      input.addEventListener('input', function() {
        var q = input.value.trim();
        var items = search(q);
        renderResults(items, q);
      });
    }
  });
})();
