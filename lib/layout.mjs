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

const THEME_BOOT = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

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
<meta name="theme-color" content="#f9f7f2" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#161513" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="${root}favicon.svg" type="image/svg+xml">
<link rel="preload" href="${root}fonts/newsreader-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${root}css/site.css">
<script>${THEME_BOOT}</script>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body class="page-${p.active || 'other'}">
<a class="skip" href="#main">Skip to content</a>
<header class="masthead">
  <div class="masthead-inner">
    <a class="wordmark" href="${root}">${esc(site.name)}</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Primary">${nav}</nav>
    <button class="theme-toggle" type="button" aria-label="Switch colour theme">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3.75a8.25 8.25 0 0 1 0 16.5z" fill="currentColor"/></svg>
    </button>
  </div>
</header>
<main id="main" class="${p.wide ? 'wide' : ''}">
${p.body.replace(/₂/g, '<sub>2</sub>')}
</main>
<footer class="colophon">
  <div class="colophon-inner">
    <p>© ${new Date().getUTCFullYear()} ${esc(site.name)}</p>
    <p>${esc(plain(site.institute))} · Updated ${monthYear()}</p>
  </div>
</footer>
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
