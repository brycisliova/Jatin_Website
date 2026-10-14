// Local preview: rebuilds on change and serves dist/ at http://localhost:4173
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, watch } from 'node:fs';
import { join, extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.txt': 'text/plain', '.xml': 'application/xml' };
const build = () => { const r = spawnSync('node', ['build.mjs'], { stdio: 'inherit' }); return r.status === 0; };

build();
let timer;
for (const dir of ['content', 'lib', 'static', 'build.mjs']) {
  if (!existsSync(dir)) continue;
  watch(dir, { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(build, 150); });
}

createServer((req, res) => {
  let p = join('dist', decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404, { 'content-type': 'text/html' }); return res.end(readFileSync('dist/404.html')); }
  res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
}).listen(4173, () => console.log('Preview: http://localhost:4173'));
