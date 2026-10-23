from pathlib import Path
import json,urllib.request,hashlib
w=Path(__file__).parent
for a in json.loads((w/'asset-manifest.json').read_text()):
 folder=w/('fonts' if a.get('kind') else 'assets');folder.mkdir(exist_ok=True)
 b=urllib.request.urlopen(a['url'],timeout=60).read()
 assert len(b)==a['bytes'] and hashlib.sha256(b).hexdigest()==a['sha256'],a['name']
 (folder/a['name']).write_bytes(b)
print('All pinned illustration/font resources verified.')
