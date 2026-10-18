import { esc, plain, monthYear } from './util.mjs';

const NAV = [
  { id: 'home', label: 'Home', href: '' },
  { id: 'research', label: 'Research', href: 'research/' },
  { id: 'projects', label: 'Projects', href: 'projects/' },
  { id: 'coursework', label: 'Coursework', href: 'coursework/' },
  { id: 'cv', label: 'CV', href: 'cv/' },
  { id: 'life', label: 'Beyond', href: 'life/' },
  { id: 'notes', label: 'Notes', href: 'notes/', optional: 'notes' }
];

export function renderLayout(ctx, p) {
  const { site, hasNotes } = ctx;
  const root = '../'.repeat(p.depth ?? 0);
  const title = p.title ? `${plain(p.title)} · ${site.name}` : `${site.name} · ${plain(site.role)}`;
  const desc = plain(p.description || site.description);
  const canonical = site.url ? `${site.url.replace(/\/$/, '')}/${p.path ?? ''}` : '';

  const nav = NAV.filter((n) => !n.optional || hasNotes)
    .map((n) => `<a href="${root}${n.href}"${n.id === p.active ? ' aria-current="page"' : ''}>${n.label}</a>`)
    .join('');

  const sameAs = Object.entries(site.links)
    .filter(([k, v]) => v && k !== 'blog')
    .map(([, v]) => v);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    description: desc,
    affiliation: { '@type': 'CollegeOrUniversity', name: site.institute },
    ...(site.url && { url: site.url }),
    ...(sameAs.length && { sameAs })
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
<meta name="theme-color" content="#0a5f7a" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#074a60" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="preload" href="${root}fonts/source-sans-3-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}css/site.css">
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="page-${p.active || 'other'}">
<a class="skip" href="#main">Skip to content</a>
<div class="topband"><div class="topband-inner">${esc(site.institute)}</div></div>
<header class="masthead">
  <div class="masthead-inner">
    <a class="wordmark" href="${root}"><span class="wm-name">${esc(site.name)}</span><span class="wm-sub">Department of Electrical Engineering</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" hidden>
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2.4" fill="none"/></svg>
      <span>Menu</span>
    </button>
    <nav id="site-nav" class="site-nav" aria-label="Primary">${nav}</nav>
  </div>
</header>
<main id="main" class="${p.wide ? 'wide' : ''}">
${p.body.replace(/₂/g, '<sub>2</sub>')}
</main>
<footer class="colophon">
  <div class="colophon-inner">
    <div class="colophon-id">
      <p class="colophon-name">${esc(site.name)}</p>
      <p>${esc(site.role)}<br>${esc(site.institute)}</p>
      ${site.contact.location ? `<p>${esc(site.contact.location)}</p>` : ''}
      ${contactLinks(site, root, { cv: false }).length ? `<p class="colophon-links">${contactLinks(site, root, { cv: false }).join('<span aria-hidden="true"> · </span>')}</p>` : ''}
    </div>
    <nav class="colophon-nav" aria-label="Sections">${nav}</nav>
    <p class="colophon-fine">© ${new Date().getUTCFullYear()} ${esc(site.name)} · Updated ${monthYear()}</p>
  </div>
</footer>
<a class="to-top" href="#main" aria-label="Back to top" hidden><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M5 15l7-7 7 7" stroke="currentColor" stroke-width="2.6" fill="none"/></svg> Back to top</a>
<script src="${root}js/site.js" defer></script>
</body>
</html>
`;
}

/** Contact links as plain text, hiding any that are not configured. */
export function contactLinks(site, root, { cv = true } = {}) {
  const out = [];
  if (site.contact.email) {
    const [u, d] = site.contact.email.split('@');
    out.push(`<a href="#" class="email" data-u="${esc(u)}" data-d="${esc(d)}">Email<noscript> (${esc(u)} at ${esc(d)})</noscript></a>`);
  }
  const L = site.links;
  if (L.github) out.push(`<a href="${esc(L.github)}" rel="me">GitHub</a>`);
  if (L.linkedin) out.push(`<a href="${esc(L.linkedin)}" rel="me">LinkedIn</a>`);
  if (L.scholar) out.push(`<a href="${esc(L.scholar)}" rel="me">Google Scholar</a>`);
  if (L.orcid) out.push(`<a href="${esc(L.orcid)}" rel="me">ORCID</a>`);
  if (L.blog) out.push(`<a href="${esc(L.blog)}" rel="me">Blog</a>`);
  if (cv) out.push(`<a href="${root}cv/">CV</a>`);
  return out;
}
