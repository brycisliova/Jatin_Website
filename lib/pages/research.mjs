import { esc, inline, plain, ARROW } from '../util.mjs';

const RX_CHAIN = `
<svg class="diagram" viewBox="0 0 640 120" role="img" aria-labelledby="rx-t rx-d">
  <title id="rx-t">Receiver signal chain</title>
  <desc id="rx-d">Transmitter, FR4 channel, CTLE, DFE and CDR in sequence. The CTLE is designed and characterised; the DFE and CDR are in progress.</desc>
  <defs><marker id="rx-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1l9 4-9 4z" fill="currentColor"/></marker></defs>
  <g class="d-line">
    <path d="M70 52h30" marker-end="url(#rx-a)"/>
    <path d="M190 52h30" marker-end="url(#rx-a)"/>
    <path d="M300 52h30" marker-end="url(#rx-a)"/>
    <path d="M410 52h30" marker-end="url(#rx-a)"/>
    <path d="M520 52h30" marker-end="url(#rx-a)"/>
  </g>
  <g class="d-box"><rect x="10" y="32" width="60" height="40" rx="3"/><text x="40" y="57">TX</text></g>
  <g class="d-box"><rect x="100" y="32" width="90" height="40" rx="3"/><text x="145" y="57">FR4 channel</text></g>
  <g class="d-box d-done"><rect x="220" y="32" width="80" height="40" rx="3"/><text x="260" y="57">CTLE</text></g>
  <g class="d-box d-wip"><rect x="330" y="32" width="80" height="40" rx="3"/><text x="370" y="57">DFE</text></g>
  <g class="d-box d-wip"><rect x="440" y="32" width="80" height="40" rx="3"/><text x="480" y="57">CDR</text></g>
  <text class="d-note" x="558" y="57">data</text>
  <g class="d-key">
    <rect x="220" y="94" width="14" height="10" rx="2" class="k-done"/><text x="240" y="103">designed and characterised</text>
    <rect x="410" y="94" width="14" height="10" rx="2" class="k-wip"/><text x="430" y="103">in progress</text>
  </g>
</svg>`;

const DIAGRAMS = { 'rx-chain': RX_CHAIN };

function results(r) {
  if (!r.results?.length) return '';
  const cells = r.results
    .map((x) => {
      let val;
      if (x.from) val = `<span class="num">${esc(x.from)}</span>${ARROW}<span class="num">${esc(x.to)}</span> <span class="unit">${esc(x.unit)}</span>`;
      else if (x.delta) val = `<span class="num">${esc(x.delta)}</span>`;
      else val = `<span class="num">${esc(x.value)}</span> <span class="unit">${esc(x.unit)}</span>`;
      return `<div class="result"><dt>${esc(x.label)}</dt><dd>${val}${x.note ? `<span class="result-note">${inline(x.note)}</span>` : ''}</dd></div>`;
    })
    .join('');
  return `<dl class="results">${cells}</dl>${r.resultsNote ? `<p class="fine">${esc(r.resultsNote)}</p>` : ''}`;
}

export function research(ctx) {
  const items = ctx.research
    .map((r) => {
      const advisors = r.advisors?.length
        ? `<p class="meta-line">${r.advisors.map((a) => `${esc(a.name)} <span class="faint">(${esc(a.role)})</span>`).join(' · ')}</p>`
        : '';
      const fig = r.figure
        ? `<figure class="figure"><img src="${esc(r.figure.src)}" alt="${esc(r.figure.alt)}" loading="lazy"><figcaption>${inline(r.figure.caption || '')}</figcaption></figure>`
        : r.diagram
          ? `<figure class="figure">${DIAGRAMS[r.diagram]}</figure>`
          : '';
      return `
<article class="entry" id="${esc(r.id)}">
  <header>
    <p class="meta-line"><span class="status ${r.status === 'In progress' ? 'is-live' : ''}">${esc(r.status)}</span> · ${esc(r.kind)} · ${esc(r.period)}</p>
    <h2>${inline(r.title)}</h2>
    <p class="meta-line">${inline(r.where)}</p>
    ${advisors}
  </header>
  ${r.summary.map((s) => `<p>${inline(s)}</p>`).join('')}
  ${results(r)}
  ${fig}
  ${r.points?.length ? `<ul class="bullets">${r.points.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>` : ''}
  <p class="tags">${r.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</p>
</article>`;
    })
    .join('');

  const body = `
<header class="page-head">
  <h1>Research</h1>
  <p class="lede">Current and recent research work. Coursework projects are on the <a href="../projects/">projects page</a>.</p>
</header>
${items}`;
  return { title: 'Research', description: 'Research by Jatin Kumar: a DDR4 PHY receiver front-end, a first-principles study of monolayer MoS2, and the NUS Young Fellowship.', active: 'research', depth: 1, path: 'research/', body };
}
