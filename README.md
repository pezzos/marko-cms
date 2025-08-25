# Marko CMS

Marko CMS is a reusable static-site template that combines Markdown content and Eleventy layouts. A lightweight theme is provided via `static/assets/theme.css` with optional Tailwind CSS utilities. It is designed to be deployed on Cloudflare Pages and supports Formspree for forms and Staticman for comments.

## Installation

### Prerequisites

* [Node.js](https://nodejs.org/) and either npm or pnpm
* [Git](https://git-scm.com/)

### Steps

```bash
git clone https://github.com/pezzos/marko-cms.git
cd marko-cms
npm install      # or: pnpm install
npm run dev      # start the local development server
```

## Project Structure

```text
content/            Markdown files
layouts/            Shared HTML templates
public/             Static assets copied as-is
scripts/            Utility scripts (e.g., new:page)
.github/workflows/  GitHub Actions for automatic builds
```

## Internationalization

Content is organized by locale inside `content/<locale>` directories such as `content/en` or `content/fr`. Supported locales
and the default language are configured in `_data/site.json`.

To add a new language:

1. Add the locale code to the `locales` array in `_data/site.json` and update `defaultLocale` if needed.
2. Extend the `supported` list in `src/assets/js/i18n-detect.js` and provide translations in `src/filters/i18n.js`.
3. Create a matching `content/<locale>/` folder and add pages with the same slug as the English originals.

The `i18n-detect.js` script automatically redirects visitors based on their browser language and stores their choice in
`localStorage`. Remove the script reference from `src/_includes/base.njk` to disable this behaviour.

English (`en`) is the default language. When a translation string or page is missing, the site falls back to the English
version.

## Recipes

### Create a multilingual page with `new:page`

Run `npm run new:page -- --title "My Page"` to scaffold a new page. The script creates an English file and draft stubs for
other locales. Use flags like `--no-fr` or `--no-es` to skip specific languages. Translate the drafts and remove the `draft:
true` line when they are ready.

### Link pages across languages

Use the same slug for every translation (e.g., `content/en/about.md`, `content/fr/about.md`). The `lang-switcher.njk` partial automatically links translations with {% raw %}`{{ baseUrl | i18nPath(loc) }}`{% endraw %}. When linking inside content, generate localized URLs with {% raw %}`{{ '/contact/' | i18nPath(lang) }}`{% endraw %}.

### SEO / hreflang best practices

The `head-seo.njk` partial outputs canonical and `hreflang` links for every locale defined in `_data/site.json`. Ensure your
site URL is set correctly and that each translated page includes this partial to help search engines discover alternates.

## Deploying to Cloudflare Pages

1. Connect your repository to [Cloudflare Pages](https://pages.cloudflare.com/).
2. Set the build command to `npm run build`.
3. Set the output directory to `dist/`.
4. Add environment variables if your setup requires them.

Cloudflare Pages serves the site as static files, so no worker configuration is necessary.

## Forms with Formspree

1. Create a Formspree account and obtain an endpoint URL.
2. Replace the placeholder URL in `src/contact.njk` with your endpoint.
3. Deploy and test the form to confirm submissions are delivered.

## Comments with Staticman

1. Review the [Staticman documentation](https://staticman.net/docs/).
2. Fork the Staticman API, add a `staticman.yml` file to this repository and configure GitHub access.
3. Staticman will submit pull requests containing each new comment in Markdown.

## Planned Enhancements

* Automatic linking of keywords between pages
* RSS feed generation
* `npm run new:page` script for scaffolding

## Contributing

1. Fork the repository and create a feature branch.
2. Commit your changes and open a pull request.

Issues can be reported via the [GitHub issue tracker](https://github.com/your-user/marko-cms/issues).

This project is released under the [MIT License](./LICENSE).

