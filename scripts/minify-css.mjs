import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import CleanCSS from 'clean-css';

const inputPath = './dist/static/assets/main.css';
const outputPath = './dist/assets/main.css';

const source = await readFile(inputPath, 'utf8');
const result = new CleanCSS().minify(source);

if (result.errors.length) {
  console.error(result.errors.join('\n'));
  process.exit(1);
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, result.styles);
