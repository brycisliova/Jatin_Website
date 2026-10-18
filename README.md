# jatin.website

Code and content for my personal academic website, [jatin.website](https://jatin.website).

I'm Jatin Kumar, a dual-degree (B.Tech. + M.Tech.) student in Electrical Engineering at IIT Bombay, specialising in Integrated Circuits and Systems. The site has my research, projects, coursework and CV, plus a page about what I do outside the lab.

## How it's put together

It's a plain static site. `build.mjs` reads the text in `content/` and writes ordinary HTML pages into `dist/`.

```
content/    text and data (JSON and Markdown)
lib/        page templates
static/     CSS, JavaScript, images
scripts/    local preview and link check
```

## Running it locally

```bash
npm install
npm run dev
```

The preview opens at http://localhost:4173. `npm run build` writes the site to `dist/`.

The site is hosted on GitHub Pages and updates whenever I push to `main`.

## Licence

Code is MIT licensed. The text, photographs and research content are mine; please don't reuse them without asking.
