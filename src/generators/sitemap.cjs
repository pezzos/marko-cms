const fs = require('fs');
const path = require('path');
const site = require('../../_data/site.json');

const distDir = path.join(process.cwd(), 'dist');

function collectUrls(locale) {
  const baseDir = locale === site.defaultLocale ? distDir : path.join(distDir, locale);
  const urls = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name === 'index.html') {
        let urlPath = '/' + path.relative(baseDir, fullPath).replace(/index.html$/, '');
        if (locale !== site.defaultLocale) {
          urlPath = `/${locale}${urlPath}`;
        }
        urls.push(new URL(urlPath, site.url).toString());
      }
    }
  }

  if (fs.existsSync(baseDir)) {
    walk(baseDir);
  }
  return urls;
}

function generateSitemap(locale) {
  const urls = collectUrls(locale);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>`;
  const filename = `sitemap-${locale}.xml`;
  fs.writeFileSync(path.join(distDir, filename), xml);
  return filename;
}

function generateIndex(files) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files.map(f => `  <sitemap><loc>${new URL('/' + f, site.url).toString()}</loc></sitemap>`).join('\n')}\n</sitemapindex>`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
}

const files = site.locales.map(generateSitemap);
generateIndex(files);
