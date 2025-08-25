import fs from 'fs';
import path from 'path';

// Parse CLI arguments supporting "--key=value", "--key value" and flags
const rawArgs = process.argv.slice(2);
const args = {};
for (let i = 0; i < rawArgs.length; i++) {
  let arg = rawArgs[i];
  if (!arg.startsWith('--')) continue;
  arg = arg.slice(2);
  if (arg.includes('=')) {
    const [key, value] = arg.split('=');
    args[key] = value;
  } else {
    const next = rawArgs[i + 1];
    if (next && !next.startsWith('--')) {
      args[arg] = next;
      i++;
    } else {
      args[arg] = true;
    }
  }
}

const type = args.type || 'page';
const title = args.title;
const providedSlug = args.slug;

if (!title) {
  console.error('Missing required --title argument');
  process.exit(1);
}

// Slugify: lower-case, remove accents, non-alphanumeric to hyphen
const slugify = str =>
  str
    .normalize('NFD')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

const slug = providedSlug ? slugify(providedSlug) : slugify(title);

const now = new Date().toISOString();

if (type === 'post') {
  const locale = args.locale || args.lang || 'en';
  const destDir = path.join('content', locale, 'posts');
  fs.mkdirSync(destDir, { recursive: true });
  const datePrefix = now.slice(0, 10);
  const filePath = path.join(destDir, `${datePrefix}-${slug}.md`);
  const frontMatter = [
    '---',
    `title: "${title}"`,
    'description: ""',
    `date: "${now}"`,
    'layout: "post.njk"',
    'tags: ["posts"]',
    '---',
    `# ${title}`,
    '',
    'Content goes here…',
    '',
  ].join('\n');
  fs.writeFileSync(filePath, frontMatter);
  console.log(`Created ${filePath}`);
  process.exit(0);
}

// Multilingual pages
const languages = ['en'];
if (!args['no-fr']) languages.push('fr');
if (!args['no-es']) languages.push('es');

languages.forEach(lang => {
  const langDir = path.join('content', lang);
  fs.mkdirSync(langDir, { recursive: true });
  const filePath = path.join(langDir, `${slug}.md`);

  const frontMatterLines = [
    '---',
    `title: "${title}"`,
    'description: ""',
    `date: "${now}"`,
    'layout: "page.njk"',
  ];

  if (lang !== 'en') {
    frontMatterLines.push('draft: true');
  }

  frontMatterLines.push('---', '');

  let body = `# ${title}\n\nContent goes here…\n`;
  if (lang !== 'en') {
    body = `> **Needs translation**\n\n${body}`;
  }

  fs.writeFileSync(filePath, frontMatterLines.join('\n') + body);
  console.log(`Created ${filePath}`);
});
