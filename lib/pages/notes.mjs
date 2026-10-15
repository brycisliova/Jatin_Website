import { esc, inline, block, longDate, plain } from '../util.mjs';

export function notesIndex(ctx) {
  const items = ctx.notes
    .map(
      (n) => `
<li class="note-item">
  <a href="${esc(n.slug)}/"><span class="row-title">${inline(n.title)}</span></a>
  <p class="meta-line">${longDate(n.date)}${n.tags?.length ? ' · ' + n.tags.map(esc).join(', ') : ''}</p>
  ${n.summary ? `<p>${inline(n.summary)}</p>` : ''}
</li>`
    )
    .join('');
  const body = `
<header class="page-head">
  <h1>Notes</h1>
  <p>Occasional writing on circuits, research and whatever else is on my mind.</p>
</header>
<ul class="note-list">${items}</ul>`;
  return { title: 'Notes', description: 'Notes and writing by Jatin Kumar.', active: 'notes', depth: 1, path: 'notes/', body };
}

export function notePage(ctx, n) {
  const body = `
<article class="post">
  <header class="page-head">
    <p class="meta-line"><a href="../">Notes</a> · ${longDate(n.date)}</p>
    <h1>${inline(n.title)}</h1>
    ${n.summary ? `<p>${inline(n.summary)}</p>` : ''}
  </header>
  <div class="prose">${block(n.body)}</div>
</article>`;
  return { title: n.title, description: plain(n.summary || ctx.site.description), active: 'notes', depth: 2, path: `notes/${n.slug}/`, ogType: 'article', body };
}
