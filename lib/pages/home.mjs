import { esc, inline, plain } from '../util.mjs';
import { contactLinks } from '../layout.mjs';

export function home(ctx) {
  const { site, updates, research, projects } = ctx;
  const root = '';
  const links = contactLinks(site, root);

  const interests = [
    ['High-speed wireline and memory interfaces', 'Channel modelling, equalization (CTLE, DFE) and clock-and-data recovery.'],
    ['Analog and mixed-signal circuits', 'Amplifiers, data converters, and the layouts that make them work.'],
    ['Devices and materials', 'Optoelectronic devices, and first-principles calculations of 2D materials.']
  ]
    .map(([t, d]) => `<li><strong>${t}.</strong> ${d}</li>`)
    .join('');

  const ups = updates
    .map(
      (u) =>
        `<li><span class="when">${esc(u.when)}</span><span>${inline(u.text)}${
          u.link ? ` <a class="more" href="${root}${u.link}">Details</a>` : ''
        }</span></li>`
    )
    .join('');

  const featured = [
    research.find((r) => r.id === 'ddr4-phy-rx'),
    research.find((r) => r.id === 'mos2-dft'),
    projects.find((p) => p.id === 'sar-adc')
  ].filter(Boolean);
  const selected = featured
    .map((f) => {
      const href = f.kind ? `${root}research/#${f.id}` : `${root}projects/#${f.id}`;
      const meta = f.kind ? `${f.kind} · ${f.period}` : `${f.course.split(' · ')[1]} · ${f.term}`;
      return `<li><a class="row-link" href="${href}"><span class="row-title">${inline(f.title)}</span><span class="row-meta">${inline(meta)}</span><span class="row-desc">${inline(f.short || f.summary)}</span></a></li>`;
    })
    .join('');

  const body = `
<section class="intro">
  <div class="intro-text">
    <p class="eyebrow">${esc(site.role)}<br>${esc(site.institute)}</p>
    <h1>${esc(site.name)}</h1>
    <p class="lede">I am a final-year student in Electrical Engineering at IIT Bombay, specialising in integrated circuits and systems. I like problems where the physics of a channel or a material sets the terms, and the work is to understand it well enough to design around it.</p>
    <p>My dual degree project, guided by <strong>Prof. Laxmeesha Somappa</strong>, is a 1.6 Gbps receiver front-end for a DDR4 PHY in 65 nm CMOS. This summer I worked with <strong>Dr. Raja Sen</strong> and <strong>Dr. Nathalie Vast</strong> at École Polytechnique on a first-principles study of monolayer MoS₂. Before that I was a fellow at the National University of Singapore, and I now teach-assist a course on testing and verification of VLSI circuits.</p>
    <p>${inline(site.availability)}</p>
    ${links.length ? `<p class="links">${links.join('<span aria-hidden="true"> · </span>')}</p>` : ''}
  </div>
  <figure class="portrait">
    <img src="${root}img/jatin.webp" width="498" height="498" alt="Portrait of ${esc(site.name)}" fetchpriority="high">
  </figure>
</section>

<section class="block" aria-labelledby="interests">
  <h2 id="interests">Research interests</h2>
  <ul class="plain-list">${interests}</ul>
</section>

<section class="block" aria-labelledby="selected">
  <div class="block-head"><h2 id="selected">Selected work</h2><a class="more" href="${root}research/">All research</a></div>
  <ul class="row-list">${selected}</ul>
</section>

<section class="block" aria-labelledby="updates">
  <h2 id="updates">Updates</h2>
  <ul class="timeline">${ups}</ul>
</section>
`;

  return { title: '', description: plain(site.description), active: 'home', depth: 0, path: '', body, wide: true };
}
