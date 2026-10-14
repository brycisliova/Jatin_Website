import { esc, inline } from '../util.mjs';

export function life(ctx) {
  const { life: l, site, hasNotes } = ctx;
  const sections = l.sections
    .map(
      (s) => `
<section class="life-section" id="${esc(s.id)}">
  <h2>${esc(s.title)}</h2>
  <p>${inline(s.body)}</p>
  ${s.books ? `<ul class="books">${s.books.map((b) => `<li><span class="book-title">${esc(b.title)}</span> <span class="faint">${esc(b.author)}</span></li>`).join('')}</ul>` : ''}
</section>`
    )
    .join('');

  const writing = [];
  if (hasNotes) writing.push(`<a href="../notes/">Notes on this site</a>`);
  if (site.links.blog) writing.push(`<a href="${esc(site.links.blog)}">My blog</a>`);
  const more = writing.length ? `<p class="fine">Writing elsewhere: ${writing.join(' · ')}</p>` : '';

  const body = `
<header class="page-head">
  <h1>Beyond the lab</h1>
  <p class="lede">${inline(l.intro)}</p>
</header>
${sections}
${more}`;
  return { title: 'Beyond the lab', description: 'Reading, writing, cooking, yoga and making: Jatin Kumar outside research.', active: 'life', depth: 1, path: 'life/', body };
}
