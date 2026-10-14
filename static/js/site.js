(function () {
  var root = document.documentElement;

  // Theme toggle: follow the system until the visitor chooses.
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Email address is assembled at click time to keep it out of plain HTML.
  document.querySelectorAll('a.email').forEach(function (a) {
    var addr = a.dataset.u + '@' + a.dataset.d;
    a.setAttribute('href', 'mailto:' + addr);
    a.setAttribute('title', addr);
  });

  // Project filters (hidden without JS, so every project stays visible)
  var filters = document.querySelector('.filters');
  if (filters) {
    filters.hidden = false;
    var items = document.querySelectorAll('[data-areas]');
    var empty = document.querySelector('.empty');
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var f = btn.dataset.filter;
      filters.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = 0;
      items.forEach(function (it) {
        var match = f === 'all' || it.dataset.areas.split('|').indexOf(f) > -1;
        it.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  // Print button on the CV page
  document.querySelectorAll('[data-print]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });
})();
