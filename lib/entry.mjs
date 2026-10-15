import { esc, inline } from './util.mjs';

/** Tables in a plain, rule-only style: { caption, head: [...], rows: [[...]] }. */
export function tables(list = []) {
  return list
    .map(
      (t) => `<table class="data">
  ${t.caption ? `<caption>${inline(t.caption)}</caption>` : ''}
  <thead><tr>${t.head.map((h, i) => `<th scope="col"${i ? ' class="num"' : ''}>${inline(h)}</th>`).join('')}</tr></thead>
  <tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => (i ? `<td class="num">${inline(c)}</td>` : `<th scope="row">${inline(c)}</th>`)).join('')}</tr>`).join('')}</tbody>
</table>`
    )
    .join('');
}

/** Figures with captions; `src` is relative to the site root. */
export function figures(list = [], root) {
  return list
    .map(
      (f) => `<figure class="figure">
  <img src="${root}${esc(f.src)}" alt="${esc(f.alt)}"${f.width ? ` width="${f.width}" height="${f.height}"` : ''}>
  <figcaption>${inline(f.caption || '')}</figcaption>
</figure>`
    )
    .join('');
}

export const paragraphs = (list = []) => list.map((s) => `<p>${inline(s)}</p>`).join('');

export const bullets = (list = []) =>
  list.length ? `<ul class="bullets">${list.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>` : '';

export const keywords = (list = []) =>
  list.length ? `<p class="keywords"><span class="label">Keywords:</span> ${list.map(esc).join(', ')}</p>` : '';

/** "Team" line: people with their part of the work. */
export function team(list = []) {
  if (!list.length) return '';
  return `<p class="meta-line">${list.map((m) => `${esc(m.name)}${m.role ? ` <span class="faint">(${esc(m.role)})</span>` : ''}`).join(' · ')}</p>`;
}

export function notes(list = []) {
  return list.map((n) => `<p class="fine">${inline(n)}</p>`).join('');
}
