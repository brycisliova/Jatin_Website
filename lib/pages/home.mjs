import { esc, inline, plain } from '../util.mjs';
import { contactLinks } from '../layout.mjs';

export function home(ctx) {
  const { site, updates, research, projects } = ctx;
  const root = '';
  const links = contactLinks(site, root);

  const interests = [
    ['High-speed wireline and memory interfaces', 'channel modelling, equalization and clock-and-data recovery'],
    ['Analog and mixed-signal circuits', 'amplifiers, data converters and their layout'],
    ['Devices and materials', 'optoelectronic devices and first-principles calculations of 2D materials']
  ]
    .map(([t, d]) => `<li>${t}: ${d}</li>`)
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
    <h1>${esc(site.name)}</h1>
    <p class="affil">${esc(site.role)}<br>${esc(site.institute)}<br>Specialization: ${esc(site.specialization)} · Expected graduation ${esc(site.graduation)}</p>
    <p>I am a final-year dual-degree student in Electrical Engineering at IIT Bombay. My interests are high-speed interface circuits, analog and mixed-signal design, and the modelling of electronic and optoelectronic materials and devices.</p>
    <p>My dual degree project, supervised by Prof. Laxmeesha Somappa, is a receiver front-end for a 1.6 Gbps DDR4-class link in TSMC 65 nm CMOS. The channel model and the CTLE are done, and the DFE and clock-and-data recovery come next. In summer 2026 I worked with Dr. Raja Sen and Dr. Nathalie Vast at LSI, École Polytechnique, on DFT calculations of monolayer MoS₂. In 2025 I was a fellow at the National University of Singapore. I am currently a teaching assistant for EE 709, Testing and Verification of VLSI Circuits.</p>
    <p>${inline(site.availability)}</p>
    ${links.length ? `<p class="links">${links.join('<span aria-hidden="true"> · </span>')}</p>` : ''}
  </div>
  <figure class="portrait">
    <img src="${root}img/jatin.webp" width="498" height="498" alt="Portrait of ${esc(site.name)}" fetchpriority="high">
  </figure>
</section>

<section class="block" aria-labelledby="interests">
  <h2 id="interests">Research interests</h2>
  <ul class="bullets">${interests}</ul>
</section>

<section class="block" aria-labelledby="selected">
  <div class="block-head"><h2 id="selected">Selected work</h2><a class="more" href="${root}research/">All research</a></div>
  <ul class="row-list">${selected}</ul>
</section>

<section class="block" aria-labelledby="updates">
  <h2 id="updates">News</h2>
  <ul class="timeline">${ups}</ul>
</section>
`;

  return { title: '', description: plain(site.description), active: 'home', depth: 0, path: '', body, wide: true };
}
