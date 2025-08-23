import fs from 'fs';
import path from 'path';

// Simple argument parser for --key=value pairs
const args = Object.fromEntries(
  process.argv.slice(2).map(arg => {
    const [key, ...rest] = arg.replace(/^--/, '').split('=');
    return [key, rest.length ? rest.join('=') : ''];
  })
);

const type = args.type || 'page';
const title = args.title || process.env.npm_config_title;
const providedSlug = args.slug || process.env.npm_config_slug;

if (!title) {
  console.error('Missing required --title argument');
  process.exit(1);
}

// Slugify function: lower-case, remove accents, non-alphanumeric to hyphen
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

const now = new Date();
let destDir;
let filename;

if (type === 'post') {
  const datePrefix = now.toISOString().slice(0, 10);
  destDir = path.join('src', 'content', 'posts');
  filename = `${datePrefix}-${slug}.md`;
} else {
  destDir = path.join('src', 'content', 'pages');
  filename = `${slug}.md`;
}

// Ensure destination directory exists
fs.mkdirSync(destDir, { recursive: true });

const filePath = path.join(destDir, filename);

const frontMatterLines = [
  '---',
  `title: "${title}"`,
  'description: ""',
];

if (type === 'post') {
  frontMatterLines.push(`date: "${now.toISOString()}"`);
}

frontMatterLines.push(`layout: "layouts/${type}.njk"`);
frontMatterLines.push('tags: []');
frontMatterLines.push('---', '', `# ${title}`, '', 'Contenu à écrire…', '');

fs.writeFileSync(filePath, frontMatterLines.join('\n'));

console.log(`Created ${filePath}`);

