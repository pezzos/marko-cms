const fs = require('fs');
const path = require('path');
const site = require('../../_data/site.json');

const distDir = path.join(process.cwd(), 'dist');

function postsFor(locale) {
  const dir = locale === site.defaultLocale ? path.join(distDir, 'posts') : path.join(distDir, locale, 'posts');
  if (!fs.existsSync(dir)) return [];
  const posts = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const file = path.join(dir, entry.name, 'index.html');
      if (fs.existsSync(file)) {
        const urlPath = locale === site.defaultLocale ? `/posts/${entry.name}/` : `/${locale}/posts/${entry.name}/`;
        const url = new URL(urlPath, site.url).toString();
        const date = fs.statSync(file).mtime.toUTCString();
        posts.push({ url, title: entry.name, date });
      }
    }
  }
  return posts;
}

function generate(locale) {
  const posts = postsFor(locale);
  const filename = `feed-${locale}.${posts.length ? 'xml' : 'html'}`;
  const outPath = path.join(distDir, filename);

  if (!posts.length) {
    const html = `<!DOCTYPE html><html lang="${locale}"><head><meta charset=\"UTF-8\"><title>Feed pending</title></head><body><p>Feed pending</p></body></html>`;
    fs.writeFileSync(outPath, html);
    return filename;
  }

  const items = posts.map(p => `  <entry><title>${p.title}</title><link href="${p.url}"/><id>${p.url}</id><updated>${p.date}</updated></entry>`).join('\n');
  const xml = `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n<title>${site.title}</title>\n<link href="${site.url}"/>\n${items}\n</feed>`;
  fs.writeFileSync(outPath, xml);
  return filename;
}

site.locales.forEach(generate);
