// Fails the production build while any content item is still marked `placeholder: true`.
// Override for previews: ALLOW_PLACEHOLDERS=1 npm run build
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('src/content');
const found = [];
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
  const lines = fs.readFileSync(path.join(dir, file), 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (/placeholder:\s*true/.test(line)) {
      const label = (line.match(/(?:slug|id|name|title):\s*'([^']+)'/) ?? [])[1] ?? line.trim().slice(0, 60);
      found.push(`  src/content/${file}:${i + 1}  ${label}`);
    }
  });
}
const config = fs.readFileSync(path.join(dir, 'site.ts'), 'utf8');
const missing = ['email', 'location', 'socials'].filter((k) => new RegExp(`${k}:\\s*(undefined|\\[\\])`).test(config));

if (!found.length && !missing.length) {
  console.log('check:placeholders  OK: no placeholder content remains.');
  process.exit(0);
}
console.log(`\ncheck:placeholders  ${found.length} placeholder item(s) still in the content:\n`);
console.log(found.join('\n'));
if (missing.length) console.log(`\n  src/content/site.ts is missing real values for: ${missing.join(', ')}`);
console.log('\n  Also review: src/content/studio.ts (story, values), src/content/stack.ts (Partner entries), privacy "[to be confirmed]" lines.\n');
if (process.env.ALLOW_PLACEHOLDERS === '1') {
  console.log('ALLOW_PLACEHOLDERS=1 set: continuing. Do NOT deploy this build.\n');
  process.exit(0);
}
console.log('Build stopped. Replace the items above, or preview with ALLOW_PLACEHOLDERS=1.\n');
process.exit(1);
