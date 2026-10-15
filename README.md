# Jatin Kumar: academic website

Personal academic website of Jatin Kumar, a dual-degree (B.Tech. + M.Tech.) student in Electrical Engineering at IIT Bombay, specialising in Integrated Circuits and Systems.

The site collects research, course projects, coursework, a CV and a few pages about life outside the lab. It is plain static HTML and CSS, generated from a small set of text files, with no framework, tracking or external requests.

## Contents of the site

| Page | Content | Source |
| --- | --- | --- |
| Home | Introduction, research interests, selected work, news | `lib/pages/home.mjs`, `content/updates.json` |
| Research | DDR4 PHY receiver front-end, MoS₂ first-principles study, NUS Young Fellowship | `content/research.json` |
| Projects | Course projects with results, figures and team contributions | `content/projects.json` |
| Coursework | Courses grouped by area, linked to their projects | `content/coursework.json` |
| CV | Education, experience, projects, teaching, skills; prints cleanly to PDF | `content/experience.json` |
| Beyond | Reading, writing, cooking, yoga, making things | `content/life.json` |
| Notes | Occasional writing in Markdown; appears in the menu once a note is published | `content/notes/*.md` |

## Repository layout

```
content/     all text and data: JSON files and Markdown notes
lib/         page templates
static/      files copied to the site as they are: CSS, JavaScript, images, favicon
scripts/     local preview server and link checker
build.mjs    the site generator
```

## Working with it

Requires Node 20 or newer.

```bash
npm install
npm run dev      # preview at http://localhost:4173, rebuilds on every save
npm run build    # writes the finished site to dist/
npm run check    # reports broken links, missing anchors and images without alt text
```

### Editing content

- **Text and numbers:** edit the matching JSON file in `content/`. Short strings accept inline Markdown.
- **Contact details and links:** `content/site.json`. Empty fields are hidden.
- **Figures and tables:** each entry in `research.json` and `projects.json` can list `tables` and `figures`. Images go in `static/img/research/` or `static/img/projects/`.
- **Collaborators:** project entries have a `team` list showing each person's contribution.
- **Notes:** copy `content/notes/_template.md`, write the note and remove `draft: true`.
- **CV PDF:** save it as `static/cv/Jatin_Kumar_CV.pdf` and a download button appears on the CV page.

## Design

A conventional academic layout: white background, dark text, blue links and Source Sans 3 (self-hosted). Tables use rules only, in the style of a paper. The site follows the system light or dark setting and has a print stylesheet for the CV.

## Deployment

Pushes to `main` build and publish the site through GitHub Actions (`.github/workflows/deploy.yml`).

## Licence

Code is released under the MIT licence (see `LICENSE`). Text, figures and photographs are © Jatin Kumar, all rights reserved. Figures from published papers belong to their authors.
