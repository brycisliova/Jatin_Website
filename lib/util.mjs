import { marked } from 'marked';
import { readFileSync, existsSync } from 'node:fs';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// The self-hosted font subset has no subscript digits, so render them as <sub>.
const sub = (s) => s.replace(/₂/g, '<sub>2</sub>');

/** Inline markdown (and raw inline HTML such as <sub>) for short strings. */
export const inline = (s = '') => sub(marked.parseInline(String(s)));

/** Plain text for <title>, meta tags and JSON-LD. */
export const plain = (s = '') =>
  String(s).replace(/<[^>]+>/g, '').replace(/₂/g, '2').replace(/\s+/g, ' ').trim();

export const block = (md = '') => marked.parse(md);

export const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
export const exists = (path) => existsSync(path);

export const slugify = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const longDate = (iso) => {
  const d = new Date(iso + 'T00:00:00Z');
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
export const monthYear = (d = new Date()) => `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;

/** Minimal front matter: `key: value` lines between --- fences. */
export function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':');
    if (i < 0) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (key === 'tags') val = val.replace(/^\[|\]$/g, '').split(',').map((t) => t.trim()).filter(Boolean);
    if (key === 'draft') val = val === 'true';
    data[key] = val;
  }
  return { data, body: m[2] };
}

/** Inline right arrow (the font subset has no U+2192). */
export const ARROW =
  '<svg class="arrow" viewBox="0 0 24 10" width="22" height="9" aria-hidden="true"><path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
