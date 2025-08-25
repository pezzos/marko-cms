# Repository Guidelines

## Project Structure & Module Organization
- content/<locale>/: Markdown pages per locale (e.g., `content/en/about.md`).
- _data/: Global data (e.g., `site.json`, optional `glossary.yml`).
- src/_includes/: Nunjucks layouts, partials, and base templates.
- src/assets/: Front-end assets (`css`, `js`, `img`).
- src/filters/, src/shortcodes/, src/generators/: Eleventy utilities and build helpers.
- static/: Files copied through as-is to the build.
- dist/: Production build output. Do not edit by hand.
- test/: Node test files (e.g., `*.test.js`).
- scripts/: Local CLI utilities (e.g., `new-page.mjs`).

## Build, Test, and Development Commands
- npm run dev: Start Tailwind watcher and Eleventy dev server.
- npm run build: Build CSS, run Eleventy, generate sitemap/RSS, and minify CSS.
- npm run prebuild: Create demo images used in examples.
- npm run lint: Syntax-check JS/TS files with `node --check`.
- npm test: Run unit tests via Node’s built-in test runner.
- npm run meta: Lint, test, prebuild, then perform a full build.
- npm run new:page -- --title "My Page": Scaffold a multilingual page (`--no-fr`, `--no-es` to skip locales).
- npm run new:post -- --title "My Post": Create a dated post in `src/content/posts/`.

## Coding Style & Naming Conventions
- Indentation: 2 spaces; LF line endings; UTF-8 (see `.editorconfig`).
- Modules: ESM by default (`"type": "module"`); use `.cjs` for CommonJS where needed.
- Filenames: kebab-case for content and assets (e.g., `my-page.md`, `hero-banner.jpg`).
- i18n slugs: Keep the same slug across locales (e.g., `about.md`).

## Testing Guidelines
- Framework: `node:test` with `assert/strict`.
- Location: `test/*.test.js`; name tests `*.test.js`.
- Run: `npm test` (or `node --test`). Keep tests fast and deterministic.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (e.g., `feat:`, `fix:`, `docs:`, `chore:`). Use imperative mood and concise scope.
- PRs: Include a clear description, linked issues, steps to validate, and screenshots for UI/content changes.
- Quality gate: Ensure `npm run meta` passes locally. Do not modify `dist/` directly; changes should flow from sources.

## Security & Configuration Tips
- Do not commit secrets. Configure service endpoints (e.g., Formspree) in source templates.
- Set site URL and locales in `_data/site.json`. Cloudflare Pages uses `npm run build` and outputs to `dist/`.
