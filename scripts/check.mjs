// Post-build sanity check: every local link/asset in dist/ must exist, every <img> needs alt text.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const DIST = 'dist';
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(DIST).filter((f) => f.endsWith('.html') && !f.endsWith('404.html'));
let bad = 0;

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) { console.log(`${file}: <img> without alt`); bad++; }
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const [path, hash] = url.split('#');
    if (url === '#') continue;
    let target = path ? resolve(dirname(file), path) : file;
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) { console.log(`${file}: broken link ${url}`); bad++; continue; }
    if (hash && target.endsWith('.html')) {
      const tIds = target === file ? ids : new Set([...readFileSync(target, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]));
      if (!tIds.has(hash)) { console.log(`${file}: missing anchor ${url}`); bad++; }
    }
  }
}
console.log(bad ? `${bad} problem(s)` : `OK: ${pages.length} pages checked`);
process.exit(bad ? 1 : 0);
