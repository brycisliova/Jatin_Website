(function () {
  // Email address is assembled in the browser so it is not in the plain HTML.
  document.querySelectorAll('a.email').forEach(function (a) {
    var addr = a.dataset.u + '@' + a.dataset.d;
    a.setAttribute('href', 'mailto:' + addr);
    a.setAttribute('title', addr);
  });

  // Project filters (hidden without JavaScript, so every project stays visible)
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
