import { esc, inline } from '../util.mjs';

export function projects(ctx) {
  const areas = [...new Set(ctx.projects.flatMap((p) => p.area))];
  const filters = `<div class="filters" role="group" aria-label="Filter by area" hidden>
  <button type="button" class="chip" data-filter="all" aria-pressed="true">All</button>
  ${areas.map((a) => `<button type="button" class="chip" data-filter="${esc(a)}" aria-pressed="false">${esc(a)}</button>`).join('')}
</div>`;

  const items = ctx.projects
    .map(
      (p) => `
<article class="entry compact" id="${esc(p.id)}" data-areas="${esc(p.area.join('|'))}">
  <header>
    <p class="meta-line">${esc(p.term)} · ${esc(p.course)}</p>
    <h2>${inline(p.title)}</h2>
    <p class="meta-line">Guide: ${esc(p.guide)}</p>
  </header>
  <p>${inline(p.summary)}</p>
  ${p.highlight ? `<p class="highlight">${inline(p.highlight)}</p>` : ''}
  <ul class="bullets">${p.points.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>
  <p class="tags">${[...p.area, ...p.tools].map((t, i) => `<span class="tag${i < p.area.length ? ' tag-area' : ''}">${esc(t)}</span>`).join('')}</p>
</article>`
    )
    .join('');

  const body = `
<header class="page-head">
  <h1>Projects</h1>
  <p class="lede">Course projects from the last three years of my degree, from transistor-level design to RTL and device modelling.</p>
  ${filters}
</header>
<div id="project-list">${items}</div>
<p class="fine empty" hidden>No projects in this area.</p>`;
  return { title: 'Projects', description: 'Course projects by Jatin Kumar in analog, mixed-signal and digital VLSI design and optoelectronic devices.', active: 'projects', depth: 1, path: 'projects/', body };
}
