import { esc, inline } from '../util.mjs';

export function coursework(ctx) {
  const { coursework: cw, projects } = ctx;
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
  const groups = cw.groups
    .map(
      (g) => `
<section class="course-group" aria-labelledby="g-${esc(g.name.toLowerCase().replace(/\W+/g, '-'))}">
  <h2 id="g-${esc(g.name.toLowerCase().replace(/\W+/g, '-'))}">${esc(g.name)}</h2>
  <ul class="courses">
    ${g.courses
      .map((c) => {
        const bits = [];
        if (c.code) bits.push(`<span class="code">${esc(c.code)}</span>`);
        if (c.note) bits.push(`<span class="faint">${esc(c.note)}</span>`);
        for (const id of [].concat(c.projects || c.project || [])) {
          if (byId[id]) bits.push(`<a class="more" href="../projects/#${esc(id)}">Project</a>`);
        }
        return `<li><span class="course-name">${inline(c.name)}</span>${bits.length ? `<span class="course-meta">${bits.join(' ')}</span>` : ''}</li>`;
      })
      .join('')}
  </ul>
</section>`
    )
    .join('');

  const body = `
<header class="page-head">
  <h1>Coursework</h1>
  <p>${inline(cw.intro)}</p>
</header>
<div class="course-grid">${groups}</div>`;
  return { title: 'Coursework', description: 'Courses completed by Jatin Kumar at IIT Bombay across circuits, VLSI, devices, signals, mathematics and computing.', active: 'coursework', depth: 1, path: 'coursework/', body };
}
