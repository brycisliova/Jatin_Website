import { esc, inline, exists } from '../util.mjs';
import { contactLinks } from '../layout.mjs';

export function cv(ctx) {
  const { site, exp, projects } = ctx;
  const root = '../';
  const hasPdf = exists(`static/${site.cv.file}`);
  const acad = site.academics.showCpi && site.academics.cpi ? `<br>CPI: ${esc(site.academics.cpi)}` : '';

  const row = (period, main, sub, points) => `
<div class="cv-row">
  <div class="cv-when">${esc(period)}</div>
  <div class="cv-what">
    <p class="cv-title">${inline(main)}</p>
    ${sub ? `<p class="meta-line">${inline(sub)}</p>` : ''}
    ${points?.length ? `<ul class="bullets">${points.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>` : ''}
  </div>
</div>`;

  const education = exp.education.map((e) => row(e.period, e.degree, `${e.school}<br>${e.detail}${acad}`)).join('');
  const experience = exp.experience
    .map((e) => row(e.period, e.ref ? `<a href="../research/#${e.ref}">${e.title}</a>` : e.title, e.org, e.points))
    .join('');
  const projectRows = projects
    .map((p) => row(p.term, `<a href="../projects/#${p.id}">${p.title}</a>`, `${p.course} · ${p.guide}`))
    .join('');
  const service = exp.service.map((e) => row(e.period, e.title, e.org, e.points)).join('');
  const recognition = exp.recognition.map((r) => row('', r.title, r.detail)).join('');
  const skills = exp.skills
    .map((s) => `<div class="cv-row"><div class="cv-when">${esc(s.group)}</div><div class="cv-what"><p>${s.items.map(esc).join(', ')}</p></div></div>`)
    .join('');

  const links = contactLinks(site, root, { cv: false });
  const body = `
<header class="page-head">
  <h1>Curriculum vitae</h1>
  <p>${esc(site.name)} · ${esc(site.role)}, ${esc(site.institute)}</p>
  <p class="actions no-print">
    ${hasPdf ? `<a class="btn" href="../${esc(site.cv.file)}" download>Download PDF</a>` : ''}
    <button class="btn" type="button" data-print>Print this page</button>
  </p>
  ${links.length ? `<p class="links print-only">${links.join(' · ')}</p>` : ''}
</header>
<section class="cv-section"><h2>Education</h2>${education}</section>
<section class="cv-section"><h2>Research and professional experience</h2>${experience}</section>
<section class="cv-section"><h2>Projects</h2>${projectRows}</section>
<section class="cv-section"><h2>Teaching and service</h2>${service}</section>
<section class="cv-section"><h2>Recognition</h2>${recognition}</section>
<section class="cv-section"><h2>Technical skills</h2>${skills}</section>
<p class="fine no-print">Relevant courses are listed on the <a href="../coursework/">coursework page</a>.</p>`;
  return { title: 'Curriculum vitae', description: 'Curriculum vitae of Jatin Kumar: education, research experience, projects, teaching and technical skills.', active: 'cv', depth: 1, path: 'cv/', body };
}
