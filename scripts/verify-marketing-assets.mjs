import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/marketing/approved-assets-20261102.json'), 'utf8'));
for (const asset of [...manifest.originals, ...manifest.deliveryVersions]) {
 if (!asset.path.startsWith('public/') || asset.path.includes('..')) throw new Error('Unsafe asset path');
 const bytes = fs.readFileSync(path.join(root, asset.path));
 if (crypto.createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error('Approved asset changed or disappeared: ' + asset.path);
 if (manifest.budgets[asset.path] && bytes.length > manifest.budgets[asset.path]) throw new Error('Critical image budget exceeded: ' + asset.path);
}
console.log(JSON.stringify({ marketingAssets: 'passed', originals: manifest.originals.length, deliveryVersions: manifest.deliveryVersions.length }));
