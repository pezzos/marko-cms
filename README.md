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

## Deploying to Cloudflare Pages

1. Connect your repository to [Cloudflare Pages](https://pages.cloudflare.com/).
2. Set the build command to `npm run build`.
3. Set the output directory to `dist/`.
4. Add environment variables if your setup requires them.

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

