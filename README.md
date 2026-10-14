# Jatin Kumar · academic website

Source for my academic portfolio: research, projects, coursework, CV, and a few pages about life outside the lab.

The site is plain static HTML, CSS and a little JavaScript. A small Node script turns the files in `content/` into pages, so adding a project or a note is a one-file change. There is no framework, no tracking and no client-side rendering, so it loads fast and keeps working for years without maintenance.

## Pages

| Page | Source | Notes |
| --- | --- | --- |
| Home | `lib/pages/home.mjs`, `content/updates.json` | Introduction, interests, selected work, updates |
| Research | `content/research.json` | Long-form entries with results and an optional figure |
| Projects | `content/projects.json` | Course projects, filterable by area |
| Coursework | `content/coursework.json` | Courses grouped by theme, linked to projects |
| CV | `content/experience.json` | Print-friendly: "Print this page" saves a clean PDF |
| Beyond | `content/life.json` | Reading, writing, cooking, yoga, making |
| Notes | `content/notes/*.md` | Markdown posts. Appears in the menu once one is published |

## Run it locally

Requires Node 20 or newer.

```bash
npm install
npm run dev      # builds, serves at http://localhost:4173 and rebuilds on every save
npm run build    # writes the site to dist/
npm run check    # fails on broken links, missing anchors or images without alt text
```

## Everyday edits

**Change a fact** (a title, a number, a date): edit the matching file in `content/`. Each file is plain JSON. Short strings accept inline Markdown, such as `*italic*` and `[link](https://…)`.

**Fill in contact details**: open `content/site.json` and fill `contact.email` and the `links` block (GitHub, LinkedIn, Google Scholar, ORCID, blog). Anything left empty is hidden, so no dead links ship.

**Show your CPI**: set `academics.cpi` and `academics.showCpi` to `true` in `content/site.json`. It is hidden by default.

**Add a figure to a research entry**: put the image in `static/img/research/`, then set `figure` on that entry in `content/research.json`:

```json
"figure": { "src": "../img/research/ctle-eye.webp", "alt": "Eye diagram before and after the CTLE", "caption": "Eye diagram at 1.6 Gbps." }
```

**Publish a note**: copy `content/notes/_template.md` to a new name, write the post, and delete the `draft: true` line. Notes use Markdown with a small front-matter block at the top.

**Add a CV PDF**: save it as `static/cv/Jatin_Kumar_CV.pdf`. A "Download PDF" button then appears on the CV page. Use a version without date of birth or other personal identifiers, because this file is public.

**Photo**: `static/img/jatin.webp` (square, shown as a circle).

## Deploying

Pushes to `main` build and deploy automatically with GitHub Actions (`.github/workflows/deploy.yml`).

1. Merge your work into `main`.
2. In the repository, go to **Settings → Pages → Build and deployment** and choose **GitHub Actions**.
3. The site is live at `https://<username>.github.io/<repository>/` after the workflow finishes.

### Custom domain

1. Buy the domain (for example `jatink.in`) from any registrar.
2. Put it in `content/site.json` as `"domain": "jatink.in"` and `"url": "https://jatink.in"`. The build then writes the `CNAME` file, canonical URLs and a sitemap.
3. In **Settings → Pages**, enter the domain and tick **Enforce HTTPS**.
4. At the registrar, add DNS records. For the apex domain add four `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`. For `www`, add a `CNAME` pointing to `<username>.github.io`.

### Keeping the repository private

A website is always public, but its source does not have to be.

- **GitHub Pages from a private repository** needs a paid GitHub plan (Pro, Team or Enterprise).
- **Cloudflare Pages, Netlify and Vercel** deploy from private repositories on their free plans. Connect the repository and use build command `npm run build` and output directory `dist`. They also handle custom domains and HTTPS.

Nothing in this repository is secret. The site contains only what is meant to be public, so a public repository is also fine, and many academics prefer it because it shows how the site was made.

## Layout

```
content/        all text: JSON data files and Markdown notes
lib/            page templates (plain JavaScript template strings)
static/         copied to the site as is: CSS, JS, images, favicon, CV PDF
scripts/        local preview server and the link checker
build.mjs       the generator
```

Fonts are Newsreader and IBM Plex Sans, self-hosted from `@fontsource` packages, so visitors make no requests to third-party servers.

## Accessibility and performance

- Semantic landmarks, a skip link, visible focus styles and AA colour contrast in light and dark themes
- Follows the system colour scheme, with a manual toggle
- No layout shift from fonts, images have explicit dimensions, and the menu and filters degrade gracefully without JavaScript
- The email address is assembled in the browser, so scrapers do not find it in the HTML

## Licence

The code (everything under `lib/`, `scripts/`, `build.mjs`, `static/css` and `static/js`) is released under the MIT licence. The text, photographs and research content are © Jatin Kumar, all rights reserved.
