import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const list=JSON.parse(await fs.readFile('asset-manifest.json','utf8'));
for(const item of list){
 const res=await fetch(item.url);
 if(!res.ok)throw new Error(`${res.status}: ${item.localFile}`);
 const bytes=Buffer.from(await res.arrayBuffer());
 if(bytes.length!==item.bytes||createHash('sha256').update(bytes).digest('hex')!==item.sha256)throw new Error(`Integrity failed: ${item.localFile}`);
 await fs.mkdir(path.dirname(item.localFile),{recursive:true});await fs.writeFile(item.localFile,bytes);
}
console.log(`Prepared ${list.length} verified resources.`);
