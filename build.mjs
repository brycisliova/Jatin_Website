// Static site generator for the portfolio. Run with `npm run build`; output goes to dist/.
import { mkdirSync, writeFileSync, readFileSync, readdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { readJson, parseFrontMatter, slugify } from './lib/util.mjs';
import { renderLayout } from './lib/layout.mjs';
import { home } from './lib/pages/home.mjs';
import { research } from './lib/pages/research.mjs';
import { projects } from './lib/pages/projects.mjs';
import { coursework } from './lib/pages/coursework.mjs';
import { cv } from './lib/pages/cv.mjs';
import { life } from './lib/pages/life.mjs';
import { notesIndex, notePage } from './lib/pages/notes.mjs';

const OUT = 'dist';

function loadNotes() {
  const dir = 'content/notes';
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => {
      const { data, body } = parseFrontMatter(readFileSync(join(dir, f), 'utf8'));
      if (!data.title || !data.date) throw new Error(`${f}: front matter needs "title" and "date" (YYYY-MM-DD)`);
      return { ...data, body, slug: data.slug || slugify(f.replace(/\.md$/, '')) };
    })
    .filter((n) => !n.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

const site = readJson('content/site.json');
const notes = loadNotes();
const ctx = {
  site,
  research: readJson('content/research.json'),
  projects: readJson('content/projects.json'),
  coursework: readJson('content/coursework.json'),
  exp: readJson('content/experience.json'),
  life: readJson('content/life.json'),
  updates: readJson('content/updates.json'),
  notes,
  hasNotes: site.notes.show === 'always' || (site.notes.show === 'auto' && notes.length > 0)
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync('static', OUT, { recursive: true });

// Self-hosted fonts (copied from node_modules so the repo stays small).
mkdirSync(join(OUT, 'fonts'), { recursive: true });
const fontFiles = [
  ['@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-normal.woff2'],
  ['@fontsource-variable/source-sans-3/files/source-sans-3-latin-wght-italic.woff2']
];
for (const [f] of fontFiles) cpSync(join('node_modules', f), join(OUT, 'fonts', f.split('/').pop()));

const pages = [home(ctx), research(ctx), projects(ctx), coursework(ctx), cv(ctx), life(ctx)];
if (ctx.hasNotes) {
  pages.push(notesIndex(ctx));
  for (const n of notes) pages.push(notePage(ctx, n));
}

for (const p of pages) {
  const dir = join(OUT, p.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), renderLayout(ctx, p));
}

// 404 (served by GitHub Pages, Cloudflare Pages and Netlify; uses absolute asset paths).
{
  const body = `<header class="page-head"><h1>Page not found</h1><p class="lede">That address does not exist. Try the <a href="/">home page</a>.</p></header>`;
  const html = renderLayout(ctx, { title: 'Not found', body, active: 'none', depth: 0, path: '404.html' })
    .replace(/(href|src)="(?!https?:|\/|#)/g, '$1="/');
  writeFileSync(join(OUT, '404.html'), html);
}

const base = site.url ? site.url.replace(/\/$/, '') : '';
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ''}`);
if (base) {
  const urls = pages.map((p) => `  <url><loc>${base}/${p.path}</loc></url>`).join('\n');
  writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
if (site.domain) writeFileSync(join(OUT, 'CNAME'), site.domain + '\n');
writeFileSync(join(OUT, '.nojekyll'), '');

console.log(`Built ${pages.length} pages to ${OUT}/`);
