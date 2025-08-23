# Project Brief

## Objective
Create a 100% Markdown static site auto-deployed on Cloudflare Pages with:
- shared header and footer
- clean HTML generation (SEO/OG/RSS/sitemap)
- contact form via Formspree
- comments via Staticman (PR moderated)
- an auto-linker that connects words/phrases to titles of other pages
- review through GitHub PRs. One commit → build → deploy. No painful CMS.

## Stack
- **SSG:** Eleventy (11ty) + Nunjucks
- **Styles:** Tailwind CSS (JIT) with PostCSS autoprefixer
- **Build:** Cloudflare Pages (Node 20), simple cache busting
- **Comments:** Staticman v3 (GitHub App) with config in `staticman.yml`
- **Contact:** Formspree (endpoint via environment variable)
- **Search:** Lunr.js index generated at build (serverless)
- **Analytics:** Cloudflare Web Analytics (cookie-less)
- **Quality:** ESLint + Prettier, link checker, minimal Lighthouse CI budget

## Repository Structure
```
/ (root)
├─ src/
│  ├─ content/
│  │  ├─ pages/
│  │  └─ posts/
│  ├─ data/
│  │  ├─ site.json
│  │  ├─ nav.json
│  │  └─ glossary.yml
│  ├─ layouts/
│  │  ├─ base.njk
│  │  ├─ page.njk
│  │  └─ post.njk
│  ├─ includes/
│  ├─ assets/
│  │  ├─ css/  └─ main.css
│  │  ├─ js/   └─ main.js
│  │  └─ img/
│  └─ filters/
├─ .eleventy.js
├─ staticman.yml
├─ static/
├─ netlify.toml (empty)
├─ package.json
├─ tailwind.config.cjs
├─ postcss.config.cjs
├─ README.md
└─ .github/workflows/
   ├─ ci.yml
   └─ lighthouse.yml
```

## Front Matter (minimal)
```
---
title: "Mare écologique & biodiversité"
description: "Concept, ROI, mise en œuvre à Icod."
date: 2025-06-30
tags: ["eau","biodiversité"]
layout: "page.njk"
---
```

## Auto-linker (build-time)
Source: `src/data/glossary.yml` where keys are regex-safe or exact strings and values are target slugs.
Rules:
- no linking inside code, headers, or blockquotes
- at most one identical link per paragraph
- no self-links
- backlinks generated
Implementation: Eleventy HTML post-render transform using linkedom with a DOM pass.

## Comments (Staticman)
`staticman.yml` sends comments to `data/comments/<slug>/YYYY-MM-DD-HHMM.json`.
An HTML form posts to the Staticman endpoint; honeypot and optional reCAPTCHA.
Each comment opens a PR to merge or close.

## Contact (Formspree)
Simple HTML form with action set by `FORMSPREE_ENDPOINT` environment variable.
Anti-spam via honeypot, `aria-hidden`, and `required` fields.

## Deployment
Cloudflare Pages with framework set to Eleventy.
Environment variables: `NODE_VERSION=20`, `FORMSPREE_ENDPOINT`, `SITE_BASEURL`, `CF_WEB_ANALYTICS_TOKEN`, `STATICMAN_BRANCH=main`.
Build command: `npm run build` → Eleventy + PostCSS + Tailwind + Lunr index generation.

## SEO / Accessibility
- `<meta>` tags for OG/Twitter and JSON-LD WebSite + BreadcrumbList
- automatic `sitemap.xml` and `robots.txt`
- AA contrast, skip-link, proper headings
- no loud carousels

## Security
Reasonable CSP: `self` + Cloudflare Analytics + Formspree + Staticman endpoint.
No inline scripts without nonce.
