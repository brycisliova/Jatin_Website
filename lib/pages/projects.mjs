import { esc, inline } from '../util.mjs';
import { tables, figures, paragraphs, bullets, keywords, team } from '../entry.mjs';

export function projects(ctx) {
  const root = '../';
  const areas = [...new Set(ctx.projects.flatMap((p) => p.area))];
  const filters = `<div class="filters" role="group" aria-label="Filter by area" hidden>
  <span class="label">Show:</span>
  <button type="button" class="chip" data-filter="all" aria-pressed="true">All</button>
  ${areas.map((a) => `<button type="button" class="chip" data-filter="${esc(a)}" aria-pressed="false">${esc(a)}</button>`).join('')}
</div>`;

  const items = ctx.projects
    .map(
      (p) => `
<article class="entry" id="${esc(p.id)}" data-areas="${esc(p.area.join('|'))}">
  <header>
    <h2>${inline(p.title)}</h2>
    <p class="meta-line">${esc(p.course)} · ${esc(p.term)}</p>
    <p class="meta-line">Guide: ${esc(p.guide)}</p>
    ${p.team ? team(p.team) : ''}
  </header>
  <p>${inline(p.summary)}</p>
  ${p.basis ? `<p class="fine">${inline(p.basis)}</p>` : ''}
  ${p.highlight ? `<p class="highlight">${inline(p.highlight)}</p>` : ''}
  ${bullets(p.points)}
  ${tables(p.tables)}
  ${figures(p.figures, root)}
  ${keywords([...p.area, ...p.tools])}
</article>`
    )
    .join('');

  const body = `
<header class="page-head">
  <h1>Projects</h1>
  <p>Course projects, from transistor-level circuit design to RTL and device modelling. Where a project was done in a team, the contribution of each member is listed.</p>
  ${filters}
</header>
<div id="project-list">${items}</div>
<p class="fine empty" hidden>No projects in this area.</p>`;
  return { title: 'Projects', description: 'Course projects by Jatin Kumar in analog, mixed-signal and digital VLSI design and optoelectronic devices.', active: 'projects', depth: 1, path: 'projects/', body };
}
