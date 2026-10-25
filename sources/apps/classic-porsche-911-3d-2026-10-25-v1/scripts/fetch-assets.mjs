import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root = path.resolve(import.meta.dirname, '..');
const files = JSON.parse(await fs.readFile(path.join(root,'asset-integrity.json'),'utf8')).filter(file => file.localPath);
for (const file of files) {
  const response = await fetch(file.url);
  if (!response.ok) throw new Error(`${response.status}: ${file.url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length !== file.bytes || crypto.createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error(`Integrity mismatch: ${file.localPath}`);
  const target = path.join(root,'public',file.localPath);
  await fs.mkdir(path.dirname(target),{recursive:true}); await fs.writeFile(target,bytes);
}
console.log(`Downloaded and verified ${files.length} immutable app assets.`);
